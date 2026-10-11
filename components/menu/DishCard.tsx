"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { MenuItem, ServingId } from "@/types/menu";
import { DishImage } from "./DishImage";
import { ServingSelector } from "./ServingSelector";

/**
 * Card order: photo, name, ingredients, then either the fixed price or the
 * serving options (each showing its own price), then add to cart.
 */
export function DishCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = dictionaries[locale].menu;
  const tc = dictionaries[locale].cart;
  const { add } = useCart();
  const [serving, setServing] = useState<ServingId>("one");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleAdd = () => {
    add(item.id, item.pricing.type === "serving" ? serving : undefined);
    setJustAdded(true);
  };

  const { pricing } = item;

  const ingredients = item.ingredients?.[locale];
  const separator = locale === "ar" ? "، " : ", ";
  const titleId = `dish-${item.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(11_37_24/0.04)] transition-shadow hover:shadow-[0_8px_24px_rgb(11_37_24/0.08)]"
    >
      <DishImage
        image={item.image}
        locale={locale}
        pendingLabel={t.photoPending}
      />

      <div className="flex flex-1 flex-col p-4">
        <h4 id={titleId} className="text-lg font-extrabold leading-snug text-forest">
          {item.name[locale]}
        </h4>

        {ingredients && (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {ingredients.join(separator)}
          </p>
        )}

        {!item.available && (
          <p className="mt-2 w-fit rounded-full bg-line px-3 py-1 text-xs font-medium text-ink">
            {t.unavailable}
          </p>
        )}

        <div className="mt-auto space-y-3 pt-4">
          {pricing.type === "fixed" ? (
            <p>
              <Price
                amount={pricing.price}
                locale={locale}
                className="text-2xl font-extrabold text-ink"
                currencyClassName="text-base font-bold"
              />
            </p>
          ) : (
            <ServingSelector
              name={`serving-${item.id}`}
              legend={t.servingLegend}
              labels={t.serving}
              options={pricing.options}
              value={serving}
              onChange={setServing}
              locale={locale}
              disabled={!item.available}
            />
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!item.available}
            aria-label={`${tc.add}: ${item.name[locale]}`}
            className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 font-bold transition-colors disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${
              justAdded
                ? "bg-leaf text-forest"
                : "bg-forest text-white hover:bg-forest/90"
            }`}
          >
            {justAdded ? <CheckIcon /> : <PlusIcon />}
            {justAdded ? tc.added : tc.add}
          </button>
          <span role="status" className="sr-only">
            {justAdded ? tc.addedAnnouncement : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
