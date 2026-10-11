import { priceParts } from "@/lib/format-currency";
import type { Locale } from "@/lib/i18n";

/**
 * A price as two separate flex items: the number, isolated as LTR, and the
 * currency label. The flex row follows the page direction, so Arabic shows
 * the number on the right of "ر.ق" (read "28 ر.ق") and English shows
 * "QAR 28". The number never mixes with neighbouring Arabic text.
 */
export function Price({
  amount,
  locale,
  className = "",
  currencyClassName = "",
}: {
  amount: number;
  locale: Locale;
  className?: string;
  currencyClassName?: string;
}) {
  const { value, currency } = priceParts(amount, locale);
  const number = (
    <bdi dir="ltr" className="font-latin tabular-nums">
      {value}
    </bdi>
  );
  const label = <span className={currencyClassName}>{currency}</span>;

  return (
    <span className={`inline-flex items-baseline gap-1 whitespace-nowrap ${className}`}>
      {locale === "ar" ? (
        <>
          {number}
          {label}
        </>
      ) : (
        <>
          {label}
          {number}
        </>
      )}
    </span>
  );
}
