import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import type { Locale } from "@/lib/i18n";
import { dictionaries, sectionIds } from "@/lib/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} className="shrink-0 rounded-md">
          <Logo alt={t.logo.homeAlt} className="h-11" priority />
        </Link>

        {/* Small screens rely on the sticky category bar and footer links
            instead of a second header row, keeping the menu close to the top. */}
        <nav aria-label={t.primaryNav} className="hidden md:block">
          <NavLinks locale={locale} />
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <CartButton locale={locale} />
        </div>
      </div>
    </header>
  );
}

function NavLinks({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];

  return (
    <ul className="flex items-center gap-1 whitespace-nowrap">
      {sectionIds.map((id) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-forest/5 hover:text-forest"
          >
            {t.nav[id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
