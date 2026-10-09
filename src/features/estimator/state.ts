import { ESTIMATOR_CONFIG, PRESETS } from "@/config/pricing";
import {
  CHANNELS,
  CURRENCIES,
  INDUSTRIES,
  MARKETS,
  OBJECTIVES,
  PRESET_IDS,
  STEP_IDS,
  VIDEO_TIERS,
  type Addons,
  type Channel,
  type Currency,
  type EstimatorState,
  type Industry,
  type Market,
  type Objective,
  type PresetId,
  type VideoTier,
} from "./types";

export const DEFAULT_STATE: EstimatorState = {
  industry: null,
  objective: null,
  market: "qatar",
  channel: null,
  videoTier: "professional",
  videoQuantity: ESTIMATOR_CONFIG.videoQuantity.default,
  adBudgetQar: ESTIMATOR_CONFIG.adBudgetQar.default,
  addons: { landingPage: false, pixelCapi: false, customWebApp: false },
  preset: null,
  step: 0,
  currency: "QAR",
};

export const LAST_STEP = STEP_IDS.length - 1;

export type EstimatorAction =
  | { type: "setIndustry"; industry: Industry }
  | { type: "setObjective"; objective: Objective }
  | { type: "setMarket"; market: Market }
  | { type: "setChannel"; channel: Channel }
  | { type: "setVideoTier"; tier: VideoTier }
  | { type: "setVideoQuantity"; quantity: number }
  | { type: "setAdBudget"; budgetQar: number }
  | { type: "toggleAddon"; addon: keyof Addons; value?: boolean }
  | { type: "applyPreset"; preset: PresetId }
  | { type: "setStep"; step: number }
  | { type: "setCurrency"; currency: Currency }
  | { type: "replace"; state: EstimatorState }
  | { type: "reset" };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeVideoQuantity(quantity: number): number {
  const { min, max } = ESTIMATOR_CONFIG.videoQuantity;
  if (!Number.isFinite(quantity)) return ESTIMATOR_CONFIG.videoQuantity.default;
  return clamp(Math.round(quantity), min, max);
}

/** Budget is either 0 (off) or a whole number within [min, customMax]. */
export function normalizeAdBudget(budgetQar: number): number {
  const { min, customMax } = ESTIMATOR_CONFIG.adBudgetQar;
  if (!Number.isFinite(budgetQar) || budgetQar <= 0) return 0;
  return clamp(Math.round(budgetQar), min, customMax);
}

export function isValidCustomBudget(value: number): boolean {
  const { min, customMax } = ESTIMATOR_CONFIG.adBudgetQar;
  return Number.isInteger(value) && value >= min && value <= customMax;
}

/** Pure reducer — never mutates. Any package edit turns the plan into a custom package. */
export function estimatorReducer(state: EstimatorState, action: EstimatorAction): EstimatorState {
  switch (action.type) {
    case "setIndustry":
      return { ...state, industry: action.industry };
    case "setObjective":
      return { ...state, objective: action.objective };
    case "setMarket":
      return { ...state, market: action.market };
    case "setChannel":
      return { ...state, channel: action.channel };
    case "setVideoTier":
      return { ...state, videoTier: action.tier, preset: null };
    case "setVideoQuantity":
      return { ...state, videoQuantity: normalizeVideoQuantity(action.quantity), preset: null };
    case "setAdBudget":
      return { ...state, adBudgetQar: normalizeAdBudget(action.budgetQar), preset: null };
    case "toggleAddon":
      return {
        ...state,
        addons: { ...state.addons, [action.addon]: action.value ?? !state.addons[action.addon] },
        preset: null,
      };
    case "applyPreset": {
      const preset = PRESETS[action.preset];
      return {
        ...state,
        videoTier: preset.videoTier,
        videoQuantity: preset.videoQuantity,
        adBudgetQar: preset.adBudgetQar,
        addons: { ...preset.addons },
        preset: preset.id,
      };
    }
    case "setStep":
      return { ...state, step: clamp(Math.round(action.step), 0, LAST_STEP) };
    case "setCurrency":
      return { ...state, currency: action.currency };
    case "replace":
      return action.state;
    case "reset":
      return { ...DEFAULT_STATE, currency: state.currency };
  }
}

