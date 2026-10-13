import Link from "next/link";
import { LockIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

/**
 * Thin bar above the header. The row is forced LTR so the admin login sits
 * at the physical top-left in both languages; the text inside follows the
 * page language.
 */
export function UtilityBar({ locale }: { locale: Locale }) {
  const t = siteCopy[locale];
  const hero = dictionaries[locale].hero;

  return (
    <div className="bg-night text-xs text-white/75">
      <div dir="ltr" className="mx-auto flex h-10 max-w-content items-center justify-between gap-4 px-4">
        <Link
          href={`/${locale}/admin/login`}
          aria-label={t.login.aria}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 font-bold text-white transition-colors hover:text-leaf"
        >
          <LockIcon className="size-4" />
          <span lang={locale}>{t.login.label}</span>
        </Link>

        <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span>{hero.deliveryChip}</span>
            <Price amount={restaurant.fees.delivery} locale={locale} />
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-white/20" />
          <span>{hero.pickupChip}</span>
          <a
            href={`https://wa.me/${restaurant.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="hidden font-latin font-bold text-white transition-colors hover:text-leaf sm:inline"
          >
            {restaurant.whatsapp.display}
          </a>
        </div>
      </div>
    </div>
  );
}
