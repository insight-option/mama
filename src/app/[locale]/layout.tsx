import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/components/common/I18nProvider";
import { SITE_CONFIG } from "@/config/site";
import { LOCALES } from "@/features/estimator/types";
import { createTranslator, getDictionary, getDirection, isLocale } from "@/i18n";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700", "800"], variable: "--font-tajawal", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0A0D14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = createTranslator(getDictionary(locale));
  return {
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    title: t("meta.title"),
    description: t("meta.description"),
    applicationName: "FONTAINE Smart Growth AI",
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: "FONTAINE",
      title: t("meta.title"),
      description: t("meta.description"),
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_QA" : "en_QA",
      alternateLocale: locale === "ar" ? "en_QA" : "ar_QA",
      images: [{ url: "/media/og-image.jpg", width: 1200, height: 630, alt: t("meta.ogAlt") }],
    },
    twitter: { card: "summary_large_image", title: t("meta.title"), description: t("meta.description"), images: ["/media/og-image.jpg"] },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const t = createTranslator(dictionary);

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${inter.variable} ${tajawal.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <a
          href="#main"
          className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-full bg-cyan px-5 py-3 font-bold text-navy transition focus:translate-y-0"
        >
          {t("nav.skip")}
        </a>
        <I18nProvider locale={locale} dictionary={dictionary}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