// ---------------------------------------------------------------------------
// Shareable URL serialization. Only non-sensitive selections are encoded —
// never contact details. Every value is whitelisted on the way back in.
// ---------------------------------------------------------------------------

const ADDON_CODES: Record<keyof Addons, string> = { landingPage: "lp", pixelCapi: "px", customWebApp: "cw" };

function pick<T extends string>(allowed: readonly T[], value: string | null): T | undefined {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function stateToSearchParams(state: EstimatorState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.industry) params.set("i", state.industry);
  if (state.objective) params.set("o", state.objective);
  params.set("m", state.market);
  if (state.channel) params.set("c", state.channel);
  params.set("t", state.videoTier);
  params.set("q", String(state.videoQuantity));
  params.set("b", String(state.adBudgetQar));
  const addons = (Object.keys(ADDON_CODES) as Array<keyof Addons>).filter((k) => state.addons[k]).map((k) => ADDON_CODES[k]);
  if (addons.length) params.set("a", addons.join("."));
  if (state.preset) params.set("p", state.preset);
  if (state.currency !== "QAR") params.set("cur", state.currency);
  return params;
}

/** Returns null when the URL carries no plan, so normal visits are unaffected. */
export function stateFromSearchParams(params: URLSearchParams, base: EstimatorState = DEFAULT_STATE): EstimatorState | null {
  if (!params.has("t") && !params.has("q") && !params.has("b")) return null;
  const addonCodes = new Set((params.get("a") ?? "").split("."));
  const quantity = Number(params.get("q"));
  const budget = Number(params.get("b"));
  return {
    ...base,
    industry: pick(INDUSTRIES, params.get("i")) ?? null,
    objective: pick(OBJECTIVES, params.get("o")) ?? null,
    market: pick(MARKETS, params.get("m")) ?? base.market,
    channel: pick(CHANNELS, params.get("c")) ?? null,
    videoTier: pick(VIDEO_TIERS, params.get("t")) ?? base.videoTier,
    videoQuantity: params.has("q") ? normalizeVideoQuantity(quantity) : base.videoQuantity,
    adBudgetQar: params.has("b") ? normalizeAdBudget(budget) : base.adBudgetQar,
    addons: {
      landingPage: addonCodes.has("lp"),
      pixelCapi: addonCodes.has("px"),
      customWebApp: addonCodes.has("cw"),
    },
    preset: pick(PRESET_IDS, params.get("p")) ?? null,
    currency: pick(CURRENCIES, params.get("cur")) ?? base.currency,
    step: LAST_STEP,
  };
}

/** Validates an arbitrary object (e.g. from sessionStorage) into a safe state. */
export function sanitizeState(raw: unknown): EstimatorState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const addons = (r.addons ?? {}) as Record<string, unknown>;
  return {
    industry: pick(INDUSTRIES, str(r.industry)) ?? null,
    objective: pick(OBJECTIVES, str(r.objective)) ?? null,
    market: pick(MARKETS, str(r.market)) ?? DEFAULT_STATE.market,
    channel: pick(CHANNELS, str(r.channel)) ?? null,
    videoTier: pick(VIDEO_TIERS, str(r.videoTier)) ?? DEFAULT_STATE.videoTier,
    videoQuantity: typeof r.videoQuantity === "number" ? normalizeVideoQuantity(r.videoQuantity) : DEFAULT_STATE.videoQuantity,
    adBudgetQar: typeof r.adBudgetQar === "number" ? normalizeAdBudget(r.adBudgetQar) : DEFAULT_STATE.adBudgetQar,
    addons: {
      landingPage: addons.landingPage === true,
      pixelCapi: addons.pixelCapi === true,
      customWebApp: addons.customWebApp === true,
    },
    preset: pick(PRESET_IDS, str(r.preset)) ?? null,
    step: typeof r.step === "number" ? clamp(Math.round(r.step), 0, LAST_STEP) : 0,
    currency: pick(CURRENCIES, str(r.currency)) ?? DEFAULT_STATE.currency,
  };
}
