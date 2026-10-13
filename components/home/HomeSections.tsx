import Image from "next/image";
import Link from "next/link";
import { DishImage } from "@/components/menu/DishImage";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ArrowIcon, ChatIcon, TagIcon } from "@/components/ui/icons";
import { PriceTag } from "@/components/ui/PriceTag";
import { revealDelay } from "@/components/ui/reveal-delay";
import { categories } from "@/data/menu";
import { effectivePriceFor, unitPriceFor } from "@/lib/cart";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy, whatsappLink } from "@/lib/site-copy";
import type { MenuItem } from "@/types/menu";

/** Lowest current price of a dish (the one-person price for servings). */
function fromPrice(item: MenuItem) {
  const serving = item.pricing.type === "serving" ? "one" : undefined;
  return {
    amount: effectivePriceFor(item, serving) ?? 0,
    regular: unitPriceFor(item, serving) ?? undefined,
  };
}

/** Infinite band of dish names under the hero. Decorative. */
export function DishMarquee({ items, locale }: { items: MenuItem[]; locale: Locale }) {
  const names = items.map((i) => i.name[locale]);
  const run = [...names, ...names];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-forest py-4 text-white/80">
      <div dir="ltr" className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg">
        {run.map((name, i) => (
          <span key={i} className="flex items-center gap-10">
            {name}
            <span className="size-1.5 rounded-full bg-leaf" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function SignatureDishes({ items, locale }: { items: MenuItem[]; locale: Locale }) {
  const copy = siteCopy[locale];
  const t = dictionaries[locale].menu;
  const featured = (items.some((i) => i.featured) ? items.filter((i) => i.featured) : items)
    .filter((i) => i.image && i.available)
    .slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="signature-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-content px-4">
        <SectionHeader
          id="signature-title"
          eyebrow={copy.home.signatureEyebrow}
          title={copy.home.signatureTitle}
          intro={copy.home.signatureIntro}
        >
          <Link href={`/${locale}/menu`} className="btn-ghost">
            {copy.home.viewMenu}
            <ArrowIcon />
          </Link>
        </SectionHeader>
      </div>

      <ul className="no-scrollbar mx-auto mt-10 flex max-w-content snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
        {featured.map((item, index) => {
          const price = fromPrice(item);
          return (
            <li
              key={item.id}
              data-reveal
              style={revealDelay(index)}
              className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]"
            >
              <Link
                href={`/${locale}/menu/${item.id}`}
                className="group block overflow-hidden rounded-card bg-surface shadow-soft ring-1 ring-line/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative">
                  <DishImage
                    image={item.image}
                    locale={locale}
                    pendingLabel={t.photoPending}
                    frame="relative aspect-[4/5] overflow-hidden"
                    sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 78vw"
                  />
                  {item.offer && (
                    <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-leaf px-3 py-1.5 text-xs font-extrabold text-night">
                      <TagIcon className="size-3.5" />
                      {item.offer.label?.[locale] || copy.product.offer}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 to-transparent p-5 pt-16 text-white">
                    <p className="font-display text-2xl">{item.name[locale]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <PriceTag amount={price.amount} regular={price.regular} locale={locale} size="sm" />
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-forest transition-colors group-hover:text-leaf">
                    {copy.product.view}
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CategoryTiles({ items, locale }: { items: MenuItem[]; locale: Locale }) {
  const copy = siteCopy[locale];
  const tiles = categories
    .map((category) => {
      const inCategory = items.filter((i) => i.category === category.id);
      return { category, count: inCategory.length, cover: inCategory.find((i) => i.image)?.image };
    })
    .filter((tile) => tile.count > 0);

  return (
    <section aria-labelledby="categories-title" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-content px-4">
        <SectionHeader id="categories-title" eyebrow={copy.home.categoriesEyebrow} title={copy.home.categoriesTitle} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ category, count, cover }, index) => (
            <li key={category.id} data-reveal style={revealDelay(index)}>
              <Link
                href={`/${locale}/menu?category=${category.id}`}
                className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-card bg-forest text-white shadow-soft sm:aspect-[3/4]"
              >
                {cover && (
                  <Image
                    src={cover.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized={cover.remote}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                <span className="relative flex w-full items-end justify-between gap-3 p-6">
                  <span>
                    <span className="block font-display text-2xl md:text-3xl">{category.name[locale]}</span>
                    <span className="text-sm text-white/75">{copy.home.dishes(count)}</span>
                  </span>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-leaf group-hover:text-night">
                    <ArrowIcon />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function OffersTeaser({ items, locale }: { items: MenuItem[]; locale: Locale }) {
  const copy = siteCopy[locale];
  const offers = items.filter((i) => i.offer && i.available).slice(0, 3);
  if (offers.length === 0) return null;

  return (
    <section aria-labelledby="offers-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-content px-4">
        <SectionHeader id="offers-title" eyebrow={copy.home.offersEyebrow} title={copy.home.offersTitle} intro={copy.home.offersIntro}>
          <Link href={`/${locale}/offers`} className="btn-ghost">
            {copy.home.offersCta}
            <ArrowIcon />
          </Link>
        </SectionHeader>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {offers.map((item, index) => {
            const price = fromPrice(item);
            return (
              <li key={item.id} data-reveal style={revealDelay(index)}>
                <Link
                  href={`/${locale}/menu/${item.id}`}
                  className="group flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft ring-1 ring-line/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="w-28 shrink-0 overflow-hidden rounded-2xl">
                    <DishImage
                      image={item.image}
                      locale={locale}
                      pendingLabel=""
                      frame="relative aspect-square overflow-hidden"
                      sizes="112px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-leaf">{item.offer?.label?.[locale] || copy.product.offer}</p>
                    <p className="truncate font-display text-xl text-forest">{item.name[locale]}</p>
                    <PriceTag amount={price.amount} regular={price.regular} locale={locale} size="sm" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function OrderSteps({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const t = dictionaries[locale].delivery;
  return (
    <section aria-labelledby="steps-title" className="bg-forest py-20 text-white md:py-28">
      <div className="mx-auto max-w-content px-4">
        <SectionHeader id="steps-title" eyebrow={copy.home.stepsEyebrow} title={t.stepsTitle} tone="dark" />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {t.steps.map((step, index) => (
            <li key={index} data-reveal style={revealDelay(index, 120)} className="relative border-t border-white/15 pt-8">
              <span className="font-display text-6xl text-leaf/90">{`0${index + 1}`}</span>
              <p className="mt-4 text-lg text-white/85">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ChatCta({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <section aria-labelledby="chat-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-content px-4">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] bg-night px-6 py-12 text-white md:px-14 md:py-16"
        >
          <div aria-hidden="true" className="absolute -bottom-24 -end-16 size-80 rounded-full bg-leaf/25 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow mb-4">{copy.home.chatEyebrow}</p>
              <h2 id="chat-title" className="font-display text-3xl md:text-5xl">{copy.home.chatTitle}</h2>
              <p className="mt-4 text-lg text-white/75">{copy.home.chatIntro}</p>
            </div>
            <div className="space-y-3">
              {copy.chat.replies.map((reply) => (
                <a
                  key={reply.label}
                  href={whatsappLink(reply.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-bold transition-colors hover:border-leaf hover:bg-leaf hover:text-night"
                >
                  {reply.label}
                  <ChatIcon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
