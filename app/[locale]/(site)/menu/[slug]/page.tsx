import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DishCard } from "@/components/menu/DishCard";
import { DishImage } from "@/components/menu/DishImage";
import { ProductActions } from "@/components/menu/ProductActions";
import { ArrowIcon, TagIcon } from "@/components/ui/icons";
import { categories } from "@/data/menu";
import { getCatalog } from "@/lib/catalog";
import { dictionaries } from "@/lib/dictionaries";
import { locales, type Locale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export const revalidate = 30;
// Products added in the admin workspace get pages on first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const { items } = await getCatalog();
  return locales.flatMap((locale) => items.map((item) => ({ locale, slug: item.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { items } = await getCatalog();
  const item = items.find((i) => i.id === decodeURIComponent(params.slug));
  if (!item) return {};
  const description = item.ingredients?.[params.locale]?.join(params.locale === "ar" ? "، " : ", ");
  // The image route gives WhatsApp and social apps a public preview image.
  const image = item.image ? `/api/img/${encodeURIComponent(item.id)}` : undefined;
  return {
    title: item.name[params.locale],
    description,
    openGraph: { title: item.name[params.locale], description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale } = params;
  const { items } = await getCatalog();
  const item = items.find((i) => i.id === decodeURIComponent(params.slug));
  if (!item) notFound();

  const t = dictionaries[locale];
  const copy = siteCopy[locale].product;
  const category = categories.find((c) => c.id === item.category);
  const ingredients = item.ingredients?.[locale] ?? [];
  const related = items
    .filter((i) => i.category === item.category && i.id !== item.id && i.available)
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-content px-4 pb-16 pt-8 md:pt-12">
        <Link
          href={`/${locale}/menu`}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-forest"
        >
          <span className="rotate-180">
            <ArrowIcon />
          </span>
          {copy.back}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-fade-up overflow-hidden rounded-[2rem] shadow-lift">
            <div className="relative">
              <DishImage
                image={item.image}
                locale={locale}
                pendingLabel={t.menu.photoPending}
                priority
                frame="relative aspect-[4/3] overflow-hidden lg:aspect-[5/6]"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
              {item.offer && (
                <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-leaf px-4 py-2 text-sm font-extrabold text-night">
                  <TagIcon className="size-4" />
                  {item.offer.label?.[locale] || copy.offer}
                </span>
              )}
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms] lg:py-6">
            {category && <p className="eyebrow mb-4">{category.name[locale]}</p>}
            <h1 className="font-display text-4xl leading-tight text-forest md:text-6xl">{item.name[locale]}</h1>

            {ingredients.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-muted">{copy.ingredients}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient} className="rounded-full bg-cream px-4 py-1.5 text-sm text-ink">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!item.available && (
              <p className="mt-6 w-fit rounded-full bg-line px-4 py-1.5 text-sm font-bold">{t.menu.unavailable}</p>
            )}

            <div className="mt-8 border-t border-line pt-8">
              <ProductActions item={item} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-content px-4">
            <h2 id="related-title" className="font-display text-3xl text-forest md:text-4xl">
              {copy.related}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} data-reveal className="flex">
                  <DishCard item={r} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
