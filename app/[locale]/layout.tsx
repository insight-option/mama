import type { Metadata, Viewport } from "next";
import { El_Messiri, Fraunces, Inter, Tajawal } from "next/font/google";
import { LocalMockBanner } from "@/components/local-mock/LocalMockBanner";
import { dictionaries } from "@/lib/dictionaries";
import { getDirection, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display faces for headings only.
const messiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["600", "700"],
  variable: "--font-messiri",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

// Only /ar and /en exist; any other first segment returns 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return buildMetadata(params.locale);
}

export const viewport: Viewport = {
  themeColor: "#0B2518",
  width: "device-width",
  initialScale: 1,
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${tajawal.variable} ${inter.variable} ${messiri.variable} ${fraunces.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
        >
          {dictionaries[locale].skipToContent}
        </a>
        {children}
        <LocalMockBanner locale={locale} />
      </body>
    </html>
  );
}
