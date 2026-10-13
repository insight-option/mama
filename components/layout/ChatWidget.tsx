"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n";
import { siteCopy, whatsappLink } from "@/lib/site-copy";

/**
 * Floating "chat with us" helper. Quick replies open WhatsApp with a ready
 * message; nothing is sent until the customer presses send in WhatsApp.
 */
export function ChatWidget({ locale }: { locale: Locale }) {
  const t = siteCopy[locale].chat;
  const { ready, totals, isOpen: cartOpen } = useCart();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (cartOpen) return null;
  // Sit above the mobile cart bar when it is showing.
  const lifted = ready && totals.itemCount > 0;

  return (
    <div
      className={`fixed end-4 z-30 flex flex-col items-end gap-3 transition-[bottom] duration-300 ${
        lifted ? "bottom-24 md:bottom-6" : "bottom-6"
      }`}
    >
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t.title}
          className="w-[min(20rem,calc(100vw-2rem))] origin-bottom animate-pop-in overflow-hidden rounded-3xl bg-surface shadow-lift ring-1 ring-line"
        >
          <div className="bg-forest px-5 py-4 text-white">
            <p className="font-display text-lg">{t.title}</p>
          </div>
          <div className="space-y-3 bg-ivory p-4">
            <p className="w-fit max-w-[85%] rounded-2xl rounded-ss-sm bg-surface px-4 py-3 text-sm text-ink shadow-soft">
              {t.greeting}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.replies.map((reply) => (
                <a
                  key={reply.label}
                  href={whatsappLink(reply.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-forest/20 bg-surface px-3 py-2 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                >
                  {reply.label}
                </a>
              ))}
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              <SendIcon className="size-4" />
              {t.start}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        className="flex size-14 items-center justify-center rounded-full bg-leaf text-night shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
      >
        {open ? <CloseIcon className="size-6" /> : <ChatIcon className="size-6" />}
      </button>
    </div>
  );
}
