export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const CURRENCIES = ["QAR", "USD", "SAR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const VIDEO_TIERS = ["quick", "professional", "cinematic"] as const;
export type VideoTier = (typeof VIDEO_TIERS)[number];

export const INDUSTRIES = [
  "restaurants",
  "automotive",
  "realEstate",
  "ecommerce",
  "professional",
  "healthBeauty",
  "other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const OBJECTIVES = ["awareness", "messages", "leads", "bookings", "store_sales", "launch"] as const;
export type Objective = (typeof OBJECTIVES)[number];

export const MARKETS = ["qatar", "doha", "lusail", "alRayyan", "alWakrah", "alKhor", "gcc"] as const;
export type Market = (typeof MARKETS)[number];

export const CHANNELS = ["whatsapp", "form", "bookings", "checkout"] as const;
export type Channel = (typeof CHANNELS)[number];

export const TIMELINES = ["now", "month", "later"] as const;
export type Timeline = (typeof TIMELINES)[number];

export const PRESET_IDS = ["starter", "growth", "scale"] as const;
export type PresetId = (typeof PRESET_IDS)[number];

export type Addons = {
  landingPage: boolean;
  pixelCapi: boolean;
  customWebApp: boolean;
};

export const STEP_IDS = ["context", "videos", "ads", "addons", "review"] as const;
export type StepId = (typeof STEP_IDS)[number];

/** The single typed state object for the estimator. Contains no personal data. */
export type EstimatorState = {
  industry: Industry | null;
  objective: Objective | null;
  market: Market;
  channel: Channel | null;
  videoTier: VideoTier;
  videoQuantity: number;
  /** Whole Qatari riyals; 0 means paid campaigns are off. */
  adBudgetQar: number;
  addons: Addons;
  preset: PresetId | null;
  step: number;
  currency: Currency;
};

/** Contract from the blueprint (section 13); money is in QAR minor units (dirhams). */
export type EstimateInput = {
  locale: Locale;
  displayCurrency: Currency;
  industry: Industry | null;
  objective: Objective | null;
  targetMarket: Market;
  videoTier: VideoTier;
  videoQuantity: number;
  adBudgetQarMinor: number;
  addons: Addons;
};

export type QuoteSnapshot = {
  id: string;
  createdAt: string;
  priceConfigVersion: string;
  priceConfigEffectiveDate: string;
  canonicalCurrency: "QAR";
  input: EstimateInput;
  monthlyTotalQarMinor: number;
  oneTimeTotalQarMinor: number;
  firstMonthTotalQarMinor: number;
  customQuoteRequired: boolean;
};

/** Optional contact details. Kept in component state only — never persisted or put in URLs. */
export type ContactDetails = {
  name: string;
  company: string;
  timeline: Timeline | null;
  notes: string;
};
