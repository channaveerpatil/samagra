import type { Language } from '../languages';
import { en } from './en';
import { kn } from './kn';

export type TranslationDictionary = typeof en;

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en,
  kn,
};
