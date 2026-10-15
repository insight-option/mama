import type { Metadata } from "next";
import { MenuSection } from "@/components/menu/MenuSection";
import { PageHeader } from "@/components/site/SectionHeader";
import { getCatalog } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export const revalidate = 30;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const copy = siteCopy[params.locale].menuPage;
  return { title: copy.title, description: copy.intro };
}

export default async function MenuPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const copy = siteCopy[locale].menuPage;
  const { items } = await getCatalog();

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <section aria-label={copy.title} className="mx-auto max-w-content px-4 pb-24">
        <MenuSection locale={locale} items={items} />
      </section>
    </>
  );
}
