"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { ESTIMATOR_CONFIG } from "@/config/pricing";
import { act } from "@/features/estimator/actions";
import { isValidCustomBudget } from "@/features/estimator/state";
import { usePlan } from "@/features/estimator/usePlan";
import { formatQar } from "@/lib/formatCurrency";
import { Slider, StepHeading } from "./controls";
import { ForecastCard } from "./ForecastCard";

const CFG = ESTIMATOR_CONFIG.adBudgetQar;

export function CampaignStep({ headingId }: { headingId: string }) {
  const { t, locale } = useI18n();
  const { state, price, forecast, money, display } = usePlan();
  const adsOn = state.adBudgetQar > 0;
  const qar = (v: number) => formatQar(v, display.currency, locale);
  // The budget is always held in QAR; these labels show the chosen display currency.
  const qarLabel = (v: number) => formatQar(v, "QAR", locale);

  const [custom, setCustom] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [lastOn, setLastOn] = useState<number>(CFG.default);

  function toggle(on: boolean) {
    if (on) act({ type: "setAdBudget", budgetQar: lastOn });
    else {
      setLastOn(state.adBudgetQar || CFG.default);
      act({ type: "setAdBudget", budgetQar: 0 });
    }
  }

  function applyCustom(event: FormEvent) {
    event.preventDefault();
    const normalized = custom.replace(/[,\s٬]/g, "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    if (!/^\d+$/.test(normalized)) {
      setCustomError(t("errors.notNumber"));
      return;
    }
    const value = Number(normalized);
    if (!isValidCustomBudget(value)) {
      setCustomError(t("errors.outOfRange", { min: qarLabel(CFG.min), max: qarLabel(CFG.customMax) }));
      return;
    }
    setCustomError(null);
    act({ type: "setAdBudget", budgetQar: value });
  }

  const aboveSlider = state.adBudgetQar > CFG.max;

  return (
    <div className="space-y-8">
      <StepHeading id={headingId} icon="megaphone" title={t("ads.title")} subtitle={t("ads.subtitle")} />

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white/[0.02] p-4">
        <span className="font-bold text-offwhite">{t("ads.toggle")}</span>
        <input type="checkbox" role="switch" className="sr-only" checked={adsOn} onChange={(e) => toggle(e.target.checked)} />
        <span className="switch" aria-hidden="true" />
      </label>

      {adsOn ? (
        <>
          <Slider
            id="ad-budget"
            label={t("ads.budget")}
            min={CFG.min}
            max={CFG.max}
            step={CFG.step}
            value={state.adBudgetQar}
            valueText={qar(state.adBudgetQar)}
            onChange={(budgetQar) => act({ type: "setAdBudget", budgetQar })}
            decreaseLabel={t("ads.decrease")}
            increaseLabel={t("ads.increase")}
            aside={
              <div className="mt-1 flex justify-between text-xs text-muted">
                <bdi>{qar(CFG.min)}</bdi>
                <bdi>{aboveSlider ? qar(state.adBudgetQar) : `${qar(CFG.max)}+`}</bdi>
              </div>
            }
          />

          <form onSubmit={applyCustom} noValidate className="rounded-xl border border-line bg-white/[0.02] p-4">
            <label htmlFor="custom-budget" className="text-sm font-bold text-offwhite">
              {t("ads.custom")} <span className="font-normal text-muted">({t("currency.short.QAR")})</span>
            </label>
            <p id="custom-budget-hint" className="mt-1 text-xs text-muted">
              {t("ads.customHint", { max: qarLabel(CFG.max), limit: qarLabel(CFG.customMax) })}
            </p>
            <div className="mt-3 flex gap-2">
              <input
                id="custom-budget"
                inputMode="numeric"
                dir="ltr"
                autoComplete="off"
                className="field text-start"
                placeholder={t("ads.customPlaceholder")}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                aria-invalid={customError ? true : undefined}
                aria-describedby={`custom-budget-hint${customError ? " custom-budget-error" : ""}`}
              />
              <button type="submit" className="btn btn-ghost shrink-0">
                {t("ads.apply")}
              </button>
            </div>
            {customError && (
              <p id="custom-budget-error" role="alert" className="mt-2 text-sm text-[#ff9aa6]">
                {customError}
              </p>
            )}
          </form>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-white/[0.02] p-4">
              <dt className="flex items-center gap-2 text-sm text-muted">
                {t("summary.mediaSpend")}
                <span className="badge bg-purple/15 text-lilac">{t("ads.paidToMeta")}</span>
              </dt>
              <dd className="mt-1 text-xl font-extrabold text-offwhite">
                <bdi>{money(price.mediaSpendQarMinor)}</bdi>
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-white/[0.02] p-4">
              <dt className="text-sm text-muted">{t("ads.management")}</dt>
              <dd className="mt-1 text-xl font-extrabold text-offwhite">
                <bdi>{money(price.managementFeeQarMinor)}</bdi>
              </dd>
              <dd className="mt-1 text-xs text-muted">{t("ads.managementRule", { min: qar(ESTIMATOR_CONFIG.management.minQar) })}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="flex gap-2 rounded-xl border border-dashed border-line-strong p-4 text-sm text-muted">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-cyan" />
          {t("forecast.noAdsHint")}
        </p>
      )}

      <ForecastCard forecast={forecast} compact />
    </div>
  );
}
