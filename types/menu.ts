import type { Locale } from "@/lib/i18n";

export type Localized = Record<Locale, string>;

export type CategoryId = "specials" | "healthy" | "salads" | "pasta";

export type ServingId = "one" | "two";

export type ServingOption = {
  id: ServingId;
  price: number;
};

export type Pricing =
  | { type: "fixed"; price: number }
  | { type: "serving"; options: ServingOption[] };

export type MenuImage = {
  /**
   * Site path of a file in /public, e.g. "/photo.jpeg", or the image route
   * "/api/img/<id>" for photos uploaded from the admin workspace.
   */
  src: string;
  /** Served by the image route from S3 (not a static file). */
  remote?: boolean;
  width: number;
  height: number;
  alt: Localized;
  /**
   * Low-resolution source: show it at a modest, contained size instead of
   * stretching it to fill the card, so it does not look soft.
   */
  lowResolution?: boolean;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: Localized;
  ingredients?: Record<Locale, string[]>;
  pricing: Pricing;
  /** Without an image the card shows a branded placeholder. */
  image?: MenuImage;
  available: boolean;
  /** Active offer. Prices replace the regular ones while it is set. */
  offer?: Offer;
  /** Shown in the home page highlights. */
  featured?: boolean;
  /**
   * Reserved for allergen information. Leave empty until the restaurant
   * verifies allergens; nothing here is shown to customers yet.
   */
  allergens?: string[];
};

export type Offer = {
  label?: Localized;
  /** Offer price for fixed-price dishes. */
  price?: number;
  /** Offer prices per serving for dishes with serving options. */
  servingPrices?: Partial<Record<ServingId, number>>;
};

export type MenuCategory = {
  id: CategoryId;
  name: Localized;
  /** Shorter label for the filter buttons; falls back to name. */
  shortName?: Localized;
};
