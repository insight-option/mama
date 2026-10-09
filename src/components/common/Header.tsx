"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontaineLogo } from "@/components/brand/FontaineLogo";
import { dispatch, useEstimatorState } from "@/features/estimator/store";
import { CURRENCIES, type Currency } from "@/features/estimator/types";
import { Icon } from "./Icon";
import { useI18n } from "./I18nProvider";

const NAV = [
  { href: "#estimator", key: "nav.estimator" },
  { href: "#services", key: "nav.services" },
  { href: "#showcase", key: "nav.showcase" },
  { href: "#method", key: "nav.method" },
  { href: "#faq", key: "nav.faq" },
] as const;

function CurrencySelect({ id }: { id: string }) {
  const { t } = useI18n();
  const { currency } = useEstimatorState();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {t("nav.currency")}
      </label>
      <select
        id={id}
        className="field !min-h-10 !rounded-full !py-1.5 !text-sm font-semibold"
        value={currency}
        onChange={(e) => dispatch({ type: "setCurrency", currency: e.target.value as Currency })}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {t(`currency.short.${c}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Switches /ar ⇄ /en without a reload; estimator state lives in a shared store so nothing resets. */
function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";
  const target = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`);

  return (
    <Link
      href={target}
      hrefLang={other}
      lang={other}
      scroll={false}
      onClick={(e) => {
        e.preventDefault();
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
        router.push(`${target}${window.location.hash}`, { scroll: false });
      }}
      aria-label={t("nav.switchToLabel")}
      className={`btn btn-ghost !min-h-10 text-sm ${compact ? "!px-3" : "!px-4"}`}
      data-testid="locale-switch"
    >
      <Icon name="globe" size={16} />
      {compact ? t("nav.switchToShort") : t("nav.switchTo")}
    </Link>
  );
}

export function Header() {
  const { t, locale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === `/${locale}`;
  const base = onHome ? "" : `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-line bg-navy/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label={t("app.homeLabel")} className="shrink-0">
          <FontaineLogo id="logo-header" compactDescriptor />
        </Link>

        <nav aria-label={t("nav.primary")} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={`${base}${item.href}`} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white/5 hover:text-offwhite">
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CurrencySelect id="currency-desktop" />
          <LocaleSwitcher />
          <a href={`${base}#estimator`} className="btn btn-primary !min-h-10 text-sm">
            {t("nav.start")}
          </a>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <span className="md:hidden">
            <LocaleSwitcher compact />
          </span>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line-strong text-offwhite"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-navy/95 backdrop-blur-xl xl:hidden">
          <nav aria-label={t("nav.primary")} className="container-page py-4">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={`${base}${item.href}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-ink hover:bg-white/5"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-4 md:hidden">
              <CurrencySelect id="currency-mobile" />
              <a href={`${base}#estimator`} onClick={() => setOpen(false)} className="btn btn-primary flex-1">
                {t("nav.start")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
