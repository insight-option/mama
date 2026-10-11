import type { Metadata } from "next";
import { restaurant, siteUrl } from "@/config/restaurant";
import { locales, type Locale } from "@/lib/i18n";

const copy: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: `${restaurant.brandName} | أكل بيتي في قطر`,
    description:
      "تصفّح قائمة ماما فود: طبخات ماما، أطباق صحية، سلطات طازجة وباستا، واطلب مباشرة عبر واتساب للتوصيل أو الاستلام.",
  },
  en: {
    title: `${restaurant.brandName} | Home-style food in Qatar`,
    description:
      "Browse the Mama Food menu: Mama's specials, healthy meals, fresh salads and pasta. Order directly on WhatsApp for delivery or pickup.",
  },
};

export function buildMetadata(locale: Locale): Metadata {
  const { title, description } = copy[locale];

  const metadata: Metadata = {
    title,
    description,
    applicationName: restaurant.brandName,
    openGraph: {
      title,
      description,
      siteName: restaurant.brandName,
      locale: locale === "ar" ? "ar_QA" : "en_QA",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };

  if (siteUrl) {
    metadata.metadataBase = new URL(siteUrl);
    metadata.alternates = {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    };
    metadata.openGraph = { ...metadata.openGraph, url: `/${locale}` };
  }

  return metadata;
}
