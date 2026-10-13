import type { Metadata } from "next";
import { restaurant, siteUrl } from "@/config/restaurant";
import type { Locale } from "@/lib/i18n";

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
    // Inner pages set their own title, shown as "Page | brand".
    title: { default: title, template: `%s | ${restaurant.brandName}` },
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

  // Lets pages use relative URLs for share images (e.g. /api/img/<id>).
  // Page-specific URLs (canonical, og:url) are not set here: this metadata
  // is inherited by every page of the language.
  if (siteUrl) metadata.metadataBase = new URL(siteUrl);

  return metadata;
}
