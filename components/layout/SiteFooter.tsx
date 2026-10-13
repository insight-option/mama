import Link from "next/link";
import { restaurant } from "@/config/restaurant";
import { menuPdfPath } from "@/data/menu";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageIds, pagePath, siteCopy } from "@/lib/site-copy";
import { Wordmark } from "./Wordmark";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  const copy = siteCopy[locale];
  const slogan = restaurant.slogan[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-white/70">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Wordmark tone="light" />
          {slogan && <p className="font-display text-2xl text-leaf">{slogan}</p>}
          <p className="max-w-sm text-sm">{t.hero.intro}</p>
        </div>

        <nav aria-label={t.footer.navLabel}>
          <ul className="space-y-1">
            {pageIds.map((id) => (
              <li key={id}>
                <Link
                  href={pagePath(locale, id)}
                  className="inline-flex min-h-10 items-center transition-colors hover:text-white"
                >
                  {copy.pages[id]}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={menuPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center transition-colors hover:text-white"
              >
                {t.menu.pdfLink}
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-2">
          <p className="text-sm text-white/50">{t.contact.whatsappLabel}</p>
          <a
            href={`https://wa.me/${restaurant.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex min-h-11 items-center font-latin text-xl font-bold text-white transition-colors hover:text-leaf"
          >
            {restaurant.whatsapp.display}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-content px-4 py-5 text-sm text-white/50">
          © {year} <span dir="ltr">{restaurant.brandName}</span>. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
