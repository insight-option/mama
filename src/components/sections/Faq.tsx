import { Icon } from "@/components/common/Icon";
import type { Translate } from "@/i18n";

export const FAQ_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function Faq({ t }: { t: Translate }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-navy-2/60">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("faq.eyebrow")}</p>
          <h2 id="faq-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t("summary.trust")}</p>
        </div>
        <div className="grid gap-3">
          {FAQ_NUMBERS.map((n) => (
            <details key={n} className="faq-item card group !rounded-2xl p-0 open:ring-1 open:ring-cyan/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start font-bold text-offwhite">
                {t(`faq.q${n}`)}
                <span className="faq-icon grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-cyan transition-transform">
                  <Icon name="plus" size={16} />
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{t(`faq.a${n}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
