import assert from "node:assert/strict";
import { test } from "node:test";
import { parseLocalizedNumber } from "@/lib/admin/form-values";
import { computeTotals, createCatalog, resolveLines } from "@/lib/cart";
import { emptyCheckoutForm } from "@/lib/checkout";
import { menu } from "@/data/menu";
import { menuItemToInput, recordToMenuItem, type ProductRecord } from "@/lib/products";
import { buildOrderMessage } from "@/lib/whatsapp";

test("prices typed in Western or Arabic-Indic digits become the same number", () => {
  const cases: [string, number][] = [
    ["45", 45],
    ["٤٥", 45],
    ["۴۵", 45], // Persian digits
    ["82.5", 82.5],
    ["82,5", 82.5],
    ["٨٢٫٥", 82.5], // Arabic decimal point
    ["٨٢،٥", 82.5], // Arabic comma
    ["45.50", 45.5],
    ["45.", 45],
    [" ٤٥ ", 45],
    ["0", 0],
  ];
  for (const [typed, expected] of cases) assert.equal(parseLocalizedNumber(typed), expected, typed);
});

test("an empty field means no value", () => {
  assert.equal(parseLocalizedNumber(""), null);
  assert.equal(parseLocalizedNumber("   "), null);
});

test("anything that is not a plain amount is refused, never guessed", () => {
  // "1,000" would otherwise be saved as 1 QAR; the form shows an error instead.
  for (const typed of ["1,000", "١٬٠٠٠", "1.000", "45.555", "1.2.3", "1e3", "0x10", "Infinity", "-5", "+5", "4 5", ".5", "abc", "45 QAR", "٤٥ ر.ق"]) {
    assert.ok(Number.isNaN(parseLocalizedNumber(typed)), typed);
  }
});

test("existing dishes: opening and saving in the editor keeps every price unchanged", () => {
  // The editor shows a stored number as String(n) and parses it back on save.
  const roundTrip = (n: number | null | undefined) => (typeof n === "number" ? parseLocalizedNumber(String(n)) : null);
  menu.forEach((item, index) => {
    const input = menuItemToInput(item, index);
    for (const field of ["price", "priceOne", "priceTwo", "offerPrice", "offerPriceOne", "offerPriceTwo", "sortOrder"] as const) {
      assert.equal(roundTrip(input[field]), input[field] ?? null, `${item.id}.${field}`);
    }
  });
  assert.equal(menu.length, 18);
});

test("saved prices are plain numbers, so cart totals and the WhatsApp order are identical", () => {
  const dish = (typed: { one: string; two: string; offerOne: string }): ProductRecord => ({
    id: "test-dish",
    category: "specials",
    nameAr: "طبق",
    nameEn: "Dish",
    pricingType: "serving",
    priceOne: parseLocalizedNumber(typed.one),
    priceTwo: parseLocalizedNumber(typed.two),
    offerActive: true,
    offerPriceOne: parseLocalizedNumber(typed.offerOne),
  });
  const arabic = dish({ one: "٤٥", two: "٨٢٫٥", offerOne: "٤٢" });
  const western = dish({ one: "45", two: "82.5", offerOne: "42" });
  assert.deepEqual(arabic, western);
  for (const field of ["priceOne", "priceTwo", "offerPriceOne"] as const) {
    assert.equal(typeof arabic[field], "number", field);
  }

  const order = (record: ProductRecord, locale: "ar" | "en") => {
    const item = recordToMenuItem(record);
    const lines = resolveLines(
      [
        { itemId: item.id, servingId: "one", quantity: 2 },
        { itemId: item.id, servingId: "two", quantity: 1 },
      ],
      createCatalog([item]),
    );
    const totals = computeTotals(lines, "pickup");
    const message = buildOrderMessage({
      locale,
      lines,
      totals,
      fulfillment: "pickup",
      customer: { ...emptyCheckoutForm, name: "Test", phone: "+97450000000" },
    });
    return { totals, message };
  };
  const result = order(arabic, "en");
  // 2 × 42 (offer for one person) + 1 × 82.5 = 166.5; pickup has no fee.
  assert.equal(result.totals.subtotal, 166.5);
  assert.ok(result.message.includes("166.5"), "subtotal in the WhatsApp message");
  for (const locale of ["ar", "en"] as const) {
    assert.equal(order(arabic, locale).message, order(western, locale).message, `${locale} message`);
  }
});
