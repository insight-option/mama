"use client";

import Image from "next/image";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { PlanActions } from "@/components/estimator/PlanActions";
import { media, mediaAlt } from "@/content/media";

export function FinalCta() {
  const { t, locale } = useI18n();
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden py-24 lg:py-32">
      <Image src={media("cta-doha-skyline.jpg")} alt={mediaAlt("cta-doha-skyline.jpg", locale)} fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy via-navy/70 to-navy" />
      <div className="container-page">
        <div className="glass mx-auto max-w-3xl rounded-3xl p-6 text-center sm:p-10">
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("cta.eyebrow")}</p>
          <h2 id="cta-title" className="mt-3 text-3xl font-black text-offwhite sm:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink sm:text-lg">{t("cta.subtitle")}</p>
          <div className="mx-auto mt-8 max-w-xl text-start">
            <PlanActions whatsappLabel="actions.whatsappFinal" />
          </div>
          <a href="#estimator" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline">
            {t("cta.secondary")}
            <Icon name="arrow" size={16} className="rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
