import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { MobileCartBar } from "@/components/cart/MobileCartBar";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { RevealObserver } from "@/components/ui/Reveal";
import { getCatalog } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

export const revalidate = 30;

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { items } = await getCatalog();

  return (
    <CartProvider products={items}>
      <UtilityBar locale={locale} />
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <MobileCartBar locale={locale} />
      <ChatWidget locale={locale} />
      <CartDrawer locale={locale} />
      <RevealObserver />
    </CartProvider>
  );
}
