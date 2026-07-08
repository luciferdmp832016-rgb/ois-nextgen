"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  defaultLocale,
  localeDisplayNames,
  normalizeLocale,
  supportedLocales,
  translate,
  type Locale,
  type TranslationKey
} from "./localization";

type LocalizationContextValue = {
  locale: Locale;
  setLocale: (locale: Locale | string) => void;
  t: (key: TranslationKey | string) => string;
};

const localeStorageKey = "ois-nextgen.locale";

const LocalizationContext = createContext<LocalizationContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
  t: (key) => translate(key, defaultLocale)
});

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      setLocaleState(normalizeLocale(window.localStorage.getItem(localeStorageKey)));
    } catch {
      setLocaleState(defaultLocale);
    }
  }, []);

  const setLocale = (nextLocale: Locale | string) => {
    const normalized = normalizeLocale(nextLocale);
    setLocaleState(normalized);

    try {
      window.localStorage.setItem(localeStorageKey, normalized);
    } catch {
      // Local storage is a presentation convenience only; fallback stays deterministic.
    }
  };

  const value = useMemo<LocalizationContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translate(key, locale)
    }),
    [locale]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  return useContext(LocalizationContext);
}

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocalization();

  return (
    <label
      className="language-selector"
      data-language-settings="Language Settings"
      data-localization-foundation="Localization Foundation"
    >
      <span className="language-selector-label">{t("language.settings")}</span>
      <select aria-label={t("language.settings")} onChange={(event) => setLocale(event.target.value)} value={locale}>
        {supportedLocales.map((option) => (
          <option value={option} key={option}>
            {localeDisplayNames[option]}
          </option>
        ))}
      </select>
      <span className="visually-hidden">Localization Foundation English Tiếng Việt</span>
    </label>
  );
}
