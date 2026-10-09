import {
  ESTIMATOR_CONFIG,
  FORECAST_PROFILES,
  OBJECTIVE_FORECAST_RULES,
  type ForecastProfile,
  type OutcomeKind,
  type Provenance,
} from "@/config/pricing";
import type { Industry, Objective } from "@/features/estimator/types";

export type Bounds = { min: number; max: number };

export type ForecastResult =
  | { status: "noAds" }
  | { status: "noObjective" }
  | { status: "unavailable"; reason: "noProfile" | "disabled" }
  | {
      status: "ok";
      provenance: Provenance;
      impressions: Bounds;
      reach: Bounds;
      outcome: ({ kind: OutcomeKind } & Bounds) | null;
      /** Set when the objective's natural metric is deliberately not projected. */
      outcomeUnavailable: "bookings" | "sales" | null;
      profile: ForecastProfile;
    };

export type ForecastInput = {
  adSpendQar: number;
  industry: Industry | null;
  objective: Objective | null;
};

type ForecastOptions = {
  enabled?: boolean;
  profiles?: Record<Industry, ForecastProfile | null>;
};

/**
 * Bounded, illustrative forecast (blueprint section 08). Ranges come from
 * independent low/high assumptions — not a statistical confidence interval —
 * and video count is intentionally not a multiplier.
 */
export function calculateForecast(input: ForecastInput, options: ForecastOptions = {}): ForecastResult {
  const enabled = options.enabled ?? ESTIMATOR_CONFIG.forecastEnabled;
  const profiles = options.profiles ?? FORECAST_PROFILES;

  if (!(input.adSpendQar > 0)) return { status: "noAds" };
  if (!enabled) return { status: "unavailable", reason: "disabled" };
  if (!input.objective) return { status: "noObjective" };

  // Without an industry we fall back to the generic profile of a typical SME.
  const profile = input.industry ? profiles[input.industry] : profiles.professional;
  if (!profile) return { status: "unavailable", reason: "noProfile" };

  const spend = input.adSpendQar;
  const impressions = {
    min: Math.floor((spend / profile.cpmQar.high) * 1000),
    max: Math.floor((spend / profile.cpmQar.low) * 1000),
  };
  const reach = {
    min: Math.floor(impressions.min / profile.frequency.high),
    max: Math.floor(impressions.max / profile.frequency.low),
  };
  if (profile.addressableAudience) {
    reach.min = Math.min(reach.min, profile.addressableAudience);
    reach.max = Math.min(reach.max, profile.addressableAudience);
  }

  const rule = OBJECTIVE_FORECAST_RULES[input.objective];
  const outcome =
    rule.outcome && profile.cpeQar
      ? {
          kind: rule.outcome,
          min: Math.floor(spend / profile.cpeQar.high),
          max: Math.floor(spend / profile.cpeQar.low),
        }
      : null;

  return {
    status: "ok",
    provenance: profile.provenance,
    impressions,
    reach,
    outcome,
    outcomeUnavailable: rule.unavailable,
    profile,
  };
}
