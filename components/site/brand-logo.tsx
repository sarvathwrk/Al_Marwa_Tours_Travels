import type { Locale } from '@/lib/i18n';

/** Intrinsic viewBox sizes of the files in /public/brand (regenerate both together). */
const HEADER = { en: { w: 490.55, h: 100 }, ta: { w: 436.17, h: 100 } } as const;
const ICON = { w: 557.8, h: 380.74 };

const ALT: Record<Locale, string> = {
  en: 'Al Marwa Tours & Travels',
  ta: 'அல் மர்வா டூர்ஸ் & டிராவல்ஸ்',
};

/**
 * Horizontal lockup (calligraphy mark + name) in white/gold for dark surfaces.
 * Below 360px only the mark is shown so the header bar never overflows on narrow phones.
 */
export default function BrandLogo({ lang, className = 'h-9' }: { lang: Locale; className?: string }) {
  const size = HEADER[lang];
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
      <img
        src={`/brand/header-logo-${lang}-white.svg`}
        alt={ALT[lang]}
        width={size.w}
        height={size.h}
        className={`hidden w-auto min-[360px]:block ${className}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-icon-white.svg"
        alt={ALT[lang]}
        width={ICON.w}
        height={ICON.h}
        className={`block w-auto min-[360px]:hidden ${className}`}
      />
    </>
  );
}
