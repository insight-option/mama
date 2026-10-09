import manifest from "../../public/media/manifest.json";
import type { Locale } from "@/features/estimator/types";

type ManifestEntry = { file: string; alt_en: string; alt_ar: string };

const entries = manifest as ManifestEntry[];

/** Localized alt text from public/media/manifest.json (credits live in CREDITS.md). */
export function mediaAlt(file: string, locale: Locale): string {
  const entry = entries.find((e) => e.file === file);
  if (!entry) return "";
  return locale === "ar" ? entry.alt_ar : entry.alt_en;
}

export const media = (file: string) => `/media/${file}`;
