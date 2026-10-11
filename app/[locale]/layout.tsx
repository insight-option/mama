import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { MobileCartBar } from "@/components/cart/MobileCartBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
      className={`${tajawal.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
        >
          {dictionaries[locale].skipToContent}
        </a>
        <CartProvider>
          <SiteHeader locale={locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} />
          <MobileCartBar locale={locale} />
          <CartDrawer locale={locale} />
        </CartProvider>
      </body>
    </html>
  );
}
