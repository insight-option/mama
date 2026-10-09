import ar from "./ar.json";
import en from "./en.json";
import { LOCALES, type Locale } from "@/features/estimator/types";

export type Dictionary = typeof en;
export type TranslationKey = keyof Dictionary;
export type TranslateParams = Record<string, string | number>;
export type Translate = (key: TranslationKey, params?: TranslateParams) => string;

// `satisfies` makes the build fail if Arabic is missing any English key.
const dictionaries = { en, ar: ar satisfies Dictionary } as const;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function createTranslator(dictionary: Dictionary): Translate {
  return (key, params) => {
    const template: string = dictionary[key] ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  };
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
