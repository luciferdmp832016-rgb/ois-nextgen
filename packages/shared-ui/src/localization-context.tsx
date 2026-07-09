"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  defaultLocale,
  getLocalizationCatalog,
  localizeDisplayText,
  localizationManualEditPath,
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

export function LocalizedText({
  translationKey,
  text
}: {
  translationKey?: TranslationKey | string | undefined;
  text?: string | undefined;
}) {
  const { locale, t } = useLocalization();
  const fallback = text ?? translationKey ?? "";
  const localized = translationKey ? t(translationKey) : localizeDisplayText(fallback, locale);

  return <>{localized === translationKey ? fallback : localized}</>;
}

export function LocalizationCatalogPanel({ productName }: { productName: string }) {
  const { locale, t } = useLocalization();
  const catalog = getLocalizationCatalog(locale);

  return (
    <section className="localization-catalog" data-localization-catalog="Read-only Localization Catalog">
      <section className="panel localization-catalog-summary">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">{productName}</span>
            <h3>{t("common.localizationCatalog")}</h3>
            <p className="muted">{t("common.readOnlyCatalogIntro")}</p>
          </div>
          <span className="status status-neutral" data-owner-status="Owner-friendly Status Badges">
            {t("common.readOnly")}
          </span>
        </div>
        <dl className="facts localization-catalog-facts">
          <div>
            <dt>{t("common.currentLocale")}</dt>
            <dd>{localeDisplayNames[catalog.currentLocale]}</dd>
          </div>
          <div>
            <dt>{t("common.availableLocales")}</dt>
            <dd>{catalog.availableLocales.map((availableLocale) => localeDisplayNames[availableLocale]).join(", ")}</dd>
          </div>
          <div>
            <dt>{t("common.translationNamespaces")}</dt>
            <dd>{catalog.namespaces.length}</dd>
          </div>
          <div>
            <dt>{t("common.missingKeys")}</dt>
            <dd>{catalog.missingKeyCount}</dd>
          </div>
          <div>
            <dt>{t("common.fallbackKeys")}</dt>
            <dd>{catalog.fallbackKeyCount}</dd>
          </div>
          <div>
            <dt>{t("common.manualEditLocation")}</dt>
            <dd>{localizationManualEditPath}</dd>
          </div>
        </dl>
      </section>
      <div className="localization-namespace-grid" aria-label={t("common.translationNamespaces")}>
        {catalog.namespaces.map((namespace) => (
          <article className="panel compact-panel localization-namespace-card" key={namespace.namespace}>
            <div className="panel-heading">
              <div>
                <h4>{namespace.namespace}</h4>
                <p className="muted">
                  {namespace.totalKeys} keys / {namespace.missingKeys} missing / {namespace.fallbackKeys} fallback
                </p>
              </div>
              <span className="pill">{namespace.sampleKeys[0]}</span>
            </div>
            <p className="muted">
              {t("common.sampleKeys")}: {namespace.sampleKeys.join(", ")}
            </p>
          </article>
        ))}
      </div>
      <div className="panel muted owner-safe-note">
        {t("common.browserEditingDisabled")}. {t("common.noDataMutationEnabled")}
      </div>
    </section>
  );
}
