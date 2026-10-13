import type { Metadata } from "next";
import Link from "next/link";
import { OrderSteps } from "@/components/home/HomeSections";
import { PageHeader } from "@/components/site/SectionHeader";
import { ArrowIcon, ChatIcon, StoreIcon, TruckIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { revealDelay } from "@/components/ui/reveal-delay";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy, whatsappLink } from "@/lib/site-copy";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = dictionaries[params.locale].delivery;
  return { title: t.title, description: t.intro };
}

export default function DeliveryPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const t = dictionaries[locale].delivery;
  const copy = siteCopy[locale];
  const { delivery, pickup } = restaurant.fees;

  const cards = [
    {
      icon: <TruckIcon className="size-7" />,
      label: t.deliveryLabel,
      value: <Price amount={delivery} locale={locale} currencyClassName="text-xl" />,
      suffix: t.perOrder,
      note: t.deliveryNote,
    },
    {
      icon: <StoreIcon className="size-7" />,
      label: t.pickupLabel,
      value: pickup === 0 ? t.free : <Price amount={pickup} locale={locale} currencyClassName="text-xl" />,
      note: t.pickupNote,
    },
  ];

  return (
    <>
      <PageHeader eyebrow={copy.deliveryPage.eyebrow} title={t.title} intro={t.intro} />
      <section aria-label={t.title} className="mx-auto max-w-content px-4 py-16 md:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card, index) => (
            <div
              key={card.label}
              data-reveal
              style={revealDelay(index, 120)}
              className="rounded-card bg-surface p-8 shadow-soft ring-1 ring-line/70"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-leaf/15 text-forest">
                {card.icon}
              </span>
              <h2 className="mt-6 font-display text-2xl text-forest">{card.label}</h2>
              <p className="mt-3 flex items-baseline gap-2 text-5xl font-extrabold text-ink">
                {card.value}
                {card.suffix && <span className="text-sm font-medium text-muted">{card.suffix}</span>}
              </p>
              <p className="mt-4 text-muted">{card.note}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/menu`} className="btn-primary">
            {dictionaries[locale].hero.orderNow}
            <ArrowIcon />
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <ChatIcon />
            {dictionaries[locale].hero.whatsapp}
          </a>
        </div>
      </section>
      <OrderSteps locale={locale} />
    </>
  );
}
