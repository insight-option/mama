import { restaurant } from "@/config/restaurant";
import { numberLocale, type Locale } from "@/lib/i18n";

const formatter = new Intl.NumberFormat(numberLocale, {
  maximumFractionDigits: 2,
});

/** The number and currency label separately, for bidi-safe rendering. */
export function priceParts(
  amount: number,
  locale: Locale,
): { value: string; currency: string } {
  return {
    value: formatter.format(amount),
    currency: restaurant.currency.label[locale],
  };
}

/**
 * Plain-text price: "10 ر.ق" in Arabic, "QAR 10" in English. Always Western
 * digits. In the page UI use the <Price> component instead, which isolates
 * the number from surrounding Arabic text.
 */
export function formatPrice(amount: number, locale: Locale): string {
  const { value, currency } = priceParts(amount, locale);
  return locale === "ar" ? `${value} ${currency}` : `${currency} ${value}`;
}
