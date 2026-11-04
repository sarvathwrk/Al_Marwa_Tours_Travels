'use client';

import { createContext, useContext, useMemo } from 'react';
import { tr, type Locale } from '@/lib/i18n';

type Ctx = { lang: Locale; pick: (en: string, ta?: string) => string };

const LangContext = createContext<Ctx>({ lang: 'en', pick: (en) => en });

/** Seeded from the route segment (/en, /ta), so Tamil is server-rendered with no flash. */
export function LangProvider({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const value = useMemo<Ctx>(() => ({ lang, pick: (en, ta) => tr(lang, en, ta) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Inline bilingual text for client components. Server components should use tr(lang, ...). */
export function T({ en, ta }: { en: string; ta?: string }) {
  return <>{useLang().pick(en, ta)}</>;
}
