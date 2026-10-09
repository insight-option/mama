"use client";

import { useI18n } from "@/components/common/I18nProvider";
import { Icon, type IconName } from "@/components/common/Icon";
import { ESTIMATOR_CONFIG } from "@/config/pricing";
import { act } from "@/features/estimator/actions";
import { usePlan } from "@/features/estimator/usePlan";
import type { Addons } from "@/features/estimator/types";
import { formatQar } from "@/lib/formatCurrency";
import { StepHeading } from "./controls";

const ADDONS: Array<{ key: keyof Addons; icon: IconName; priceQar: number | null }> = [
  { key: "landingPage", icon: "layout", priceQar: ESTIMATOR_CONFIG.addonsQar.landingPage },
  { key: "pixelCapi", icon: "activity", priceQar: ESTIMATOR_CONFIG.addonsQar.pixelCapi },
  { key: "customWebApp", icon: "code", priceQar: null },
];

export function AddonsStep({ headingId }: { headingId: string }) {
  const { t, locale } = useI18n();
  const { state, display } = usePlan();

  return (
    <div className="space-y-6">
      <StepHeading id={headingId} icon="layout" title={t("addons.title")} subtitle={t("addons.subtitle")} />
      <fieldset>
        <legend className="sr-only">{t("addons.title")}</legend>
        <div className="grid gap-3">
          {ADDONS.map(({ key, icon, priceQar }) => (
            <label key={key} className="chip !items-start !gap-4 !p-4 sm:!p-5">
              <input
                type="checkbox"
                className="sr-only"
                checked={state.addons[key]}
                onChange={(e) => act({ type: "toggleAddon", addon: key, value: e.target.checked })}
              />
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 text-cyan">
                <Icon name={icon} size={22} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-bold text-offwhite">{t(`addons.${key}`)}</span>
                <span className="text-sm leading-relaxed text-muted">{t(`addons.${key}.desc`)}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  {priceQar === null ? (
                    <span className="badge bg-warn/10 text-warn ring-1 ring-warn/30">{t("addons.customQuote")}</span>
                  ) : (
                    <>
                      <span className="text-base font-extrabold text-offwhite">
                        <bdi>{formatQar(priceQar, display.currency, locale)}</bdi>
                      </span>
                      <span className="badge bg-white/5 text-muted ring-1 ring-line">{t("addons.oneTime")}</span>
                    </>
                  )}
                </span>
              </span>
              <span className="chip-check" aria-hidden="true">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
