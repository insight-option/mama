import Link from "next/link";
import { FontaineLogo } from "@/components/brand/FontaineLogo";
import type { Translate } from "@/i18n";
import type { Locale } from "@/features/estimator/types";

export function Footer({ locale, t }: { locale: Locale; t: Translate }) {
  const year = new Date().getFullYear();
  const home = `/${locale}`;
  return (
    <footer className="border-t border-line bg-navy-2">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <FontaineLogo id="logo-footer" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink">{t("footer.tagline")}</p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">{t("footer.disclaimer")}</p>
        </div>
        <nav aria-label={t("footer.explore")}>
          <h2 className="text-sm font-bold text-offwhite">{t("footer.explore")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-muted">
            <li><a className="hover:text-cyan" href={`${home}#estimator`}>{t("nav.estimator")}</a></li>
            <li><a className="hover:text-cyan" href={`${home}#services`}>{t("nav.services")}</a></li>
            <li><a className="hover:text-cyan" href={`${home}#method`}>{t("nav.method")}</a></li>
            <li><a className="hover:text-cyan" href={`${home}#faq`}>{t("nav.faq")}</a></li>
          </ul>
        </nav>
        <nav aria-label={t("footer.legal")}>
          <h2 className="text-sm font-bold text-offwhite">{t("footer.legal")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-muted">
            <li><Link className="hover:text-cyan" href={`${home}/privacy`}>{t("legal.privacy")}</Link></li>
            <li><Link className="hover:text-cyan" href={`${home}/terms`}>{t("legal.terms")}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">{t("footer.rights", { year })}</p>
      </div>
    </footer>
  );
}
