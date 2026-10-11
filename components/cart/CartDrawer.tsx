"use client";

import { useEffect, useRef, useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSent } from "@/components/checkout/OrderSent";
import { Price } from "@/components/ui/Price";
import { emptyCheckoutForm, type CheckoutForm as CheckoutValues } from "@/lib/checkout";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { useCart } from "./CartProvider";
import { FulfillmentPicker } from "./FulfillmentPicker";
import { OrderTotals } from "./OrderTotals";
import { QuantityStepper } from "./QuantityStepper";

type View = "cart" | "checkout" | "sent";

export function CartDrawer({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].cart;
  const tc = dictionaries[locale].checkout;
  const servingLabels = dictionaries[locale].menu.serving;
  const { lines, isOpen, close, setQuantity, remove } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [view, setView] = useState<View>("cart");
  // Kept in memory only (never stored) so details survive moving between
  // steps but are not saved in the browser.
  const [form, setForm] = useState<CheckoutValues>(emptyCheckoutForm);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // The native modal dialog provides the focus trap, Escape to close and an
  // inert page behind it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // An empty cart cannot be checked out.
  useEffect(() => {
    if (view === "checkout" && lines.length === 0) setView("cart");
  }, [view, lines.length]);

  const goTo = (next: View) => {
    setView(next);
    // Move focus to the new step's heading.
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    if (view === "sent") setView("cart");
    close();
  };

  const handleRemove = (key: string) => {
    remove(key);
    // The removed row held focus; keep focus inside the dialog.
    titleRef.current?.focus();
  };

  const title =
    view === "checkout" ? tc.title : view === "sent" ? tc.sentTitle : t.title;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-title"
      onClose={handleClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      className="m-0 ms-auto h-dvh max-h-none w-full max-w-md bg-ivory p-0 text-ink backdrop:bg-forest/50"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-line bg-surface px-4 py-3">
          <div className="flex min-w-0 items-center gap-1">
            {view === "checkout" && (
              <button
                type="button"
                onClick={() => goTo("cart")}
                aria-label={tc.back}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl text-forest hover:bg-forest/5"
              >
                {/* Arrow points back in the reading direction. */}
                <span aria-hidden="true" className="rtl:-scale-x-100">
                  ←
                </span>
              </button>
            )}
            <h2
              id="cart-title"
              ref={titleRef}
              tabIndex={-1}
              className="truncate text-xl font-bold text-forest focus:outline-none"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t.close}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-2xl text-forest hover:bg-forest/5"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {view === "sent" ? (
          <OrderSent
            locale={locale}
            whatsappUrl={whatsappUrl}
            onBackToCart={() => goTo("cart")}
          />
        ) : view === "checkout" ? (
          <CheckoutForm
            locale={locale}
            values={form}
            onValuesChange={setForm}
            onSent={(url) => {
              setWhatsappUrl(url);
              goTo("sent");
            }}
          />
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-lg text-muted">{t.empty}</p>
            <a
              href="#menu"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-11 items-center rounded-full bg-forest px-6 font-bold text-white hover:bg-forest/90"
            >
              {t.browseMenu}
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-4">
              {lines.map((line) => {
                const name = line.item.name[locale];
                return (
                  <li key={line.key} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-forest">{name}</p>
                        {line.servingId && (
                          <p className="text-sm text-muted">
                            {t.serving}: {servingLabels[line.servingId]}
                          </p>
                        )}
                        <p className="flex items-center gap-1.5 text-sm text-muted">
                          <Price amount={line.unitPrice} locale={locale} />
                          <span>{t.each}</span>
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-ink">
                        <Price amount={line.lineTotal} locale={locale} />
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(q) => setQuantity(line.key, q)}
                        labels={t}
                        itemName={name}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(line.key)}
                        aria-label={`${t.remove}: ${name}`}
                        className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted underline underline-offset-4 hover:text-forest"
                      >
                        {t.remove}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-4 border-t border-line bg-surface p-4">
              <FulfillmentPicker locale={locale} name="fulfillment-cart" />
              <OrderTotals locale={locale} />
              <button
                type="button"
                onClick={() => goTo("checkout")}
                className="min-h-12 w-full rounded-full bg-forest px-5 font-bold text-white hover:bg-forest/90"
              >
                {tc.proceed}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
