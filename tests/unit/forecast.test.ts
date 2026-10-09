import { describe, expect, it } from "vitest";
import { calculateForecast } from "@/features/forecasting/calculate";
import { FORECAST_PROFILES } from "@/config/pricing";

describe("forecast engine", () => {
  it("reproduces the blueprint QAR 3,000 example", () => {
    const r = calculateForecast({ adSpendQar: 3_000, industry: "automotive", objective: "messages" });
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.impressions).toEqual({ min: 50_000, max: 100_000 });
    expect(r.reach).toEqual({ min: 17_857, max: 55_555 });
    expect(r.outcome).toEqual({ kind: "conversations", min: 25, max: 60 });
    expect(r.provenance).toBe("illustrative");
  });

  it("T03: no paid budget → paid forecast unavailable", () => {
    expect(calculateForecast({ adSpendQar: 0, industry: "restaurants", objective: "awareness" }).status).toBe("noAds");
  });

  it("T13: industry without a profile → no invented ranges", () => {
    const r = calculateForecast({ adSpendQar: 5_000, industry: "other", objective: "leads" });
    expect(r).toEqual({ status: "unavailable", reason: "noProfile" });
  });

  it("awareness shows delivery metrics only", () => {
    const r = calculateForecast({ adSpendQar: 3_000, industry: "restaurants", objective: "awareness" });
    expect(r.status === "ok" && r.outcome).toBeNull();
  });

  it("bookings and store sales are never projected", () => {
    const b = calculateForecast({ adSpendQar: 3_000, industry: "restaurants", objective: "bookings" });
    const s = calculateForecast({ adSpendQar: 3_000, industry: "ecommerce", objective: "store_sales" });
    expect(b.status === "ok" && b.outcome === null && b.outcomeUnavailable).toBe("bookings");
    expect(s.status === "ok" && s.outcome === null && s.outcomeUnavailable).toBe("sales");
  });

  it("asks for an objective before forecasting", () => {
    expect(calculateForecast({ adSpendQar: 3_000, industry: "restaurants", objective: null }).status).toBe("noObjective");
  });

  it("caps reach at the addressable audience when known", () => {
    const profiles = { ...FORECAST_PROFILES, realEstate: { ...FORECAST_PROFILES.realEstate!, addressableAudience: 20_000 } };
    const r = calculateForecast({ adSpendQar: 3_000, industry: "realEstate", objective: "leads" }, { profiles });
    expect(r.status === "ok" && r.reach).toEqual({ min: 17_857, max: 20_000 });
  });

  it("respects the global kill switch", () => {
    const r = calculateForecast({ adSpendQar: 3_000, industry: "realEstate", objective: "leads" }, { enabled: false });
    expect(r).toEqual({ status: "unavailable", reason: "disabled" });
  });
});
