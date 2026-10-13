import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

/** Official order number (wa.me format: country code + number, digits only). */
const OFFICIAL_WHATSAPP = "97451184219";

/**
 * A staging or sandbox deployment can set NEXT_PUBLIC_WHATSAPP_NUMBER so its
 * test orders never reach the restaurant. Production sets no override and
 * always uses the official number.
 */
const override = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
const whatsappNumber = /^\d{8,15}$/.test(override) ? override : OFFICIAL_WHATSAPP;

/** "97451184219" → "+974 5118 4219". */
function displayNumber(digits: string): string {
  return digits.length === 11 && digits.startsWith("974")
    ? `+974 ${digits.slice(3, 7)} ${digits.slice(7)}`
    : `+${digits}`;
}

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
    number: whatsappNumber,
    display: displayNumber(whatsappNumber),
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

// Public address of the live site (Amplify). Used for absolute links in
// metadata, e.g. share previews. Override with NEXT_PUBLIC_SITE_URL when a
// custom domain is added.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://main.d3aemlkufsnwlw.amplifyapp.com";
