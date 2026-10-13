"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, PlusIcon, TagIcon } from "@/components/ui/icons";
import { PriceTag } from "@/components/ui/PriceTag";
import { effectivePriceFor } from "@/lib/cart";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";
import type { MenuItem, ServingId } from "@/types/menu";
import { DishImage } from "./DishImage";
import { ServingSelector } from "./ServingSelector";

/**
 * Card order: photo, name, ingredients, then either the price or the
 * serving options (each with its own price), then add to cart. The photo
 * and name link to the dish page.
 */
export function DishCard({
  item,
  locale,
  priority,
}: {
  item: MenuItem;
  locale: Locale;
  priority?: boolean;
}) {
  const t = dictionaries[locale].menu;
  const tc = dictionaries[locale].cart;
  const copy = siteCopy[locale].product;
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
  const href = `/${locale}/menu/${item.id}`;
  const ingredients = item.ingredients?.[locale];
  const separator = locale === "ar" ? "، " : ", ";
  const titleId = `dish-${item.id}`;
  const offerLabel = item.offer?.label?.[locale] || copy.offer;

  const offerPrices =
    pricing.type === "serving" && item.offer
      ? {
          one: effectivePriceFor(item, "one") ?? undefined,
          two: effectivePriceFor(item, "two") ?? undefined,
        }
      : undefined;

  return (
    <article
      aria-labelledby={titleId}
      className="group flex w-full flex-col overflow-hidden rounded-card bg-surface shadow-soft ring-1 ring-line/70 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lift"
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block">
        <DishImage
          image={item.image}
          locale={locale}
          pendingLabel={t.photoPending}
          priority={priority}
        />
        {item.offer && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-leaf px-3 py-1.5 text-xs font-extrabold text-night shadow-soft">
            <TagIcon className="size-3.5" />
            {offerLabel}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 id={titleId} className="font-display text-xl leading-snug text-forest">
          <Link href={href} className="hover:text-leaf">
            {item.name[locale]}
          </Link>
        </h3>

        {ingredients && ingredients.length > 0 && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {ingredients.join(separator)}
          </p>
        )}

        {!item.available && (
          <p className="mt-2 w-fit rounded-full bg-line px-3 py-1 text-xs font-medium text-ink">
            {t.unavailable}
          </p>
        )}

        <div className="mt-auto space-y-3 pt-5">
          {pricing.type === "fixed" ? (
            <p>
              <PriceTag
                amount={effectivePriceFor(item) ?? pricing.price}
                regular={pricing.price}
                locale={locale}
                regularLabel={copy.regularPrice}
              />
            </p>
          ) : (
            <ServingSelector
              name={`serving-${item.id}`}
              legend={t.servingLegend}
              labels={t.serving}
              options={pricing.options}
              offerPrices={offerPrices}
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
            className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${
              justAdded
                ? "bg-leaf text-night"
                : "bg-forest text-white hover:bg-night"
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
