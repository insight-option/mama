"use client";

import Image from "next/image";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { INDUSTRY_ICONS } from "@/components/estimator/ContextStep";
import { act, goToEstimator } from "@/features/estimator/actions";
import type { Industry } from "@/features/estimator/types";
import { media } from "@/content/media";

const CARDS: Array<{ industry: Exclude<Industry, "other">; image: string }> = [
  { industry: "restaurants", image: "industry-restaurants.jpg" },
  { industry: "automotive", image: "reel-professional-poster.jpg" },
  { industry: "realEstate", image: "industry-real-estate.jpg" },
  { industry: "ecommerce", image: "industry-ecommerce-v2.jpg" },
  { industry: "professional", image: "industry-professional.jpg" },
  { industry: "healthBeauty", image: "industry-health-beauty.jpg" },
];

export function Industries() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="industries-title" className="section pt-16 lg:pt-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("industries.eyebrow")}</p>
            <h2 id="industries-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
              {t("industries.title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{t("industries.subtitle")}</p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ industry, image }) => (
            <li key={industry}>
              <button
                type="button"
                onClick={() => {
                  act({ type: "setIndustry", industry });
                  goToEstimator(0);
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line text-start"
              >
                <Image
                  src={media(image)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/5" />
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-navy/70 text-cyan ring-1 ring-cyan/30 backdrop-blur">
                    <Icon name={INDUSTRY_ICONS[industry]} size={20} />
                  </span>
                  <span className="mt-2 text-lg font-bold text-offwhite">{t(`industry.${industry}`)}</span>
                  <span className="text-sm text-ink/90">{t(`industry.${industry}.desc`)}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan opacity-90 transition group-hover:gap-2.5">
                    {t("industries.cta")}
                    <Icon name="arrow" size={16} className="rtl:rotate-180" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
