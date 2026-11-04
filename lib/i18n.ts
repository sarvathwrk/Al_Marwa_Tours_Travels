export const LOCALES = ['en', 'ta'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);
export const otherLocale = (l: Locale): Locale => (l === 'en' ? 'ta' : 'en');

export type Bi = { en: string; ta: string };

/** English fallback when a Tamil string is empty. */
export const tr = (lang: Locale, en: string, ta?: string) => (lang === 'ta' && ta ? ta : en);
export const bi = (lang: Locale, v: Bi) => tr(lang, v.en, v.ta);

export const LOCALE_LABEL: Record<Locale, string> = { en: 'English', ta: 'தமிழ்' };
