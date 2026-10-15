import { toWesternDigits } from "@/lib/checkout";

/**
 * Digits, then optionally one decimal separator and at most 2 decimals (QAR
 * has 2). "." "," "٫" (Arabic decimal point) and "،" (Arabic comma) all work
 * as the separator. Anything else is refused rather than guessed: "1,000"
 * could mean one thousand or 1.0, and "1e3" or "0x10" are not prices.
 */
const AMOUNT = /^(\d+)(?:[.,٫،](\d{0,2}))?$/;

/**
 * Number typed in an admin field, in Western (0-9), Arabic-Indic (٠-٩) or
 * Persian (۰-۹) digits, e.g. "٨٢٫٥" → 82.5. Empty → null; anything that is
 * not a plain amount → NaN, which the form shows as an error.
 */
export function parseLocalizedNumber(value: string): number | null {
  const text = toWesternDigits(value).trim();
  if (text === "") return null;
  const match = AMOUNT.exec(text);
  return match ? Number(`${match[1]}.${match[2] || "0"}`) : NaN;
}
