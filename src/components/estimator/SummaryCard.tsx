"use client";

import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import type { LineItem } from "@/features/pricing/calculate";
import { usePlan } from "@/features/estimator/usePlan";
import { formatDate, formatRate } from "@/lib/formatCurrency";
import { ESTIMATOR_CONFIG, FX_RATES } from "@/config/pricing";
import { PlanActions } from "./PlanActions";

export function SummaryCard({ headingId = "summary-title" }: { headingId?: string }) {
  const { t, locale } = useI18n();
  const { state, price, money, display } = usePlan();

  const lineLabel = (line: LineItem) => {
    switch (line.id) {
      case "videos":
        return t("summary.videosLine", { count: line.quantity ?? 0, tier: t(`videos.${state.videoTier}`) });
      case "mediaSpend":
        return t("summary.mediaSpend");
      case "management":
        return t("summary.management");
      default:
        return t(`summary.${line.id}`);
    }
  };

  const monthly = price.lines.filter((l) => l.billing === "monthly");
  const oneTime = price.lines.filter((l) => l.billing === "oneTime");
  const nothing = price.lines.length === 0;

  const renderRow = (line: LineItem) => (
    <li key={line.id} className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="flex flex-wrap items-center gap-1.5 text-ink">
        {lineLabel(line)}
        {line.kind === "media" && <span className="badge bg-purple/15 text-lilac">{t("summary.mediaBadge")}</span>}
      </span>
      <span className="shrink-0 font-semibold text-offwhite">
        {line.amountQarMinor === null ? (
          <span className="text-warn">{t("addons.priceOnRequest")}</span>
        ) : (
          <bdi>{money(line.amountQarMinor)}</bdi>
        )}
      </span>
    </li>
  );

  return (
    <section aria-labelledby={headingId} className="card relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-[-4rem] size-56 rounded-full bg-cyan/15 blur-3xl" />
      <div className="relative">
        <p className="flex items-center gap-2 text-xs font-bold text-cyan">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          {t("summary.live")}
        </p>
        <h3 id={headingId} className="mt-1 text-xl font-extrabold text-offwhite">
          {t("summary.title")}
        </h3>

        {nothing ? (
          <p className="mt-5 rounded-xl border border-dashed border-line-strong p-4 text-sm text-muted">{t("summary.empty")}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {monthly.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase text-muted">
                  <span className="badge bg-cyan/10 text-cyan">{t("summary.monthlyBadge")}</span>
                  {t("summary.monthlyGroup")}
                </p>
                <ul className="mt-1 divide-y divide-line">{monthly.map(renderRow)}</ul>
              </div>
            )}
            {oneTime.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase text-muted">
                  <span className="badge bg-white/10 text-ink">{t("summary.oneTimeBadge")}</span>
                  {t("summary.oneTimeGroup")}
                </p>
                <ul className="mt-1 divide-y divide-line">{oneTime.map(renderRow)}</ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 space-y-4 border-t border-line pt-5">
          <div>
            <p className="text-sm text-muted">{t("summary.monthly")}</p>
            <p className="mt-0.5 text-3xl font-black text-offwhite" data-testid="monthly-total">
              <bdi>{money(price.recurringQarMinor)}</bdi>
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-cyan/10 to-purple/10 p-4 ring-1 ring-cyan/25">
            <p className="text-sm text-ink">{t("summary.firstMonth")}</p>
            <p className="mt-0.5 text-3xl font-black text-gradient sm:text-4xl" data-testid="first-month-total">
              <bdi>{money(price.firstMonthQarMinor)}</bdi>
            </p>
            {price.customQuoteRequired && <p className="mt-2 text-xs font-semibold text-warn">{t("summary.customQuote")}</p>}
          </div>
          {!nothing && (
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white/[0.03] p-3">
                <dt className="text-muted">{t("summary.agencyFee")}</dt>
                <dd className="mt-1 text-sm font-bold text-offwhite">
                  <bdi>{money(price.fontaineMonthlyQarMinor)}</bdi>
                </dd>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3">
                <dt className="text-muted">{t("summary.mediaSpend")}</dt>
                <dd className="mt-1 text-sm font-bold text-offwhite">
                  <bdi>{money(price.mediaSpendQarMinor)}</bdi>
                </dd>
              </div>
              <div className="col-span-2 rounded-lg bg-white/[0.03] p-3">
                <dt className="text-muted">{t("summary.setup")}</dt>
                <dd className="mt-1 text-sm font-bold text-offwhite">
                  <bdi>{money(price.oneTimeQarMinor)}</bdi>
                </dd>
              </div>
            </dl>
          )}
        </div>

        {display.stale && <p className="mt-4 text-xs text-warn">{t("summary.fxStale", { currency: state.currency })}</p>}
        {!display.stale && display.currency !== "QAR" && (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t("summary.fxNote", {
              rate: formatRate(display.currency, locale),
              currency: display.currency,
              date: formatDate(FX_RATES[display.currency].asOf, locale),
            })}
          </p>
        )}

        <div className="mt-5">
          <PlanActions variant="compact" />
        </div>

        <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted">
          <Icon name="info" size={14} className="mt-0.5 shrink-0" />
          {t("summary.trust")}
        </p>
        <p className="mt-2 text-[0.7rem] text-muted/80">
          {t("summary.configVersion", { version: ESTIMATOR_CONFIG.configVersion, date: formatDate(ESTIMATOR_CONFIG.effectiveDate, locale) })}
        </p>
      </div>
    </section>
  );
}
