import Link from "next/link";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Icon } from "@/components/common/Icon";
import { LEGAL_UPDATED, type LegalDoc } from "@/content/legal";
import type { Locale } from "@/features/estimator/types";
import type { Translate } from "@/i18n";
import { formatDate } from "@/lib/formatCurrency";

export function LegalPage({ doc, locale, t }: { doc: LegalDoc; locale: Locale; t: Translate }) {
  return (
    <>
      <Header />
      <main id="main" className="container-page max-w-3xl pb-20 pt-32">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline">
          <Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />
          {t("legal.backHome")}
        </Link>
        <h1 className="mt-6 text-4xl font-black text-offwhite">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted">{t("legal.updated", { date: formatDate(LEGAL_UPDATED, locale) })}</p>
        <p className="mt-6 rounded-xl border border-warn/30 bg-warn/10 p-4 text-sm font-semibold text-warn">{t("legal.draftNotice")}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink">{doc.intro}</p>
        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-extrabold text-offwhite">{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
