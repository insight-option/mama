"use client";

import Link from "next/link";
import { FontaineLogo } from "@/components/brand/FontaineLogo";
import { useI18n } from "@/components/common/I18nProvider";

export default function NotFound() {
  const { t, locale } = useI18n();
  return (
    <main id="main" className="grid min-h-screen place-items-center px-4 text-center">
      <div className="max-w-md">
        <FontaineLogo id="logo-404" />
        <p className="mt-10 text-6xl font-black text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-offwhite">{t("notFound.title")}</h1>
        <p className="mt-3 text-muted">{t("notFound.body")}</p>
        <Link href={`/${locale}`} className="btn btn-primary mt-8">
          {t("notFound.cta")}
        </Link>
      </div>
    </main>
  );
}
