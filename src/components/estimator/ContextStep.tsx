"use client";

import { useI18n } from "@/components/common/I18nProvider";
import type { IconName } from "@/components/common/Icon";
import { act } from "@/features/estimator/actions";
import { useEstimatorState } from "@/features/estimator/store";
import { CHANNELS, INDUSTRIES, MARKETS, OBJECTIVES, type Industry, type Objective, type Channel } from "@/features/estimator/types";
import { ChoiceGroup, StepHeading } from "./controls";

export const INDUSTRY_ICONS: Record<Industry, IconName> = {
  restaurants: "utensils",
  automotive: "car",
  realEstate: "building",
  ecommerce: "cart",
  professional: "briefcase",
  healthBeauty: "heart",
  other: "grid",
};

const OBJECTIVE_ICONS: Record<Objective, IconName> = {
  awareness: "eye",
  messages: "message",
  leads: "target",
  bookings: "calendar",
  store_sales: "bag",
  launch: "rocket",
};

const CHANNEL_ICONS: Record<Channel, IconName> = {
  whatsapp: "message",
  form: "layout",
  bookings: "calendar",
  checkout: "cart",
};

export function ContextStep({ headingId }: { headingId: string }) {
  const { t } = useI18n();
  const state = useEstimatorState();

  return (
    <div className="space-y-8">
      <StepHeading id={headingId} icon="briefcase" title={t("context.title")} subtitle={t("context.subtitle")} />

      <ChoiceGroup
        legend={t("industry.title")}
        name="industry"
        value={state.industry}
        onChange={(industry) => act({ type: "setIndustry", industry })}
        options={INDUSTRIES.map((value) => ({ value, label: t(`industry.${value}`), icon: INDUSTRY_ICONS[value] }))}
      />

      <ChoiceGroup
        legend={t("objective.title")}
        name="objective"
        value={state.objective}
        onChange={(objective) => act({ type: "setObjective", objective })}
        options={OBJECTIVES.map((value) => ({ value, label: t(`objective.${value}`), icon: OBJECTIVE_ICONS[value] }))}
      />

      <div className="grid gap-8">
        <div>
          <label htmlFor="market" className="text-base font-bold text-offwhite">
            {t("market.title")}
          </label>
          <p id="market-hint" className="mb-3 mt-1 text-sm text-muted">
            {t("market.hint")}
          </p>
          <select
            id="market"
            className="field"
            aria-describedby="market-hint"
            value={state.market}
            onChange={(event) => act({ type: "setMarket", market: event.target.value as (typeof MARKETS)[number] })}
          >
            {MARKETS.map((market) => (
              <option key={market} value={market}>
                {t(`market.${market}`)}
              </option>
            ))}
          </select>
        </div>
        <ChoiceGroup
          legend={t("channel.title")}
          name="channel"
          value={state.channel}
          columns="grid-cols-2 sm:grid-cols-4"
          onChange={(channel) => act({ type: "setChannel", channel })}
          options={CHANNELS.map((value) => ({ value, label: t(`channel.${value}`), icon: CHANNEL_ICONS[value] }))}
        />
      </div>
    </div>
  );
}
