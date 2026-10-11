import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

/**
 * Restaurant settings. Values set to `null` are not confirmed yet and must
 * not appear on the customer-facing site until the owner confirms them.
 */
export const restaurant = {
  brandName: "mama food by AMMON",

  // From the Arabic menu artwork. No English slogan has been approved.
  slogan: {
    ar: "مهما جربت، أكل ماما غير",
    en: null,
  } satisfies Record<Locale, string | null>,

  whatsapp: {
    // wa.me format: country code + number, digits only.
    number: "97451184219",
    display: "+974 5118 4219",
  },

  currency: {
    code: "QAR",
    label: { ar: "ر.ق", en: "QAR" } satisfies Localized,
  },

  fees: {
    delivery: 10,
    pickup: 0,
  },

  // CR number shown on the menu artwork. Kept unpublished until confirmed.
  commercialRegistration: {
    number: "249039",
    publish: false,
  },

  // Pending: not confirmed by the owner.
  city: null as Localized | null,
  pickupAddress: null as Localized | null,
  deliveryZones: null as Localized[] | null,
  openingHours: null as Localized | null,
  email: null as string | null,
  socialLinks: null as Record<string, string> | null,
} as const;

// Production URL, e.g. https://example.com. Not confirmed yet; when unset,
// absolute URLs (canonical, hreflang, Open Graph) are left out of metadata.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;
