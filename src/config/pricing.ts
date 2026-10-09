import type { Addons, Currency, Industry, Objective, PresetId, VideoTier } from "@/features/estimator/types";

/**
 * Central estimator configuration. Every price and assumption below is an
 * editable DEMONSTRATION value from the blueprint — not a binding quotation or
 * a verified market benchmark. Change values here only; the UI derives from it.
 */
export const ESTIMATOR_CONFIG = {
  brandName: "FONTAINE",
  productName: "Smart Growth AI",
  defaultLocale: "ar",
  supportedLocales: ["ar", "en"],
  baseCurrency: "QAR",
  supportedCurrencies: ["QAR", "USD", "SAR"],
  videoUnitQar: { quick: 220, professional: 450, cinematic: 850 } satisfies Record<VideoTier, number>,
  videoQuantity: { min: 0, max: 20, step: 2, default: 6 },
  adBudgetQar: { off: 0, min: 750, max: 20_000, step: 250, default: 3_000, customMax: 500_000 },
  management: { minQar: 750, rate: 0.15 },
  addonsQar: { landingPage: 1_500, pixelCapi: 750 },
  forecastEnabled: true,
  configVersion: "v1-draft",
  effectiveDate: "2026-10-09",
  /** Arabic UI digits: "latn" (0-9, common in Qatari commerce) or "arab" (٠-٩). */
  arabicNumberingSystem: "latn" as "latn" | "arab",
} as const;

export type FxRate = {
  base: "QAR";
  quote: Currency;
  /** Units of `quote` per 1 QAR. */
  rate: number;
  asOf: string;
  source: string;
};

/**
 * Exchange rates. USD derives from the Qatar Central Bank fixed parity
 * (USD 1 = QAR 3.64). SAR is an administrator-configured cross rate from the
 * two official USD pegs (SAR 3.75 / QAR 3.64) and must be confirmed by the
 * owner before release. No live rate is fetched.
 */
export const FX_RATES: Record<Currency, FxRate> = {
  QAR: { base: "QAR", quote: "QAR", rate: 1, asOf: "2026-10-09", source: "base" },
  USD: { base: "QAR", quote: "USD", rate: 1 / 3.64, asOf: "2026-10-09", source: "qcbParity" },
  SAR: { base: "QAR", quote: "SAR", rate: 3.75 / 3.64, asOf: "2026-10-09", source: "adminCrossRate" },
};

/** A conversion older than this is treated as stale and the UI falls back to QAR. */
export const FX_MAX_AGE_DAYS = 365;

export type Preset = {
  id: PresetId;
  videoTier: VideoTier;
  videoQuantity: number;
  adBudgetQar: number;
  addons: Addons;
};

/** Package presets — starting points only, always editable, never a promise of results. */
export const PRESETS: Record<PresetId, Preset> = {
  starter: {
    id: "starter",
    videoTier: "quick",
    videoQuantity: 4,
    adBudgetQar: 1_500,
    addons: { landingPage: false, pixelCapi: true, customWebApp: false },
  },
  growth: {
    id: "growth",
    videoTier: "professional",
    videoQuantity: 6,
    adBudgetQar: 3_000,
    addons: { landingPage: true, pixelCapi: true, customWebApp: false },
  },
  scale: {
    id: "scale",
    videoTier: "professional",
    videoQuantity: 12,
    adBudgetQar: 8_000,
    addons: { landingPage: true, pixelCapi: true, customWebApp: false },
  },
};

export type Range = { low: number; high: number };

export type Provenance = "illustrative" | "calibrated" | "live";

export type ForecastProfile = {
  /** Cost per 1,000 impressions in QAR — low (optimistic) / high (conservative). */
  cpmQar: Range;
  frequency: Range;
  /** Cost per enquiry in QAR; null when no enquiry assumption exists. */
  cpeQar: Range | null;
  provenance: Provenance;
  addressableAudience?: number;
};

/** Generic sample from the blueprint — deliberately NOT verified Qatar campaign data. */
const GENERIC_PROFILE: ForecastProfile = {
  cpmQar: { low: 30, high: 60 },
  frequency: { low: 1.8, high: 2.8 },
  cpeQar: { low: 50, high: 120 },
  provenance: "illustrative",
};

/**
 * Per-industry forecast profiles. Every industry currently shares the generic
 * sample; replace with calibrated first-party data when available. "other" has
 * no profile on purpose, so the UI shows "forecast unavailable" instead of
 * inventing a range.
 */
export const FORECAST_PROFILES: Record<Industry, ForecastProfile | null> = {
  restaurants: GENERIC_PROFILE,
  automotive: GENERIC_PROFILE,
  realEstate: GENERIC_PROFILE,
  ecommerce: GENERIC_PROFILE,
  professional: GENERIC_PROFILE,
  healthBeauty: GENERIC_PROFILE,
  other: null,
};

/** Profile used to explain the methodology on the page. */
export const METHODOLOGY_PROFILE = GENERIC_PROFILE;

export type OutcomeKind = "conversations" | "leads";

/** Forecast display decision matrix (blueprint section 08). */
export const OBJECTIVE_FORECAST_RULES: Record<
  Objective,
  { outcome: OutcomeKind | null; unavailable: "bookings" | "sales" | null }
> = {
  awareness: { outcome: null, unavailable: null },
  messages: { outcome: "conversations", unavailable: null },
  leads: { outcome: "leads", unavailable: null },
  bookings: { outcome: null, unavailable: "bookings" },
  store_sales: { outcome: null, unavailable: "sales" },
  launch: { outcome: null, unavailable: null },
};
