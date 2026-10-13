import type { CategoryId, MenuItem, Offer } from "@/types/menu";

/** A Product record as stored in the backend (AppSync / DynamoDB). */
export type ProductRecord = {
  id: string;
  category: CategoryId;
  nameAr: string;
  nameEn: string;
  ingredientsAr?: (string | null)[] | null;
  ingredientsEn?: (string | null)[] | null;
  pricingType: "fixed" | "serving";
  price?: number | null;
  priceOne?: number | null;
  priceTwo?: number | null;
  offerActive?: boolean | null;
  offerPrice?: number | null;
  offerPriceOne?: number | null;
  offerPriceTwo?: number | null;
  offerLabelAr?: string | null;
  offerLabelEn?: string | null;
  imagePath?: string | null;
  imageKey?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  imageAltAr?: string | null;
  imageAltEn?: string | null;
  imageLowResolution?: boolean | null;
  available?: boolean | null;
  featured?: boolean | null;
  sortOrder?: number | null;
  updatedAt?: string | null;
};

/** Fields that make up a product, without backend bookkeeping. */
export type ProductInput = Omit<ProductRecord, "updatedAt">;

export const PRODUCT_FIELDS = `
  id category nameAr nameEn ingredientsAr ingredientsEn
  pricingType price priceOne priceTwo
  offerActive offerPrice offerPriceOne offerPriceTwo offerLabelAr offerLabelEn
  imagePath imageKey imageWidth imageHeight imageAltAr imageAltEn imageLowResolution
  available featured sortOrder updatedAt
`;

const clean = (list?: (string | null)[] | null) =>
  (list ?? []).map((s) => (s ?? "").trim()).filter(Boolean);

/** Public link for a product photo uploaded to S3 (see app/api/img). */
export function uploadedImagePath(id: string, version?: string | null) {
  return `/api/img/${encodeURIComponent(id)}${version ? `?v=${encodeURIComponent(version)}` : ""}`;
}

export function recordToMenuItem(r: ProductRecord): MenuItem {
  const ingredientsAr = clean(r.ingredientsAr);
  const ingredientsEn = clean(r.ingredientsEn);

  const pricing: MenuItem["pricing"] =
    r.pricingType === "serving"
      ? {
          type: "serving",
          options: [
            { id: "one", price: r.priceOne ?? 0 },
            { id: "two", price: r.priceTwo ?? 0 },
          ],
        }
      : { type: "fixed", price: r.price ?? 0 };

  let offer: Offer | undefined;
  if (r.offerActive) {
    offer = {
      label:
        r.offerLabelAr || r.offerLabelEn
          ? { ar: r.offerLabelAr ?? "", en: r.offerLabelEn ?? "" }
          : undefined,
      price: r.offerPrice ?? undefined,
      servingPrices: {
        one: r.offerPriceOne ?? undefined,
        two: r.offerPriceTwo ?? undefined,
      },
    };
  }

  const alt = {
    ar: r.imageAltAr || r.nameAr,
    en: r.imageAltEn || r.nameEn,
  };
  const image = r.imageKey
    ? {
        src: uploadedImagePath(r.id, r.updatedAt),
        remote: true,
        width: r.imageWidth || 1200,
        height: r.imageHeight || 900,
        alt,
      }
    : r.imagePath
      ? {
          src: r.imagePath,
          width: r.imageWidth || 828,
          height: r.imageHeight || 1000,
          alt,
          lowResolution: r.imageLowResolution || undefined,
        }
      : undefined;

  return {
    id: r.id,
    category: r.category,
    name: { ar: r.nameAr, en: r.nameEn },
    ingredients:
      ingredientsAr.length || ingredientsEn.length
        ? { ar: ingredientsAr, en: ingredientsEn }
        : undefined,
    pricing,
    image,
    available: r.available !== false,
    offer,
    featured: r.featured || undefined,
  };
}

/** Converts a menu item (e.g. from data/menu.ts) into a backend product. */
export function menuItemToInput(item: MenuItem, sortOrder: number): ProductInput {
  const serving = item.pricing.type === "serving" ? item.pricing.options : [];
  return {
    id: item.id,
    category: item.category,
    nameAr: item.name.ar,
    nameEn: item.name.en,
    ingredientsAr: item.ingredients?.ar ?? [],
    ingredientsEn: item.ingredients?.en ?? [],
    pricingType: item.pricing.type,
    price: item.pricing.type === "fixed" ? item.pricing.price : null,
    priceOne: serving.find((o) => o.id === "one")?.price ?? null,
    priceTwo: serving.find((o) => o.id === "two")?.price ?? null,
    offerActive: false,
    imagePath: item.image && !item.image.remote ? item.image.src : null,
    imageKey: null,
    imageWidth: item.image?.width ?? null,
    imageHeight: item.image?.height ?? null,
    imageAltAr: item.image?.alt.ar ?? null,
    imageAltEn: item.image?.alt.en ?? null,
    imageLowResolution: item.image?.lowResolution ?? false,
    available: item.available,
    featured: Boolean(item.image) && sortOrder < 8,
    sortOrder,
  };
}

/** Category order, then admin sort order, then name. */
export function sortRecords<T extends ProductRecord>(records: T[]): T[] {
  const order: CategoryId[] = ["specials", "healthy", "salads", "pasta"];
  return [...records].sort(
    (a, b) =>
      order.indexOf(a.category) - order.indexOf(b.category) ||
      (a.sortOrder ?? 999) - (b.sortOrder ?? 999) ||
      a.nameEn.localeCompare(b.nameEn),
  );
}
