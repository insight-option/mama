"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ChatIcon, CheckIcon, PlusIcon } from "@/components/ui/icons";
import { PriceTag } from "@/components/ui/PriceTag";
import { effectivePriceFor } from "@/lib/cart";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy, whatsappLink } from "@/lib/site-copy";
import type { MenuItem, ServingId } from "@/types/menu";
import { ServingSelector } from "./ServingSelector";

/** Serving choice, add to cart and "ask on WhatsApp" for the dish page. */
export function ProductActions({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = dictionaries[locale];
  const copy = siteCopy[locale].product;
  const { add, open } = useCart();
  const [serving, setServing] = useState<ServingId>("one");
  const [justAdded, setJustAdded] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const { pricing } = item;
  const askMessage = copy.askMessage(
    item.name[locale],
    `${origin}/api/img/${encodeURIComponent(item.id)}`,
    `${origin}/${locale}/menu/${encodeURIComponent(item.id)}`,
  );

  return (
    <div className="space-y-5">
      {pricing.type === "fixed" ? (
        <PriceTag
          amount={effectivePriceFor(item) ?? pricing.price}
          regular={pricing.price}
          locale={locale}
          size="lg"
          regularLabel={copy.regularPrice}
        />
      ) : (
        <ServingSelector
          name={`serving-page-${item.id}`}
          legend={t.menu.servingLegend}
          labels={t.menu.serving}
          options={pricing.options}
          offerPrices={
            item.offer
              ? {
                  one: effectivePriceFor(item, "one") ?? undefined,
                  two: effectivePriceFor(item, "two") ?? undefined,
                }
              : undefined
          }
          value={serving}
          onChange={setServing}
          locale={locale}
          disabled={!item.available}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!item.available}
          onClick={() => {
            add(item.id, pricing.type === "serving" ? serving : undefined);
            setJustAdded(true);
          }}
          className={`btn min-h-14 flex-1 text-base ${
            justAdded ? "bg-leaf text-night" : "bg-forest text-white hover:bg-night"
          } disabled:cursor-not-allowed disabled:bg-line disabled:text-muted`}
        >
          {justAdded ? <CheckIcon /> : <PlusIcon />}
          {justAdded ? t.cart.added : t.cart.add}
        </button>
        {justAdded && (
          <button type="button" onClick={open} className="btn-ghost min-h-14 animate-pop-in">
            {t.cart.viewCart}
          </button>
        )}
      </div>
      <span role="status" className="sr-only">
        {justAdded ? t.cart.addedAnnouncement : ""}
      </span>

      <a
        href={whatsappLink(askMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-forest underline-offset-4 hover:text-leaf hover:underline"
      >
        <ChatIcon className="size-5" />
        {copy.ask}
      </a>
    </div>
  );
}
