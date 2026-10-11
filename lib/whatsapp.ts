import { restaurant } from "@/config/restaurant";
import type { CartTotals, Fulfillment, ResolvedLine } from "@/lib/cart";
import {
  cleanText,
  normalizePhone,
  type CheckoutForm,
} from "@/lib/checkout";
import { dictionaries } from "@/lib/dictionaries";
import { formatPrice, priceParts } from "@/lib/format-currency";
import type { Locale } from "@/lib/i18n";

export type OrderDetails = {
  locale: Locale;
  lines: ResolvedLine[];
  totals: CartTotals;
  fulfillment: Fulfillment;
  customer: CheckoutForm;
};

// Unicode directional isolates (invisible).
const LRI = "\u2066"; // LEFT-TO-RIGHT ISOLATE
const RLI = "\u2067"; // RIGHT-TO-LEFT ISOLATE
const PDI = "\u2069"; // POP DIRECTIONAL ISOLATE

/**
 * Arabic calculation line, e.g. "75 ر.ق × 2 = 150 ر.ق", protected from bidi
 * reordering in the WhatsApp message. The whole line is an LTR isolate, and
 * each "ر.ق" is its own RTL isolate: without that, numbers that follow the
 * Arabic letters are treated as Arabic numbers (bidi rule W2) and the line
 * still displays scrambled. Only this line is isolated, not the message.
 */
function arabicCalculationLine(unit: number, quantity: number, total: number): string {
  const amount = (value: number) => {
    const { value: number, currency } = priceParts(value, "ar");
    return `${number} ${RLI}${currency}${PDI}`;
  };
  return `${LRI}${amount(unit)} × ${quantity} = ${amount(total)}${PDI}`;
}

/** Builds the order text in the site language. */
export function buildOrderMessage(order: OrderDetails): string {
  const { locale, lines, totals, fulfillment, customer } = order;
  const t = dictionaries[locale].whatsapp;
  const servingLabels = dictionaries[locale].menu.serving;
  const price = (amount: number) => formatPrice(amount, locale);
  const text = (value: string) => cleanText(value);

  const out: string[] = [];
  out.push(`*${t.heading} | ${restaurant.brandName}*`, "");

  out.push(`*${t.items}*`);
  lines.forEach((line, index) => {
    const serving = line.servingId ? ` (${servingLabels[line.servingId]})` : "";
    out.push(`${index + 1}. ${line.item.name[locale]}${serving} × ${line.quantity}`);
    out.push(
      `   ${
        locale === "ar"
          ? arabicCalculationLine(line.unitPrice, line.quantity, line.lineTotal)
          : `${price(line.unitPrice)} × ${line.quantity} = ${price(line.lineTotal)}`
      }`,
    );
  });
  out.push("");

  out.push(`${t.subtotal}: ${price(totals.subtotal)}`);
  out.push(
    `${t.fulfillment}: ${fulfillment === "delivery" ? t.delivery : t.pickup}`,
  );
  out.push(
    `${fulfillment === "delivery" ? t.deliveryFee : t.pickupFee}: ${
      totals.fee === 0 ? t.free : price(totals.fee)
    }`,
  );
  out.push(`*${t.total}: ${price(totals.total)}*`, "");

  out.push(`*${t.customer}*`);
  out.push(`${t.name}: ${text(customer.name)}`);
  out.push(`${t.phone}: ${normalizePhone(customer.phone) ?? text(customer.phone)}`);

  if (fulfillment === "delivery") {
    out.push("", `*${t.address}*`);
    out.push(`${t.area}: ${text(customer.area)}`);
    out.push(`${t.street}: ${text(customer.street)}`);
    out.push(`${t.building}: ${text(customer.building)}`);
    if (text(customer.unit)) out.push(`${t.unit}: ${text(customer.unit)}`);
    if (text(customer.landmark)) {
      out.push(`${t.landmark}: ${text(customer.landmark)}`);
    }
  }

  const notes = cleanText(customer.notes, true);
  if (notes) out.push("", `*${t.notes}*`, notes);

  return out.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${restaurant.whatsapp.number}?text=${encodeURIComponent(
    message,
  )}`;
}
