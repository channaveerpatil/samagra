import * as React from 'react';
import type { Language } from '@/lib/i18n/languages';
import type { NestedKeyOf } from '@/lib/i18n/nestedKeyOf';
import type { TranslationDictionary } from '@/lib/i18n/translations';

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

export interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export default I18nContext;
