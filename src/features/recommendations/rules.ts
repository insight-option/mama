import type { EstimatorState, PresetId } from "@/features/estimator/types";
import type { TranslationKey } from "@/i18n";

export type ConfigChange =
  | { type: "patch"; patch: Partial<Pick<EstimatorState, "videoTier" | "adBudgetQar">> }
  | { type: "addon"; addon: "landingPage" | "pixelCapi" }
  | { type: "preset"; preset: PresetId };

export type Recommendation = {
  id: string;
  headline: TranslationKey;
  reason: TranslationKey;
  tradeoff: TranslationKey;
  /** Optional, user-approved configuration change. Never auto-applied. */
  action?: { label: TranslationKey; change: ConfigChange };
};

const TRACKING_BUDGET_THRESHOLD_QAR = 10_000;

/** Contextual, rule-based advice (blueprint section 09). Returns at most two, most relevant first. */
export function getRecommendations(state: EstimatorState): Recommendation[] {
  const recs: Recommendation[] = [];
  const adsOn = state.adBudgetQar > 0;

  if (!adsOn) {
    recs.push({
      id: "noAds",
      headline: "rec.noAds.headline",
      reason: "rec.noAds.reason",
      tradeoff: "rec.noAds.tradeoff",
      action: { label: "rec.noAds.action", change: { type: "patch", patch: { adBudgetQar: 1_500 } } },
    });
  }

  if (state.industry === "automotive" && (state.channel === "whatsapp" || state.objective === "messages")) {
    recs.push({
      id: "automotive",
      headline: "rec.automotive.headline",
      reason: "rec.automotive.reason",
      tradeoff: "rec.automotive.tradeoff",
      action:
        state.videoTier === "quick"
          ? { label: "rec.automotive.action", change: { type: "patch", patch: { videoTier: "professional" } } }
          : undefined,
    });
  }

  if (state.industry === "realEstate" && (state.objective === "leads" || state.objective === "messages")) {
    recs.push({
      id: "realEstate",
      headline: "rec.realEstate.headline",
      reason: "rec.realEstate.reason",
      tradeoff: "rec.realEstate.tradeoff",
      action: state.addons.landingPage
        ? undefined
        : { label: "rec.realEstate.action", change: { type: "addon", addon: "landingPage" } },
    });
  }

  if (state.industry === "ecommerce" && state.objective === "store_sales") {
    recs.push({
      id: "ecommerce",
      headline: "rec.ecommerce.headline",
      reason: "rec.ecommerce.reason",
      tradeoff: "rec.ecommerce.tradeoff",
      action: state.addons.pixelCapi
        ? undefined
        : { label: "rec.ecommerce.action", change: { type: "addon", addon: "pixelCapi" } },
    });
  }

  if (state.objective === "bookings") {
    recs.push({
      id: "bookings",
      headline: "rec.bookings.headline",
      reason: "rec.bookings.reason",
      tradeoff: "rec.bookings.tradeoff",
      action: state.addons.landingPage
        ? undefined
        : { label: "rec.bookings.action", change: { type: "addon", addon: "landingPage" } },
    });
  }

  if (state.objective === "launch") {
    recs.push({
      id: "newBusiness",
      headline: "rec.newBusiness.headline",
      reason: "rec.newBusiness.reason",
      tradeoff: "rec.newBusiness.tradeoff",
      action:
        state.preset === "starter"
          ? undefined
          : { label: "rec.newBusiness.action", change: { type: "preset", preset: "starter" } },
    });
  }

  if (adsOn && state.adBudgetQar >= TRACKING_BUDGET_THRESHOLD_QAR && !state.addons.pixelCapi && !recs.some((r) => r.id === "ecommerce")) {
    recs.push({
      id: "tracking",
      headline: "rec.tracking.headline",
      reason: "rec.tracking.reason",
      tradeoff: "rec.tracking.tradeoff",
      action: { label: "rec.tracking.action", change: { type: "addon", addon: "pixelCapi" } },
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "default",
      headline: "rec.default.headline",
      reason: "rec.default.reason",
      tradeoff: "rec.default.tradeoff",
    });
  }

  return recs.slice(0, 2);
}
