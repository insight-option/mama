"use client";

import { Price } from "@/components/ui/Price";
import { feeFor, type Fulfillment } from "@/lib/cart";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { useCart } from "./CartProvider";

const options: Fulfillment[] = ["delivery", "pickup"];

export function FulfillmentPicker({
  locale,
  name,
}: {
  locale: Locale;
  /** Radio group name; must be unique on the page. */
  name: string;
}) {
  const t = dictionaries[locale].cart;
  const { fulfillment, setFulfillment } = useCart();

  const feeLabel = (option: Fulfillment) => {
    const fee = feeFor(option);
    return fee === 0 ? t.free : <Price amount={fee} locale={locale} />;
  };

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-muted">
        {t.fulfillmentLegend}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={fulfillment === option}
              onChange={() => setFulfillment(option)}
              className="peer sr-only"
            />
            <span className="flex min-h-11 flex-col items-center justify-center rounded-xl border border-line bg-surface px-2 py-1.5 text-center text-sm leading-tight transition-colors peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf">
              <span className="font-bold">
                {option === "delivery" ? t.delivery : t.pickup}
              </span>
              <span>{feeLabel(option)}</span>
            </span>
          </label>
        ))}
      </div>
      {fulfillment === "pickup" && (
        <p className="mt-2 rounded-xl bg-leaf/10 px-3 py-2 text-sm text-forest">
          {t.pickupNote}
        </p>
      )}
    </fieldset>
  );
}
