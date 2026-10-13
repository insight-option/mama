import Link from "next/link";
import { ArrowIcon, ChatIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy, whatsappLink } from "@/lib/site-copy";
import { HeroMedia } from "./HeroMedia";

// Poster: the Mansaf photo, a verified match for its dish.
const HERO_POSTER = "/WhatsApp Image 2026-10-10 at 1.05.04 PM.jpeg";

export function Hero({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].hero;
  const copy = siteCopy[locale];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-7rem)] max-h-[880px] items-end overflow-hidden text-white md:min-h-[640px]"
    >
      <HeroMedia poster={HERO_POSTER} alt={t.photoAlt} />
      {/* Legibility: dark from the bottom and the reading start side. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-night/25 md:via-night/55 md:to-night/10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-night/80 via-night/20 to-transparent md:block rtl:bg-gradient-to-l"
      />

      <div className="relative mx-auto w-full max-w-content px-4 pb-14 pt-32 md:pb-24">
        <p className="eyebrow mb-5 animate-fade-up">{t.eyebrow}</p>
        <h1
          id="hero-title"
          className="max-w-3xl animate-fade-up text-balance font-display text-5xl leading-[1.05] [animation-delay:100ms] md:text-7xl"
        >
          {t.title}
        </h1>
        <p className="mt-5 max-w-xl animate-fade-up text-lg text-white/80 [animation-delay:200ms] md:text-xl">
          {t.intro}
        </p>

        <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
          <Link href={`/${locale}/menu`} className="btn-leaf min-h-14 px-8 text-base">
            {t.orderNow}
            <ArrowIcon />
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost-light min-h-14">
            <ChatIcon />
            {t.whatsapp}
          </a>
        </div>

        <ul className="mt-8 flex animate-fade-up flex-wrap gap-2 text-sm text-white/85 [animation-delay:400ms]">
          <li className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">
            <span>{t.deliveryChip}</span>
            <Price amount={restaurant.fees.delivery} locale={locale} className="font-bold" />
          </li>
          <li className="rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">{t.pickupChip}</li>
        </ul>
      </div>

      <Link
        href={`/${locale}/menu`}
        className="absolute bottom-5 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 transition-colors hover:text-white md:flex rtl:translate-x-1/2"
      >
        {copy.home.scroll}
        <span aria-hidden="true" className="h-10 w-px animate-pulse bg-white/40" />
      </Link>
    </section>
  );
}
