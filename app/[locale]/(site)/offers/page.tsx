import type { Metadata } from "next";
import Link from "next/link";
import { DishCard } from "@/components/menu/DishCard";
import { PageHeader } from "@/components/site/SectionHeader";
import { ArrowIcon, TagIcon } from "@/components/ui/icons";
import { revealDelay } from "@/components/ui/reveal-delay";
import { getCatalog } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export const revalidate = 30;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const copy = siteCopy[params.locale].offersPage;
  return { title: copy.title, description: copy.intro };
}

export default async function OffersPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const copy = siteCopy[locale].offersPage;
  const { items } = await getCatalog();
  const offers = items.filter((item) => item.offer && item.available);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section aria-label={copy.title} className="mx-auto max-w-content px-4 py-16 md:py-24">
        {offers.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {offers.map((item, index) => (
              <li key={item.id} data-reveal style={revealDelay(index % 3)} className="flex">
                <DishCard item={item} locale={locale} priority={index < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal className="mx-auto max-w-lg rounded-card bg-surface p-10 text-center shadow-soft ring-1 ring-line/70">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream text-forest">
              <TagIcon className="size-6" />
            </span>
            <p className="mt-5 text-lg text-ink">{copy.empty}</p>
            <Link href={`/${locale}/menu`} className="btn-primary mt-6">
              {copy.emptyCta}
              <ArrowIcon />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
