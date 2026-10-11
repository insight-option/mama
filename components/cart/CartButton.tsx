"use client";

import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { useCart } from "./CartProvider";

export function CartButton({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].cart;
  const { ready, totals, open } = useCart();
  const count = ready ? totals.itemCount : 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      aria-label={
        count > 0
          ? `${t.open}${locale === "ar" ? "، " : ", "}${t.itemCount(count)}`
          : t.open
      }
      className="relative inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-4 text-sm font-bold text-white transition-colors hover:bg-forest/90"
    >
      <BagIcon />
      <span>{t.label}</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="flex min-w-5 items-center justify-center rounded-full bg-leaf px-1.5 font-latin text-xs font-bold leading-5 text-forest"
        >
          {count}
        </span>
      )}
    </button>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
