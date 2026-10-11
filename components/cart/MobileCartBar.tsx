"use client";

import { Price } from "@/components/ui/Price";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { useCart } from "./CartProvider";

/** Bottom bar on small screens once the cart has items. */
export function MobileCartBar({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].cart;
  const { ready, totals, open, isOpen } = useCart();

  if (!ready || totals.itemCount === 0 || isOpen) return null;

  return (
    <>
      {/* Spacer so the bar never covers the end of the page. */}
      <div aria-hidden="true" className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-forest px-5 font-bold text-white"
        >
          <span>{t.viewCart}</span>
          <span className="text-sm font-medium text-white/80">
            {t.itemCount(totals.itemCount)}
          </span>
          <Price amount={totals.subtotal} locale={locale} />
        </button>
      </div>
    </>
  );
}
