import type { ContactDetails, EstimatorState, Locale } from "@/features/estimator/types";
import type { PriceResult } from "@/features/pricing/calculate";
import { ESTIMATOR_CONFIG } from "@/config/pricing";
import type { Translate, TranslationKey } from "@/i18n";
import { formatMoney } from "@/lib/formatCurrency";

const TIMELINE_KEYS = { now: "lead.timelineNow", month: "lead.timelineMonth", later: "lead.timelineLater" } as const;

type BuildArgs = {
  state: EstimatorState;
  price: PriceResult;
  locale: Locale;
  t: Translate;
  reference: string;
  contact?: ContactDetails;
};

/**
 * Localized plan summary built from the same canonical price result the UI
 * shows. Amounts are always stated in QAR (the billing currency), with the
 * display-currency equivalent added when a different currency is selected.
 */
export function buildPlanMessage({ state, price, locale, t, reference, contact }: BuildArgs): string {
  const money = (minor: number) => {
    const qar = formatMoney(minor, "QAR", locale);
    return state.currency === "QAR" ? qar : `${qar} (≈ ${formatMoney(minor, state.currency, locale)})`;
  };
  const label = (key: TranslationKey | null) => (key ? t(key) : t("whatsapp.notSpecified"));

  const lines: string[] = [];
  lines.push(`*${t("whatsapp.heading")}*`);
  lines.push(`${t("whatsapp.reference")}: ${reference}`);
  lines.push(`${t("whatsapp.pricing")}: ${price.configVersion} (${ESTIMATOR_CONFIG.effectiveDate})`);
  lines.push("");

  lines.push(`*${t("whatsapp.business")}*`);
  lines.push(`• ${t("whatsapp.industry")}: ${label(state.industry ? `industry.${state.industry}` : null)}`);
  lines.push(`• ${t("whatsapp.objective")}: ${label(state.objective ? `objective.${state.objective}` : null)}`);
  lines.push(`• ${t("whatsapp.market")}: ${t(`market.${state.market}`)}`);
  lines.push(`• ${t("whatsapp.channel")}: ${label(state.channel ? `channel.${state.channel}` : null)}`);
  lines.push("");

  lines.push(`*${t("whatsapp.services")}*`);
  const videoLine =
    state.videoQuantity > 0
      ? `${t("summary.videosLine", { count: state.videoQuantity, tier: t(`videos.${state.videoTier}`) })} = ${money(price.videoTotalQarMinor)}`
      : t("whatsapp.none");
  lines.push(`• ${t("whatsapp.videos")}: ${videoLine}`);
  lines.push(`• ${t("whatsapp.adBudget")}: ${price.mediaSpendQarMinor > 0 ? money(price.mediaSpendQarMinor) : t("ads.off")}`);
  if (price.managementFeeQarMinor > 0) {
    lines.push(`• ${t("whatsapp.management")}: ${money(price.managementFeeQarMinor)}`);
  }
  const addonNames: string[] = [];
  if (state.addons.landingPage) addonNames.push(t("addons.landingPage"));
  if (state.addons.pixelCapi) addonNames.push(t("addons.pixelCapi"));
  if (state.addons.customWebApp) addonNames.push(t("whatsapp.custom"));
  lines.push(`• ${t("whatsapp.addons")}: ${addonNames.length ? addonNames.join(locale === "ar" ? "، " : ", ") : t("whatsapp.none")}`);
  lines.push("");

  lines.push(`*${t("whatsapp.totals")}*`);
  lines.push(`• ${t("whatsapp.monthly")}: ${money(price.recurringQarMinor)}`);
  lines.push(`• ${t("whatsapp.oneTime")}: ${money(price.oneTimeQarMinor)}`);
  lines.push(`• ${t("whatsapp.firstMonth")}: ${money(price.firstMonthQarMinor)}`);
  if (price.customQuoteRequired) lines.push(`• ${t("whatsapp.custom")}`);

  const name = contact?.name.trim();
  const company = contact?.company.trim();
  const notes = contact?.notes.trim();
  if (name || company || contact?.timeline || notes) {
    lines.push("");
    lines.push(`*${t("whatsapp.contact")}*`);
    if (name) lines.push(`• ${t("whatsapp.name")}: ${name}`);
    if (company) lines.push(`• ${t("whatsapp.company")}: ${company}`);
    if (contact?.timeline) lines.push(`• ${t("whatsapp.timeline")}: ${t(TIMELINE_KEYS[contact.timeline])}`);
    if (notes) lines.push(`• ${t("whatsapp.notes")}: ${notes}`);
  }

  lines.push("");
  lines.push(t("whatsapp.closing"));
  lines.push(`_${t("whatsapp.disclaimer")}_`);
  return lines.join("\n");
}

/** Validates a Click-to-Chat destination: international digits only, no "+" or punctuation. */
export function isValidWhatsAppNumber(number: string): boolean {
  return /^[1-9]\d{7,14}$/.test(number);
}

/** Returns a safe https://wa.me link, or null when the configured number is invalid. */
export function buildWhatsAppUrl(number: string, message: string): string | null {
  if (!isValidWhatsAppNumber(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Short human-friendly reference, e.g. FTN-261009-K7Q2. Not stored server-side in Phase A. */
export function createPlanReference(now: Date = new Date(), random: () => number = Math.random): string {
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(random() * alphabet.length)];
  return `FTN-${date}-${suffix}`;
}
