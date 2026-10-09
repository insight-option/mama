"use client";

import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { ESTIMATOR_CONFIG } from "@/config/pricing";
import { act } from "@/features/estimator/actions";
import { usePlan } from "@/features/estimator/usePlan";
import { VIDEO_TIERS } from "@/features/estimator/types";
import { formatQar } from "@/lib/formatCurrency";
import { Slider, StepHeading } from "./controls";

export function VideoStep({ headingId }: { headingId: string }) {
  const { t, locale } = useI18n();
  const { state, price, money, display } = usePlan();
  const { min, max, step } = ESTIMATOR_CONFIG.videoQuantity;
  const quantityText = state.videoQuantity === 0 ? t("videos.none") : t("videos.count", { count: state.videoQuantity });

  return (
    <div className="space-y-8">
      <StepHeading id={headingId} icon="video" title={t("videos.title")} subtitle={t("videos.subtitle")} />

      <fieldset>
        <legend className="text-base font-bold text-offwhite">{t("videos.tier")}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {VIDEO_TIERS.map((tier) => (
            <label key={tier} className="chip flex-col !items-start !gap-1 !p-4">
              <input
                type="radio"
                name="videoTier"
                value={tier}
                checked={state.videoTier === tier}
                onChange={() => act({ type: "setVideoTier", tier })}
                className="sr-only"
              />
              <span className="flex w-full items-center gap-2">
                <Icon name={tier === "quick" ? "sparkles" : tier === "professional" ? "video" : "rocket"} size={18} className="text-cyan" />
                <span className="font-bold">{t(`videos.${tier}`)}</span>
                <span className="chip-check" aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={3} />
                </span>
              </span>
              <span className="text-xs text-muted">{t(`videos.${tier}.duration`)}</span>
              <span className="mt-2 text-lg font-extrabold text-offwhite">
                <bdi>{formatQar(ESTIMATOR_CONFIG.videoUnitQar[tier], display.currency, locale)}</bdi>
                <span className="ms-1 text-xs font-medium text-muted">{t("videos.perVideo")}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Slider
        id="video-quantity"
        label={t("videos.quantity")}
        min={min}
        max={max}
        step={step}
        value={state.videoQuantity}
        valueText={quantityText}
        onChange={(quantity) => act({ type: "setVideoQuantity", quantity })}
        decreaseLabel={t("videos.decrease")}
        increaseLabel={t("videos.increase")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-4">
        <span className="text-sm text-muted">{t("videos.monthlyCost")}</span>
        <span className="text-xl font-extrabold text-offwhite">
          <bdi>{money(price.videoTotalQarMinor)}</bdi>
        </span>
      </div>

      <p className="flex gap-2 text-sm leading-relaxed text-muted">
        <Icon name="info" size={16} className="mt-0.5 shrink-0 text-cyan" />
        {t("videos.scopeNote")}
      </p>
    </div>
  );
}
