import assert from "node:assert/strict";
import { test } from "node:test";
import { menu } from "@/data/menu";
import { menuItemToInput, recordToMenuItem, sortRecords, type ProductRecord } from "@/lib/products";

test("every bundled dish survives import into the backend shape unchanged", () => {
  menu.forEach((item, index) => {
    const back = recordToMenuItem(menuItemToInput(item, index));
    assert.equal(back.id, item.id);
    assert.equal(back.category, item.category);
    assert.deepEqual(back.name, item.name);
    assert.deepEqual(back.pricing, item.pricing);
    assert.equal(back.available, item.available);
    assert.equal(back.image?.src, item.image?.src, `image of ${item.id}`);
    if (item.ingredients?.ar.length || item.ingredients?.en.length) {
      assert.deepEqual(back.ingredients, item.ingredients, `ingredients of ${item.id}`);
    }
  });
});

const base: ProductRecord = {
  id: "mansaf",
  category: "specials",
  nameAr: "منسف",
  nameEn: "Mansaf",
  pricingType: "serving",
  priceOne: 5,
  priceTwo: 9,
};

test("an active offer carries its serving prices and label", () => {
  const item = recordToMenuItem({
    ...base,
    offerActive: true,
    offerPriceOne: 4,
    offerLabelAr: "عرض",
    offerLabelEn: "Deal",
  });
  assert.deepEqual(item.offer?.label, { ar: "عرض", en: "Deal" });
  assert.equal(item.offer?.servingPrices?.one, 4);
  assert.equal(item.offer?.servingPrices?.two, undefined);
});

test("an inactive offer is ignored even if prices are left over", () => {
  assert.equal(recordToMenuItem({ ...base, offerActive: false, offerPriceOne: 4 }).offer, undefined);
});

test("an uploaded photo is served through the stable /api/img link, versioned by updatedAt", () => {
  const item = recordToMenuItem({ ...base, imageKey: "products/mansaf-abc.jpg", updatedAt: "2026-10-12T10:00:00Z" });
  assert.equal(item.image?.src, "/api/img/mansaf?v=2026-10-12T10%3A00%3A00Z");
  assert.equal(item.image?.remote, true);
});

test("hidden products stay hidden; missing flag means available", () => {
  assert.equal(recordToMenuItem({ ...base, available: false }).available, false);
  assert.equal(recordToMenuItem({ ...base, available: null }).available, true);
});

test("sorting follows category order, then sort order, then English name", () => {
  const r = (id: string, category: ProductRecord["category"], sortOrder: number | null, nameEn = id) => ({
    ...base,
    id,
    category,
    sortOrder,
    nameEn,
  });
  const sorted = sortRecords([
    r("penne", "pasta", 1),
    r("salad-b", "salads", null, "B"),
    r("salad-a", "salads", null, "A"),
    r("maqluba", "specials", 2),
    r("mansaf", "specials", 1),
  ]);
  assert.deepEqual(
    sorted.map((x) => x.id),
    ["mansaf", "maqluba", "salad-a", "salad-b", "penne"],
  );
});
