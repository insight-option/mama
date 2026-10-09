"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { media, mediaAlt } from "@/content/media";

/** Autoplays the skyline loop only on capable connections; otherwise the poster image stays. */
function HeroVideo() {
  const { t } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || (conn?.effectiveType && /2g|3g/.test(conn.effectiveType));
    if (reduce || small || slow) return;
    // Defer until the page has painted so the video never competes with LCP.
    const id = window.setTimeout(() => setEnabled(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 size-full object-cover"
        src={media("hero-loop.mp4")}
        poster={media("hero-loop-poster.jpg")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
        className="absolute bottom-6 end-6 z-20 grid size-11 place-items-center rounded-full border border-line-strong bg-navy/60 text-offwhite backdrop-blur transition hover:border-cyan"
        aria-label={playing ? t("hero.pauseVideo") : t("hero.playVideo")}
      >
        <Icon name={playing ? "pause" : "play"} size={16} />
      </button>
    </>
  );
}

export function Hero() {
  const { t, locale } = useI18n();
  const stats = [1, 2, 3] as const;

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
      <div className="absolute inset-0 -z-10">
        <Image
          src={media("hero-loop-poster.jpg")}
          alt={mediaAlt("hero-loop-poster.jpg", locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo />
        <div className="media-overlay absolute inset-0" />
      </div>

      <div className="container-page relative">
        <div className="max-w-3xl animate-fade-up">
          <span className="badge glass !px-3 !py-1.5 text-xs text-ink">
            <Icon name="pin" size={14} className="text-cyan" />
            {t("hero.badge")}
          </span>
          <p className="tracking-eyebrow mt-6 text-xs font-bold text-cyan sm:text-sm">{t("hero.eyebrow")}</p>
          <h1 id="hero-title" className="mt-4 text-4xl font-black leading-[1.12] text-offwhite sm:text-5xl lg:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">{t("hero.subtitle")}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#estimator" className="btn btn-primary !min-h-13 !px-7 text-base">
              {t("hero.cta")}
              <Icon name="arrow" size={18} className="rtl:rotate-180" />
            </a>
            <a href="#method" className="btn btn-ghost !min-h-13 !px-7 text-base backdrop-blur">
              {t("hero.secondary")}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink">
            {(["hero.trust1", "hero.trust2", "hero.trust3"] as const).map((key) => (
              <li key={key} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-cyan/15 text-cyan">
                  <Icon name="check" size={12} strokeWidth={3} />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-14 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          {stats.map((n) => (
            <div key={n} className="glass flex flex-col rounded-2xl p-4 sm:p-5">
              <dt className="order-2 mt-1 text-xs text-muted sm:text-sm">{t(`hero.stat${n}.label`)}</dt>
              <dd className="text-xl font-black text-offwhite sm:text-3xl">{t(`hero.stat${n}.value`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
