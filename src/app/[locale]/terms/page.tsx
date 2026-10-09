import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/common/LegalPage";
import { TERMS } from "@/content/legal";
import { createTranslator, getDictionary, isLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${TERMS[locale].title} | FONTAINE`,
    alternates: { canonical: `/${locale}/terms`, languages: { ar: "/ar/terms", en: "/en/terms" } },
  };
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalPage doc={TERMS[locale]} locale={locale} t={createTranslator(getDictionary(locale))} />;
}
