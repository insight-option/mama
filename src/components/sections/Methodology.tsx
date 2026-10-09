import Image from "next/image";
import { Icon } from "@/components/common/Icon";
import { ESTIMATOR_CONFIG, METHODOLOGY_PROFILE } from "@/config/pricing";
import { media } from "@/content/media";
import type { Locale } from "@/features/estimator/types";
import type { Translate } from "@/i18n";
import { formatNumber, formatQar } from "@/lib/formatCurrency";

export function Methodology({ t, locale }: { t: Translate; locale: Locale }) {
  // Methodology is stated in QAR — the canonical billing currency.
  const q = (v: number) => formatQar(v, "QAR", locale);
  const n = (v: number) => formatNumber(v, locale, { maximumFractionDigits: 1 });
  const p = METHODOLOGY_PROFILE;
  const cfg = ESTIMATOR_CONFIG;

  const pricing = [
    { icon: "video" as const, title: t("method.p1.title"), body: t("method.p1.body", { quick: q(cfg.videoUnitQar.quick), professional: q(cfg.videoUnitQar.professional), cinematic: q(cfg.videoUnitQar.cinematic) }) },
    { icon: "megaphone" as const, title: t("method.p2.title"), body: t("method.p2.body", { min: q(cfg.management.minQar) }) },
    { icon: "coins" as const, title: t("method.p3.title"), body: t("method.p3.body", { landing: q(cfg.addonsQar.landingPage), pixel: q(cfg.addonsQar.pixelCapi) }) },
  ];

  const rows = [
    { label: t("method.cpm"), low: q(p.cpmQar.low), high: q(p.cpmQar.high) },
    { label: t("method.frequency"), low: n(p.frequency.low), high: n(p.frequency.high) },
    ...(p.cpeQar ? [{ label: t("method.cpe"), low: q(p.cpeQar.low), high: q(p.cpeQar.high) }] : []),
  ];

  return (
    <section id="method" aria-labelledby="method-title" className="section bg-navy-2/60">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("method.eyebrow")}</p>
            <h2 id="method-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
              {t("method.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("method.subtitle")}</p>

            <h3 className="mt-10 text-sm font-bold text-ink">{t("method.pricingTitle")}</h3>
            <ol className="mt-4 grid gap-4">
              {pricing.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan ring-1 ring-cyan/25">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-offwhite">
                      <span className="text-cyan">0{i + 1}.</span> {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
              <Image src={media("methodology-analytics.jpg")} alt={t("method.imageAlt")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            </div>
            <div className="card relative -mt-28 mx-3 p-5 sm:mx-6 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-offwhite">{t("method.forecastTitle")}</h3>
                <span className="badge bg-warn/10 text-warn ring-1 ring-warn/30">{t("forecast.badge")}</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted">
                      <th scope="col" className="pb-2 text-start font-semibold">{t("method.assumption")}</th>
                      <th scope="col" className="pb-2 text-end font-semibold">{t("method.low")}</th>
                      <th scope="col" className="pb-2 text-end font-semibold">{t("method.high")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((r) => (
                      <tr key={r.label}>
                        <th scope="row" className="py-2.5 text-start font-medium text-ink">{r.label}</th>
                        <td className="py-2.5 text-end font-bold text-offwhite"><bdi>{r.low}</bdi></td>
                        <td className="py-2.5 text-end font-bold text-offwhite"><bdi>{r.high}</bdi></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 rounded-lg bg-white/[0.03] p-3 text-xs leading-relaxed text-ink">{t("method.formulas")}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted">{t("method.provenance")}</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm font-bold text-offwhite">{t("method.fxTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t("method.fxBody")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
