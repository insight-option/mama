import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * Shown after WhatsApp opens. The order is not confirmed at this point:
 * the customer still has to send the message and the restaurant confirms.
 */
export function OrderSent({
  locale,
  whatsappUrl,
  onBackToCart,
}: {
  locale: Locale;
  whatsappUrl: string;
  onBackToCart: () => void;
}) {
  const t = dictionaries[locale].checkout;

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 p-6 text-center">
      <p className="text-ink">{t.sentBody}</p>
      <p className="text-sm text-muted">{t.sentConfirmNote}</p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto inline-flex min-h-12 items-center rounded-full bg-forest px-6 font-bold text-white hover:bg-forest/90"
      >
        {t.openAgain}
      </a>
      <button
        type="button"
        onClick={onBackToCart}
        className="mx-auto inline-flex min-h-11 items-center px-4 text-sm font-medium text-forest underline underline-offset-4"
      >
        {t.backToCart}
      </button>
    </div>
  );
}
