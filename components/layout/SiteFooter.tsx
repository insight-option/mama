import { restaurant } from "@/config/restaurant";
import type { Locale } from "@/lib/i18n";
import { dictionaries, sectionIds } from "@/lib/dictionaries";
import { Wordmark } from "./Wordmark";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  const slogan = restaurant.slogan[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-white/80">
      <div className="mx-auto grid max-w-content gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-2">
          <Wordmark tone="light" />
          {slogan && <p className="font-bold text-leaf">{slogan}</p>}
        </div>

        <nav aria-label={t.footer.navLabel}>
          <ul className="space-y-1">
            {sectionIds.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-11 items-center hover:text-white"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-1">
          <p className="text-sm text-white/60">{t.contact.whatsappLabel}</p>
          <a
            href={`https://wa.me/${restaurant.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex min-h-11 items-center font-latin text-lg font-medium text-white hover:text-leaf"
          >
            {restaurant.whatsapp.display}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-content px-4 py-4 text-sm text-white/60">
          © {year} <span dir="ltr">{restaurant.brandName}</span>. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
