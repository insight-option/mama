"use client";

import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import type { Bounds, ForecastResult } from "@/features/forecasting/calculate";
import { formatNumber } from "@/lib/formatCurrency";

function Notice({ icon, title, body }: { icon: "info" | "chart"; title: string; body?: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-dashed border-line-strong bg-white/[0.02] p-4">
      <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-muted" />
      <div>
        <p className="font-bold text-offwhite">{title}</p>
        {body && <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>}
      </div>
    </div>
  );
}

export function ForecastCard({ forecast, compact = false }: { forecast: ForecastResult; compact?: boolean }) {
  const { t, locale } = useI18n();
  const range = (b: Bounds) => (
    <bdi>
      {formatNumber(b.min, locale)} – {formatNumber(b.max, locale)}
    </bdi>
  );

  let body: React.ReactNode;
  if (forecast.status === "noAds") {
    body = <Notice icon="chart" title={t("forecast.noAds")} body={t("forecast.noAdsHint")} />;
  } else if (forecast.status === "noObjective") {
    body = <Notice icon="info" title={t("forecast.noObjective")} />;
  } else if (forecast.status === "unavailable") {
    body = <Notice icon="info" title={t("forecast.unavailable")} body={t("forecast.unavailableHint")} />;
  } else {
    const metrics = [
      { key: "impressions", label: t("forecast.impressions"), value: forecast.impressions, icon: "eye" as const },
      { key: "reach", label: t("forecast.reach"), value: forecast.reach, icon: "globe" as const },
      ...(forecast.outcome
        ? [{ key: "outcome", label: t(`forecast.${forecast.outcome.kind}`), value: forecast.outcome, icon: "message" as const }]
        : []),
    ];
    body = (
      <>
        <dl className={`grid gap-3 ${compact ? "sm:grid-cols-3" : "sm:grid-cols-3"}`}>
          {metrics.map((m) => (
            <div key={m.key} className="rounded-xl border border-line bg-white/[0.03] p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold text-muted">
                <Icon name={m.icon} size={14} className="text-cyan" />
                {m.label}
              </dt>
              <dd className="mt-2 text-lg font-extrabold text-offwhite">{range(m.value)}</dd>
              <dd className="text-[0.7rem] text-muted">{t("forecast.perMonth")}</dd>
            </div>
          ))}
        </dl>
        {forecast.outcome?.kind === "leads" && <p className="mt-3 text-xs text-muted">{t("forecast.leadQuality")}</p>}
        {forecast.outcomeUnavailable && (
          <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted">
            <Icon name="info" size={14} className="mt-0.5 shrink-0" />
            {t(forecast.outcomeUnavailable === "bookings" ? "forecast.bookingsUnavailable" : "forecast.salesUnavailable")}
          </p>
        )}
      </>
    );
  }

  return (
    <section aria-labelledby="forecast-title" className="rounded-2xl border border-line bg-navy-2/60 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 id="forecast-title" className="font-bold text-offwhite">
          {t("forecast.title")}
        </h4>
        <span className="badge bg-warn/10 text-warn ring-1 ring-warn/30">{t("forecast.badge")}</span>
      </div>
      {body}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        {forecast.status === "ok" && <span>{t(`forecast.provenance.${forecast.provenance}`)}</span>}
        <a href="#method" className="inline-flex items-center gap-1 font-semibold text-cyan hover:underline">
          <Icon name="info" size={14} />
          {t("forecast.howItWorks")}
        </a>
      </div>
      {!compact && <p className="mt-3 text-xs leading-relaxed text-muted">{t("forecast.disclaimer")}</p>}
    </section>
  );
}
