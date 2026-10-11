"use client";

import { Price } from "@/components/ui/Price";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { useCart } from "./CartProvider";

export function OrderTotals({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].cart;
  const { totals, fulfillment } = useCart();

  return (
    <dl className="space-y-1 text-sm" aria-live="polite">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">{t.subtotal}</dt>
        <dd className="font-medium">
          <Price amount={totals.subtotal} locale={locale} />
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted">
          {fulfillment === "delivery" ? t.deliveryFee : t.pickupFee}
        </dt>
        <dd className="font-medium">
          {totals.fee === 0 ? t.free : <Price amount={totals.fee} locale={locale} />}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-line pt-2 text-base">
        <dt className="font-bold text-forest">{t.total}</dt>
        <dd className="font-bold text-forest">
          <Price amount={totals.total} locale={locale} />
        </dd>
      </div>
    </dl>
  );
}
