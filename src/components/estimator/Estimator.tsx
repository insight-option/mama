"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { PRESETS } from "@/config/pricing";
import { act } from "@/features/estimator/actions";
import { LAST_STEP } from "@/features/estimator/state";
import { dispatch, hydrateFromBrowser } from "@/features/estimator/store";
import { usePlan } from "@/features/estimator/usePlan";
import { PRESET_IDS, STEP_IDS } from "@/features/estimator/types";
import { track } from "@/lib/analytics";
import { formatQar } from "@/lib/formatCurrency";
import { AddonsStep } from "./AddonsStep";
import { CampaignStep } from "./CampaignStep";
import { ContextStep } from "./ContextStep";
import { MobileSummary } from "./MobileSummary";
import { ReviewStep } from "./ReviewStep";
import { SummaryCard } from "./SummaryCard";
import { VideoStep } from "./VideoStep";

const STEP_COMPONENTS = [ContextStep, VideoStep, CampaignStep, AddonsStep, ReviewStep];

function PresetPicker() {
  const { t, locale } = useI18n();
  const { state, display } = usePlan();
  return (
    <div className="mb-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-bold text-offwhite">{t("presets.title")}</h3>
          <p className="text-sm text-muted">{t("presets.subtitle")}</p>
        </div>
        <span className="badge bg-white/5 text-muted ring-1 ring-line">
          {state.preset ? t(`presets.${state.preset}`) : t("presets.custom")}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {PRESET_IDS.map((id) => {
          const preset = PRESETS[id];
          const active = state.preset === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => act({ type: "applyPreset", preset: id })}
              className="chip !flex-col !items-start !gap-0.5 !p-3 sm:!p-4"
            >
              <span className="flex w-full items-center justify-between gap-1">
                <span className="font-bold text-offwhite">{t(`presets.${id}`)}</span>
                {active && <Icon name="check" size={16} className="text-cyan" />}
              </span>
              <span className="text-xs text-muted">{t(`presets.${id}.desc`)}</span>
              <span className="mt-1.5 hidden text-xs font-semibold text-ink sm:block">
                {t("videos.count", { count: preset.videoQuantity })} · <bdi>{formatQar(preset.adBudgetQar, display.currency, locale)}</bdi>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">{t("presets.note")}</p>
    </div>
  );
}

/** Announces totals politely, only after the user pauses — not on every slider tick. */
function LiveAnnouncer() {
  const { t } = useI18n();
  const { price, money } = usePlan();
  const [text, setText] = useState("");
  const first = useRef(true);
  const monthly = money(price.recurringQarMinor);
  const firstMonth = money(price.firstMonthQarMinor);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(() => setText(t("summary.announce", { monthly, firstMonth })), 900);
    return () => window.clearTimeout(timer);
  }, [monthly, firstMonth, t]);
  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {text}
    </p>
  );
}

export function Estimator() {
  const { t } = useI18n();
  const { state } = usePlan();
  const panelRef = useRef<HTMLDivElement>(null);
  const userNavigated = useRef(false);

  useEffect(() => hydrateFromBrowser(), []);

  useEffect(() => {
    if (state.industry && state.objective) track("EstimateCompleted", { industry: state.industry, objective: state.objective });
  }, [state.industry, state.objective]);

  // Move focus to the new step heading, and bring the panel into view if it scrolled away.
  useEffect(() => {
    if (!userNavigated.current) return;
    userNavigated.current = false;
    const panel = panelRef.current;
    if (!panel) return;
    panel.querySelector<HTMLElement>("h3[tabindex]")?.focus({ preventScroll: true });
    if (panel.getBoundingClientRect().top < 72) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [state.step]);

  const goTo = (step: number) => {
    userNavigated.current = true;
    dispatch({ type: "setStep", step });
  };

  const StepComponent = STEP_COMPONENTS[state.step] ?? ContextStep;
  const headingId = `step-${STEP_IDS[state.step]}-title`;

  return (
    <section id="estimator" aria-labelledby="estimator-title" className="section relative">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("estimator.eyebrow")}</p>
          <h2 id="estimator-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl lg:text-5xl">
            {t("estimator.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("estimator.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
          <div className="card min-w-0 p-4 sm:p-6 lg:p-8">
            <PresetPicker />

            <nav aria-label={t("estimator.stepNav")} className="-mx-1 mb-6 overflow-x-auto px-1 pb-1">
              <ol className="flex min-w-max gap-2">
                {STEP_IDS.map((id, index) => {
                  const current = index === state.step;
                  const done = index < state.step;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={current ? "step" : undefined}
                        className={`flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition ${
                          current
                            ? "border-cyan bg-cyan/10 text-offwhite"
                            : "border-line text-muted hover:border-line-strong hover:text-ink"
                        }`}
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                            current ? "bg-cyan text-navy" : done ? "bg-cyan/20 text-cyan" : "bg-white/10 text-muted"
                          }`}
                        >
                          {done ? <Icon name="check" size={12} strokeWidth={3} /> : index + 1}
                        </span>
                        {t(`steps.${id}`)}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div ref={panelRef} className="scroll-mt-24">
              <p className="mb-4 text-xs font-semibold text-muted">
                {t("estimator.stepOf", { current: state.step + 1, total: STEP_IDS.length })}
              </p>
              <div key={state.step} className="animate-fade-up">
                <StepComponent headingId={headingId} />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
              <button type="button" className="btn btn-ghost" onClick={() => goTo(state.step - 1)} disabled={state.step === 0}>
                <Icon name="chevron" size={18} className="rotate-180 rtl:rotate-0" />
                {t("nav.back")}
              </button>
              {state.step < LAST_STEP ? (
                <button type="button" className="btn btn-primary" onClick={() => goTo(state.step + 1)}>
                  {t("nav.next")}
                  <Icon name="chevron" size={18} className="rtl:rotate-180" />
                </button>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => { act({ type: "reset" }); goTo(0); }}>
                  <Icon name="refresh" size={18} />
                  {t("actions.reset")}
                </button>
              )}
            </div>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <SummaryCard />
          </aside>
        </div>
      </div>
      <MobileSummary />
      <LiveAnnouncer />
    </section>
  );
}
