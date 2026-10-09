import { describe, expect, it } from "vitest";
import ar from "@/i18n/ar.json";
import en from "@/i18n/en.json";
import { createTranslator } from "@/i18n";
import {
  DEFAULT_STATE,
  estimatorReducer,
  sanitizeState,
  stateFromSearchParams,
  stateToSearchParams,
} from "@/features/estimator/state";
import { getRecommendations } from "@/features/recommendations/rules";
import { formatMoney, isRateStale, resolveDisplayCurrency } from "@/lib/formatCurrency";
import { plainSpaces } from "./normalize";
import { FX_RATES } from "@/config/pricing";

describe("dictionaries", () => {
  it("Arabic and English have exactly the same keys", () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  });

  it("no translation is empty and placeholders match", () => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");
    for (const key of Object.keys(en) as Array<keyof typeof en>) {
      expect(en[key].trim(), key).not.toBe("");
      expect(ar[key].trim(), key).not.toBe("");
      expect(placeholders(ar[key]), key).toBe(placeholders(en[key]));
    }
  });

  it("interpolates parameters", () => {
    expect(createTranslator(en)("estimator.stepOf", { current: 2, total: 5 })).toBe("Step 2 of 5");
  });
});

describe("estimator state", () => {
  it("presets apply configured values and editing switches to custom", () => {
    let s = estimatorReducer(DEFAULT_STATE, { type: "applyPreset", preset: "growth" });
    expect(s).toMatchObject({ preset: "growth", videoQuantity: 6, adBudgetQar: 3_000 });
    s = estimatorReducer(s, { type: "setVideoQuantity", quantity: 8 });
    expect(s.preset).toBeNull();
  });

  it("clamps out-of-range values", () => {
    expect(estimatorReducer(DEFAULT_STATE, { type: "setVideoQuantity", quantity: 99 }).videoQuantity).toBe(20);
    expect(estimatorReducer(DEFAULT_STATE, { type: "setAdBudget", budgetQar: 100 }).adBudgetQar).toBe(750);
    expect(estimatorReducer(DEFAULT_STATE, { type: "setAdBudget", budgetQar: 0 }).adBudgetQar).toBe(0);
    expect(estimatorReducer(DEFAULT_STATE, { type: "setStep", step: 42 }).step).toBe(4);
  });

  it("reset keeps the chosen currency", () => {
    const s = estimatorReducer({ ...DEFAULT_STATE, currency: "SAR", videoQuantity: 12 }, { type: "reset" });
    expect(s).toEqual({ ...DEFAULT_STATE, currency: "SAR" });
  });

  it("round-trips through share-link parameters without personal data", () => {
    const state = { ...DEFAULT_STATE, industry: "realEstate" as const, objective: "leads" as const, adBudgetQar: 12_500,
      addons: { landingPage: true, pixelCapi: false, customWebApp: true }, currency: "USD" as const };
    const params = stateToSearchParams(state);
    expect([...params.keys()].sort()).toEqual(["a", "b", "cur", "i", "m", "o", "q", "t"]);
    expect(stateFromSearchParams(params)).toEqual({ ...state, step: 4 });
  });

  it("rejects tampered parameters", () => {
    const s = stateFromSearchParams(new URLSearchParams("t=<script>&q=9999&b=-5&i=hack&cur=EUR"));
    expect(s).toMatchObject({ videoTier: "professional", videoQuantity: 20, adBudgetQar: 0, industry: null, currency: "QAR" });
    expect(stateFromSearchParams(new URLSearchParams("utm_source=meta"))).toBeNull();
    expect(sanitizeState({ videoTier: "nope", step: "x" })).toMatchObject({ videoTier: "professional", step: 0 });
  });
});

describe("recommendations", () => {
  it("no ads → creative readiness advice with an optional budget action", () => {
    const [first] = getRecommendations({ ...DEFAULT_STATE, adBudgetQar: 0 });
    expect(first?.id).toBe("noAds");
    expect(first?.action?.change).toEqual({ type: "patch", patch: { adBudgetQar: 1_500 } });
  });

  it("matches the blueprint's contextual rules", () => {
    expect(getRecommendations({ ...DEFAULT_STATE, industry: "automotive", channel: "whatsapp" })[0]?.id).toBe("automotive");
    expect(getRecommendations({ ...DEFAULT_STATE, industry: "realEstate", objective: "leads" })[0]?.id).toBe("realEstate");
    expect(getRecommendations({ ...DEFAULT_STATE, industry: "ecommerce", objective: "store_sales" })[0]?.id).toBe("ecommerce");
    expect(getRecommendations({ ...DEFAULT_STATE, objective: "launch" })[0]?.id).toBe("newBusiness");
    expect(getRecommendations(DEFAULT_STATE)[0]?.id).toBe("default");
  });

  it("returns at most two suggestions", () => {
    const recs = getRecommendations({ ...DEFAULT_STATE, adBudgetQar: 0, objective: "bookings", industry: "realEstate" });
    expect(recs.length).toBeLessThanOrEqual(2);
  });
});

describe("currency formatting", () => {
  it("formats QAR and converted currencies per locale", () => {
    expect(plainSpaces(formatMoney(870_000, "QAR", "en"))).toBe("QAR 8,700");
    expect(formatMoney(870_000, "USD", "en")).toBe("$2,390");
    expect(formatMoney(870_000, "QAR", "ar")).toContain("8,700");
  });

  it("falls back to QAR when a rate is stale", () => {
    expect(isRateStale(FX_RATES.USD, new Date("2026-10-10"))).toBe(false);
    expect(isRateStale(FX_RATES.USD, new Date("2028-01-01"))).toBe(true);
    expect(resolveDisplayCurrency("SAR", new Date("2028-01-01"))).toEqual({ currency: "QAR", stale: true });
  });
});
