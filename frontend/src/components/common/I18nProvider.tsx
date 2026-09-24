import * as React from 'react';
import I18nContext from '@/context/I18nContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import { LANGUAGES, type Language } from '@/lib/i18n/languages';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import type { TranslationKey } from '@/context/I18nContext';

interface I18nProviderProps {
  children: React.ReactNode;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, token: string) =>
    token in params ? String(params[token]) : match,
  );
}

function resolveKey(dictionary: object, key: string): string {
  const value = key.split('.').reduce<unknown>((node, segment) => {
    if (node && typeof node === 'object' && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dictionary);

  return typeof value === 'string' ? value : key;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useLocalStorage<Language>('i18n.language', LANGUAGES.en);

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = React.useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      interpolate(resolveKey(TRANSLATIONS[language], key), params),
    [language],
  );

  const contextValue = React.useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
