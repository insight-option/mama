import { ESTIMATOR_CONFIG } from "@/config/pricing";
import type { EstimateInput, EstimatorState, Locale, QuoteSnapshot } from "@/features/estimator/types";
import { percentOf, sum, toMinor } from "@/lib/money";

export type LineItemId = "videos" | "mediaSpend" | "management" | "landingPage" | "pixelCapi" | "customWebApp";

export type LineItem = {
  id: LineItemId;
  billing: "monthly" | "oneTime";
  /** "media" is paid to the ad platform; "service" is charged by Fontaine. */
  kind: "service" | "media";
  /** null means "price on request" — never silently zero. */
  amountQarMinor: number | null;
  quantity?: number;
  unitQarMinor?: number;
};

export type PriceResult = {
  lines: LineItem[];
  videoTotalQarMinor: number;
  mediaSpendQarMinor: number;
  managementFeeQarMinor: number;
  /** Fontaine's recurring service fees (videos + management), excluding media spend. */
  fontaineMonthlyQarMinor: number;
  recurringQarMinor: number;
  oneTimeQarMinor: number;
  firstMonthQarMinor: number;
  customQuoteRequired: boolean;
  configVersion: string;
};

type PricingConfig = Pick<typeof ESTIMATOR_CONFIG, "videoUnitQar" | "management" | "addonsQar" | "configVersion">;

function safeCount(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/**
 * The single pure, deterministic source of truth for every visible total
 * (blueprint section 06). Components must never compute totals themselves.
 */
export function calculatePrice(input: EstimateInput, config: PricingConfig = ESTIMATOR_CONFIG): PriceResult {
  const quantity = safeCount(input.videoQuantity);
  const unitQarMinor = toMinor(config.videoUnitQar[input.videoTier]);
  const videoTotalQarMinor = quantity * unitQarMinor;

  const mediaSpendQarMinor = safeCount(input.adBudgetQarMinor);
  const managementFeeQarMinor =
    mediaSpendQarMinor > 0
      ? Math.max(toMinor(config.management.minQar), percentOf(mediaSpendQarMinor, config.management.rate))
      : 0;

  const lines: LineItem[] = [];
  if (quantity > 0) {
    lines.push({ id: "videos", billing: "monthly", kind: "service", amountQarMinor: videoTotalQarMinor, quantity, unitQarMinor });
  }
  if (mediaSpendQarMinor > 0) {
    lines.push({ id: "mediaSpend", billing: "monthly", kind: "media", amountQarMinor: mediaSpendQarMinor });
    lines.push({ id: "management", billing: "monthly", kind: "service", amountQarMinor: managementFeeQarMinor });
  }

  const landingQarMinor = input.addons.landingPage ? toMinor(config.addonsQar.landingPage) : 0;
  const pixelQarMinor = input.addons.pixelCapi ? toMinor(config.addonsQar.pixelCapi) : 0;
  if (input.addons.landingPage) {
    lines.push({ id: "landingPage", billing: "oneTime", kind: "service", amountQarMinor: landingQarMinor });
  }
  if (input.addons.pixelCapi) {
    lines.push({ id: "pixelCapi", billing: "oneTime", kind: "service", amountQarMinor: pixelQarMinor });
  }
  if (input.addons.customWebApp) {
    lines.push({ id: "customWebApp", billing: "oneTime", kind: "service", amountQarMinor: null });
  }

  // No recurring add-ons are priced yet (maintenance is disabled by default).
  const recurringQarMinor = sum([videoTotalQarMinor, mediaSpendQarMinor, managementFeeQarMinor]);
  const oneTimeQarMinor = sum([landingQarMinor, pixelQarMinor]);

  return {
    lines,
    videoTotalQarMinor,
    mediaSpendQarMinor,
    managementFeeQarMinor,
    fontaineMonthlyQarMinor: videoTotalQarMinor + managementFeeQarMinor,
    recurringQarMinor,
    oneTimeQarMinor,
    firstMonthQarMinor: recurringQarMinor + oneTimeQarMinor,
    customQuoteRequired: input.addons.customWebApp === true,
    configVersion: config.configVersion,
  };
}

export function toEstimateInput(state: EstimatorState, locale: Locale): EstimateInput {
  return {
    locale,
    displayCurrency: state.currency,
    industry: state.industry,
    objective: state.objective,
    targetMarket: state.market,
    videoTier: state.videoTier,
    videoQuantity: state.videoQuantity,
    adBudgetQarMinor: toMinor(state.adBudgetQar),
    addons: { ...state.addons },
  };
}

export function createQuoteSnapshot(
  id: string,
  input: EstimateInput,
  price: PriceResult,
  now: Date = new Date(),
): QuoteSnapshot {
  return {
    id,
    createdAt: now.toISOString(),
    priceConfigVersion: price.configVersion,
    priceConfigEffectiveDate: ESTIMATOR_CONFIG.effectiveDate,
    canonicalCurrency: "QAR",
    input,
    monthlyTotalQarMinor: price.recurringQarMinor,
    oneTimeTotalQarMinor: price.oneTimeQarMinor,
    firstMonthTotalQarMinor: price.firstMonthQarMinor,
    customQuoteRequired: price.customQuoteRequired,
  };
}
