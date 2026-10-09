import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/common/LegalPage";
import { PRIVACY } from "@/content/legal";
import { createTranslator, getDictionary, isLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${PRIVACY[locale].title} | FONTAINE`,
    alternates: { canonical: `/${locale}/privacy`, languages: { ar: "/ar/privacy", en: "/en/privacy" } },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage doc={PRIVACY[locale]} locale={locale} t={createTranslator(getDictionary(locale))} />;
}
