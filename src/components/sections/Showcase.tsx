"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { ESTIMATOR_CONFIG } from "@/config/pricing";
import { act, goToEstimator } from "@/features/estimator/actions";
import { useEstimatorState } from "@/features/estimator/store";
import { VIDEO_TIERS, type VideoTier } from "@/features/estimator/types";
import { formatQar, resolveDisplayCurrency } from "@/lib/formatCurrency";
import { media, mediaAlt } from "@/content/media";

/** Muted preview that loads lazily and plays only while visible (and never under reduced motion). */
function Reel({ tier }: { tier: VideoTier }) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.preload = "metadata";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-navy">
      <video
        ref={ref}
        className="size-full object-cover"
        src={media(`reel-${tier}.mp4`)}
        poster={media(`reel-${tier}-poster.jpg`)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={mediaAlt(`reel-${tier}.mp4`, locale)}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
        className="absolute bottom-3 end-3 grid size-10 place-items-center rounded-full border border-line-strong bg-navy/70 text-offwhite backdrop-blur transition hover:border-cyan"
        aria-label={playing ? t("showcase.pause") : t("showcase.play")}
      >
        <Icon name={playing ? "pause" : "play"} size={14} />
      </button>
    </div>
  );
}

export function Showcase() {
  const { t, locale } = useI18n();
  const state = useEstimatorState();

  return (
    <section id="showcase" aria-labelledby="showcase-title" className="section">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="tracking-eyebrow text-xs font-bold text-cyan">{t("showcase.eyebrow")}</p>
          <h2 id="showcase-title" className="mt-3 text-3xl font-black text-offwhite sm:text-4xl">
            {t("showcase.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("showcase.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {VIDEO_TIERS.map((tier) => {
            const selected = state.videoTier === tier;
            return (
              <article
                key={tier}
                className={`card flex flex-col p-3 transition ${selected ? "ring-1 ring-cyan/60" : ""} ${tier === "professional" ? "md:-translate-y-3" : ""}`}
              >
                <Reel tier={tier} />
                <div className="flex flex-1 flex-col p-3 pt-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-offwhite">{t(`videos.${tier}`)}</h3>
                    <span className="badge bg-white/5 text-muted ring-1 ring-line">{t(`videos.${tier}.duration`)}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(`showcase.${tier}.use`)}</p>
                  <p className="mt-4 text-2xl font-black text-offwhite">
                    <bdi>{t("showcase.from", { price: formatQar(ESTIMATOR_CONFIG.videoUnitQar[tier], resolveDisplayCurrency(state.currency).currency, locale) })}</bdi>
                  </p>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      act({ type: "setVideoTier", tier });
                      goToEstimator(1);
                    }}
                    className={`btn mt-4 w-full ${selected ? "btn-ghost !border-cyan" : "btn-primary"}`}
                  >
                    {selected ? (
                      <>
                        <Icon name="check" size={16} />
                        {t("showcase.selected")}
                      </>
                    ) : (
                      t("showcase.choose")
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-muted">{t("showcase.sampleNote")}</p>
      </div>
    </section>
  );
}
