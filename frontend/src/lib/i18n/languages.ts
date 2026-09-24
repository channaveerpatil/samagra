export const LANGUAGES = {
  en: 'en',
  kn: 'kn',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  kn: 'ಕನ್ನಡ (Kannada)',
};

export const LANGUAGE_CODES: Record<Language, string> = {
  en: 'EN',
  kn: 'KN',
};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  en: 'en-US',
  kn: 'kn-IN',
};
