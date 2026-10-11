import Image from "next/image";
import { ChatIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

// The Mansaf photo is a verified match for its dish (see data/menu.ts).
const HERO_PHOTO = "/WhatsApp Image 2026-10-10 at 1.05.04 PM.jpeg";

export function Hero({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].hero;

  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-content px-4 pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-forest md:grid md:grid-cols-[1.15fr_1fr]">
        {/* Photo: full background on mobile, its own column on desktop. */}
        <div className="absolute inset-0 md:relative md:order-last md:min-h-[360px]">
          <Image
            src={HERO_PHOTO}
            alt={t.photoAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[50%_45%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-forest from-35% via-forest/80 to-forest/0 md:hidden"
        />

        <div className="relative flex flex-col justify-end gap-3 p-5 pt-28 md:gap-4 md:justify-center md:p-10">
          <p className="w-fit rounded-full bg-forest/80 px-3 py-1 text-xs font-bold text-leaf md:bg-transparent md:p-0 md:text-sm">
            {t.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-balance text-[1.75rem] font-extrabold leading-tight text-white md:text-4xl lg:text-[2.75rem]"
          >
            {t.title}
          </h1>
          <p className="hidden max-w-md text-lg text-white/80 md:block">{t.intro}</p>

          <div className="mt-1 flex flex-wrap gap-2 md:gap-3">
            <a
              href="#menu"
              className="inline-flex min-h-12 items-center rounded-full bg-leaf px-6 text-base md:px-7 font-extrabold text-forest transition-colors hover:bg-white"
            >
              {t.orderNow}
            </a>
            <a
              href={`https://wa.me/${restaurant.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <ChatIcon />
              {t.whatsapp}
            </a>
          </div>

          <ul className="flex flex-wrap gap-2 text-xs font-medium text-white/90">
            <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <span>{t.deliveryChip}</span>
              <Price amount={restaurant.fees.delivery} locale={locale} />
            </li>
            <li className="rounded-full bg-white/10 px-3 py-1.5">{t.pickupChip}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
