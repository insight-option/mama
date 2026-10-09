import { describe, expect, it } from "vitest";
import { calculatePrice, createQuoteSnapshot, toEstimateInput } from "@/features/pricing/calculate";
import { DEFAULT_STATE, estimatorReducer } from "@/features/estimator/state";
import type { EstimateInput } from "@/features/estimator/types";

const base: EstimateInput = {
  locale: "en",
  displayCurrency: "QAR",
  industry: null,
  objective: null,
  targetMarket: "qatar",
  videoTier: "professional",
  videoQuantity: 0,
  adBudgetQarMinor: 0,
  addons: { landingPage: false, pixelCapi: false, customWebApp: false },
};
const qar = (major: number) => major * 100;

describe("pricing engine — blueprint acceptance matrix", () => {
  it("T01: 0 AI videos means production total is 0", () => {
    const r = calculatePrice({ ...base, videoQuantity: 0 });
    expect(r.videoTotalQarMinor).toBe(0);
    expect(r.lines.find((l) => l.id === "videos")).toBeUndefined();
  });

  it("T02: 6 professional videos = QAR 2,700", () => {
    expect(calculatePrice({ ...base, videoQuantity: 6 }).videoTotalQarMinor).toBe(qar(2_700));
  });

  it("prices every tier from config (220 / 450 / 850)", () => {
    expect(calculatePrice({ ...base, videoQuantity: 2, videoTier: "quick" }).videoTotalQarMinor).toBe(qar(440));
    expect(calculatePrice({ ...base, videoQuantity: 2, videoTier: "cinematic" }).videoTotalQarMinor).toBe(qar(1_700));
  });

  it("T03: ad budget disabled means management fee is exactly 0", () => {
    const r = calculatePrice({ ...base, videoQuantity: 6, adBudgetQarMinor: 0 });
    expect(r.managementFeeQarMinor).toBe(0);
    expect(r.lines.some((l) => l.id === "management" || l.id === "mediaSpend")).toBe(false);
  });

  it("T04: ad spend QAR 750 → management fee QAR 750 (floor applies)", () => {
    expect(calculatePrice({ ...base, adBudgetQarMinor: qar(750) }).managementFeeQarMinor).toBe(qar(750));
  });

  it("T05: ad spend QAR 10,000 → management fee QAR 1,500 (15%)", () => {
    expect(calculatePrice({ ...base, adBudgetQarMinor: qar(10_000) }).managementFeeQarMinor).toBe(qar(1_500));
  });

  it("floor still applies just below the 15% crossover (QAR 4,750 → 750)", () => {
    expect(calculatePrice({ ...base, adBudgetQarMinor: qar(4_750) }).managementFeeQarMinor).toBe(qar(750));
    expect(calculatePrice({ ...base, adBudgetQarMinor: qar(5_250) }).managementFeeQarMinor).toBe(qar(787.5));
  });

  it("T06: landing page adds QAR 1,500 to one-time only", () => {
    const r = calculatePrice({ ...base, addons: { ...base.addons, landingPage: true } });
    expect(r.oneTimeQarMinor).toBe(qar(1_500));
    expect(r.recurringQarMinor).toBe(0);
  });

  it("T07: Pixel/CAPI adds QAR 750 to one-time only", () => {
    const r = calculatePrice({ ...base, addons: { ...base.addons, pixelCapi: true } });
    expect(r.oneTimeQarMinor).toBe(qar(750));
    expect(r.recurringQarMinor).toBe(0);
  });

  it("T08: custom app shows a custom-quote line and never a false amount", () => {
    const r = calculatePrice({ ...base, addons: { ...base.addons, customWebApp: true } });
    expect(r.customQuoteRequired).toBe(true);
    expect(r.lines.find((l) => l.id === "customWebApp")?.amountQarMinor).toBeNull();
    expect(r.oneTimeQarMinor).toBe(0);
  });

  it("T09: demo full selection → monthly 6,450; first month 8,700", () => {
    const r = calculatePrice({
      ...base,
      videoQuantity: 6,
      adBudgetQarMinor: qar(3_000),
      addons: { landingPage: true, pixelCapi: true, customWebApp: false },
    });
    expect(r.recurringQarMinor).toBe(qar(6_450));
    expect(r.oneTimeQarMinor).toBe(qar(2_250));
    expect(r.firstMonthQarMinor).toBe(qar(8_700));
    expect(r.fontaineMonthlyQarMinor).toBe(qar(3_450));
    expect(r.mediaSpendQarMinor).toBe(qar(3_000));
  });

  it("T10: currency switching never changes canonical QAR totals", () => {
    const state = { ...DEFAULT_STATE, adBudgetQar: 3_000 };
    const before = calculatePrice(toEstimateInput(state, "en"));
    let s = estimatorReducer(state, { type: "setCurrency", currency: "USD" });
    s = estimatorReducer(s, { type: "setCurrency", currency: "QAR" });
    const after = calculatePrice(toEstimateInput(s, "en"));
    expect(after.firstMonthQarMinor).toBe(before.firstMonthQarMinor);
    expect(after.recurringQarMinor).toBe(before.recurringQarMinor);
  });

  it("is defensive against invalid quantities", () => {
    expect(calculatePrice({ ...base, videoQuantity: -4 }).videoTotalQarMinor).toBe(0);
    expect(calculatePrice({ ...base, videoQuantity: Number.NaN }).videoTotalQarMinor).toBe(0);
  });

  it("quote snapshot records config version, effective date and QAR totals", () => {
    const input = { ...base, videoQuantity: 6 };
    const snap = createQuoteSnapshot("FTN-1", input, calculatePrice(input), new Date("2026-10-09T10:00:00Z"));
    expect(snap).toMatchObject({
      priceConfigVersion: "v1-draft",
      priceConfigEffectiveDate: "2026-10-09",
      canonicalCurrency: "QAR",
      monthlyTotalQarMinor: qar(2_700),
    });
  });
});
