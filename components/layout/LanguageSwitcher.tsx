"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { dictionaries } from "@/lib/dictionaries";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const target: Locale = locale === "ar" ? "en" : "ar";
  const { label, target: srLabel } = dictionaries[locale].languageSwitcher;
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  // Keep the visitor on the same section when switching language.
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const href =
    pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${target}`) + hash;

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={srLabel}
      className={`inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-forest transition-colors hover:border-leaf hover:text-leaf ${
        target === "ar" ? "font-arabic" : "font-latin"
      }`}
    >
      {label}
    </Link>
  );
}
