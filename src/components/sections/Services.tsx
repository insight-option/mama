import Image from "next/image";
import { Icon, type IconName } from "@/components/common/Icon";
import { media } from "@/content/media";
import type { Translate } from "@/i18n";

const SERVICES: Array<{ id: "video" | "ads" | "web"; icon: IconName; image: string }> = [
  { id: "video", icon: "video", image: "service-ai-video.jpg" },
  { id: "ads", icon: "megaphone", image: "service-meta-ads.jpg" },
  { id: "web", icon: "layout", image: "service-web-tech.jpg" },
];

export function Services({ t }: { t: Translate }) {
  return (
    <section id="services" aria-labelledby="services-title" className="section bg-navy-2/60">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("services.eyebrow")}</p>
          <h2 id="services-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
            {t("services.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("services.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map(({ id, icon, image }) => (
            <article key={id} className="card group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={media(image)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                <span className="absolute bottom-4 start-4 grid size-12 place-items-center rounded-xl bg-navy/70 text-cyan ring-1 ring-cyan/30 backdrop-blur">
                  <Icon name={icon} size={24} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold text-offwhite">{t(`services.${id}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`services.${id}.desc`)}</p>
                <div className="mt-5 grid gap-4 border-t border-line pt-5 text-sm">
                  <div>
                    <p className="mb-2 text-xs font-bold text-ink">{t("services.included")}</p>
                    <ul className="grid gap-1.5">
                      {([1, 2, 3] as const).map((n) => (
                        <li key={n} className="flex items-start gap-2 text-ink">
                          <Icon name="check" size={16} className="mt-0.5 shrink-0 text-cyan" />
                          {t(`services.${id}.in${n}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold text-ink">{t("services.notIncluded")}</p>
                    <p className="flex items-start gap-2 text-muted">
                      <Icon name="minus" size={16} className="mt-0.5 shrink-0" />
                      {t(`services.${id}.out1`)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
