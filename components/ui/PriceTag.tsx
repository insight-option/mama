import type { Locale } from "@/lib/i18n";
import { Price } from "./Price";

/**
 * Current price, with the regular price struck through while an offer is
 * active. Both prices use the bidi-safe <Price>.
 */
export function PriceTag({
  amount,
  regular,
  locale,
  size = "md",
  regularLabel,
}: {
  amount: number;
  /** Regular price; shown struck through when higher than `amount`. */
  regular?: number;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  /** Accessible label for the struck-through price. */
  regularLabel?: string;
}) {
  const onOffer = typeof regular === "number" && regular > amount;
  const main =
    size === "lg"
      ? "text-4xl font-extrabold"
      : size === "md"
        ? "text-2xl font-extrabold"
        : "text-base font-bold";

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <Price
        amount={amount}
        locale={locale}
        className={`${main} ${onOffer ? "text-leaf" : "text-ink"}`}
        currencyClassName={size === "sm" ? "" : "text-sm font-bold"}
      />
      {onOffer && (
        <s className="text-sm text-muted decoration-muted/60">
          {regularLabel && <span className="sr-only">{regularLabel}: </span>}
          <Price amount={regular} locale={locale} />
        </s>
      )}
    </span>
  );
}
