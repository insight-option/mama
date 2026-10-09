import { ESTIMATOR_CONFIG, FX_MAX_AGE_DAYS, FX_RATES, type FxRate } from "@/config/pricing";
import type { Currency, Locale } from "@/features/estimator/types";
import { toMajor } from "@/lib/money";

const DAY_MS = 86_400_000;

function intlLocale(locale: Locale): string {
  return locale === "ar" ? `ar-QA-u-nu-${ESTIMATOR_CONFIG.arabicNumberingSystem}` : "en-QA";
}

export function isRateStale(rate: FxRate, now: Date = new Date(), maxAgeDays = FX_MAX_AGE_DAYS): boolean {
  if (rate.quote === "QAR") return false;
  const asOf = Date.parse(rate.asOf);
  if (Number.isNaN(asOf)) return true;
  return now.getTime() - asOf > maxAgeDays * DAY_MS;
}

/**
 * The currency actually used for display. A stale rate falls back to QAR
 * rather than silently converting with outdated data.
 */
export function resolveDisplayCurrency(requested: Currency, now: Date = new Date()): { currency: Currency; stale: boolean } {
  const rate = FX_RATES[requested];
  if (isRateStale(rate, now)) return { currency: "QAR", stale: true };
  return { currency: requested, stale: false };
}

/** Converts canonical QAR minor units into major units of the display currency. */
export function convertFromQarMinor(amountQarMinor: number, currency: Currency): number {
  return toMajor(amountQarMinor) * FX_RATES[currency].rate;
}

/** Formats canonical QAR minor units for display. Never use the result as a price source of truth. */
export function formatMoney(amountQarMinor: number, currency: Currency, locale: Locale): string {
  const value = convertFromQarMinor(amountQarMinor, currency);
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

/** Formats whole QAR from config (e.g. unit prices) in the display currency. */
export function formatQar(amountQar: number, currency: Currency, locale: Locale): string {
  return formatMoney(Math.round(amountQar * 100), currency, locale);
}

export function formatNumber(value: number, locale: Locale, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "medium", timeZone: "Asia/Qatar" }).format(
    new Date(`${isoDate}T12:00:00+03:00`),
  );
}

export function formatRate(currency: Currency, locale: Locale): string {
  return formatNumber(FX_RATES[currency].rate, locale, { maximumFractionDigits: 4, minimumFractionDigits: 2 });
}
