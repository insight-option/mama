"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/cart/CartButton";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageIds, pagePath, siteCopy } from "@/lib/site-copy";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = siteCopy[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-ivory transition-shadow duration-300 ${
        scrolled ? "border-line shadow-soft" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-content items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} className="shrink-0 rounded-md">
          <Logo alt={dictionaries[locale].logo.homeAlt} className="h-12" priority />
        </Link>

        <nav aria-label={dictionaries[locale].primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {pageIds.map((id) => {
              const href = pagePath(locale, id);
              const active = isActive(href);
              return (
                <li key={id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold transition-colors ${
                      active ? "text-forest" : "text-ink/70 hover:text-forest"
                    }`}
                  >
                    {t.pages[id]}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-1.5 h-0.5 rounded-full bg-leaf transition-transform duration-300 ease-out ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <CartButton locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.mobileMenu.close : t.mobileMenu.open}
            className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-forest lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={dictionaries[locale].primaryNav}
          className="animate-pop-in border-t border-line bg-ivory px-4 pb-6 pt-2 lg:hidden"
        >
          <ul className="mx-auto max-w-content divide-y divide-line">
            {pageIds.map((id) => {
              const href = pagePath(locale, id);
              const active = isActive(href);
              return (
                <li key={id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between font-display text-xl ${
                      active ? "text-leaf" : "text-forest"
                    }`}
                  >
                    {t.pages[id]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
