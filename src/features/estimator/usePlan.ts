"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { SITE_CONFIG } from "@/config/site";
import { calculateForecast } from "@/features/forecasting/calculate";
import { calculatePrice, toEstimateInput } from "@/features/pricing/calculate";
import { getRecommendations } from "@/features/recommendations/rules";
import { buildPlanMessage, buildWhatsAppUrl, createPlanReference } from "@/features/whatsapp/buildMessage";
import { formatMoney, resolveDisplayCurrency } from "@/lib/formatCurrency";
import { stateToSearchParams } from "./state";
import { useEstimatorState } from "./store";
import type { ContactDetails } from "./types";

let sessionReference: string | null = null;

/** One reference per browser session, created lazily on the client. */
function usePlanReference(): string {
  const [reference] = useState(() => {
    if (typeof window === "undefined") return "";
    sessionReference ??= createPlanReference();
    return sessionReference;
  });
  return reference;
}

/**
 * Derives everything the UI shows from the single estimator state:
 * canonical QAR pricing, forecast, recommendations and formatting helpers.
 */
export function usePlan() {
  const state = useEstimatorState();
  const { locale, t } = useI18n();
  const reference = usePlanReference();

  return useMemo(() => {
    const input = toEstimateInput(state, locale);
    const price = calculatePrice(input);
    const forecast = calculateForecast({ adSpendQar: state.adBudgetQar, industry: state.industry, objective: state.objective });
    const recommendations = getRecommendations(state);
    const display = resolveDisplayCurrency(state.currency);
    const money = (minor: number) => formatMoney(minor, display.currency, locale);

    const buildMessage = (contact?: ContactDetails) =>
      buildPlanMessage({ state, price, locale, t, reference: reference || "FTN", contact });
    const whatsappUrl = (contact?: ContactDetails) => buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildMessage(contact));
    const shareUrl = () => `${window.location.origin}/${locale}?${stateToSearchParams(state).toString()}#estimator`;

    return { state, input, price, forecast, recommendations, display, money, reference, buildMessage, whatsappUrl, shareUrl };
  }, [state, locale, t, reference]);
}
