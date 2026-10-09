import { Icon, type IconName } from "@/components/common/Icon";
import type { Translate } from "@/i18n";

const STEPS: Array<{ n: 1 | 2 | 3 | 4; icon: IconName }> = [
  { n: 1, icon: "target" },
  { n: 2, icon: "video" },
  { n: 3, icon: "rocket" },
  { n: 4, icon: "chart" },
];

export function Process({ t }: { t: Translate }) {
  return (
    <section aria-labelledby="process-title" className="section">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("process.eyebrow")}</p>
          <h2 id="process-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
            {t("process.title")}
          </h2>
        </div>
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute inset-x-[12%] top-8 hidden h-px bg-gradient-to-r from-cyan/0 via-cyan/40 to-purple/0 lg:block" />
          {STEPS.map(({ n, icon }) => (
            <li key={n} className="card relative p-6 text-center">
              <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-navy text-cyan ring-1 ring-cyan/30">
                <Icon name={icon} size={26} />
                <span className="absolute -top-2 -end-2 grid size-7 place-items-center rounded-full bg-cyan text-xs font-black text-navy">{n}</span>
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-offwhite">{t(`process.s${n}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`process.s${n}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
