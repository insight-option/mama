"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createTranslator, getDirection, type Dictionary, type Translate } from "@/i18n";
import type { Locale } from "@/features/estimator/types";

type I18nValue = { locale: Locale; dir: "rtl" | "ltr"; t: Translate };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  const value = useMemo(
    () => ({ locale, dir: getDirection(locale), t: createTranslator(dictionary) }),
    [locale, dictionary],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
