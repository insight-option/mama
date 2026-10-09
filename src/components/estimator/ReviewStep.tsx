"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { applyConfigChange } from "@/features/estimator/actions";
import { usePlan } from "@/features/estimator/usePlan";
import { TIMELINES, type ContactDetails, type Timeline } from "@/features/estimator/types";
import { StepHeading } from "./controls";
import { ForecastCard } from "./ForecastCard";
import { PlanActions } from "./PlanActions";

const TIMELINE_KEYS = { now: "lead.timelineNow", month: "lead.timelineMonth", later: "lead.timelineLater" } as const;

export function ReviewStep({ headingId }: { headingId: string }) {
  const { t, locale } = useI18n();
  const { recommendations, forecast, reference } = usePlan();
  // Contact details live in component state only — never persisted, never in URLs or analytics.
  const [contact, setContact] = useState<ContactDetails>({ name: "", company: "", timeline: null, notes: "" });
  const update = <K extends keyof ContactDetails>(key: K, value: ContactDetails[K]) => setContact((c) => ({ ...c, [key]: value }));

  return (
    <div className="space-y-8">
      <StepHeading id={headingId} icon="sparkles" title={t("recommendation.title")} />

      <ul className="grid gap-3">
        {recommendations.map((rec) => (
          <li key={rec.id} className="rounded-2xl border border-cyan/25 bg-gradient-to-br from-cyan/[0.07] to-purple/[0.06] p-5">
            <p className="flex items-start gap-2 text-lg font-bold text-offwhite">
              <Icon name="sparkles" size={20} className="mt-1 shrink-0 text-cyan" />
              {t(rec.headline)}
            </p>
            <dl className="mt-3 grid gap-2 text-sm leading-relaxed">
              <div>
                <dt className="inline font-semibold text-ink">{t("recommendation.reason")}: </dt>
                <dd className="inline text-muted">{t(rec.reason)}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-ink">{t("recommendation.tradeoff")}: </dt>
                <dd className="inline text-muted">{t(rec.tradeoff)}</dd>
              </div>
            </dl>
            {rec.action && (
              <button type="button" className="btn btn-ghost mt-4 !min-h-10 text-sm" onClick={() => applyConfigChange(rec.action!.change)}>
                <Icon name="plus" size={16} />
                {t(rec.action.label)}
              </button>
            )}
          </li>
        ))}
      </ul>

      <ForecastCard forecast={forecast} />

      <section aria-labelledby="lead-title" className="rounded-2xl border border-line bg-white/[0.02] p-5">
        <h4 id="lead-title" className="text-lg font-bold text-offwhite">
          {t("lead.title")}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-muted">{t("lead.subtitle")}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-name" className="mb-1.5 block text-sm font-semibold text-ink">
              {t("lead.name")}
            </label>
            <input id="lead-name" className="field" autoComplete="name" dir="auto" maxLength={80} value={contact.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label htmlFor="lead-company" className="mb-1.5 block text-sm font-semibold text-ink">
              {t("lead.company")}
            </label>
            <input id="lead-company" className="field" autoComplete="organization" dir="auto" maxLength={100} value={contact.company} onChange={(e) => update("company", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lead-timeline" className="mb-1.5 block text-sm font-semibold text-ink">
              {t("lead.timeline")}
            </label>
            <select
              id="lead-timeline"
              className="field"
              value={contact.timeline ?? ""}
              onChange={(e) => update("timeline", (e.target.value || null) as Timeline | null)}
            >
              <option value="">—</option>
              {TIMELINES.map((tl) => (
                <option key={tl} value={tl}>
                  {t(TIMELINE_KEYS[tl])}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lead-notes" className="mb-1.5 block text-sm font-semibold text-ink">
              {t("lead.notes")}
            </label>
            <textarea
              id="lead-notes"
              className="field min-h-24"
              dir="auto"
              maxLength={500}
              placeholder={t("lead.notesPlaceholder")}
              value={contact.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>
        </div>

        {reference && (
          <p className="mt-4 text-sm text-muted">
            {t("lead.reference")}: <bdi className="ltr-isolate font-mono font-semibold text-ink">{reference}</bdi>
          </p>
        )}

        <div className="mt-5">
          <PlanActions contact={contact} whatsappLabel="actions.whatsappFinal" />
        </div>

        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
          <Icon name="shield" size={14} className="mt-0.5 shrink-0 text-cyan" />
          <span>
            {t("lead.privacyNote")}{" "}
            <Link href={`/${locale}/privacy`} className="font-semibold text-cyan underline-offset-2 hover:underline">
              {t("legal.privacy")}
            </Link>
            .
          </span>
        </p>
      </section>
    </div>
  );
}
