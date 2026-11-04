'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, UI } from '@/lib/content';
import { bi, LOCALE_COOKIE, otherLocale } from '@/lib/i18n';
import { Close, Menu, Star8 } from './icons';
import { useLang } from './lang';

/** Floating pill navigation. 12px gap + 60px bar = the 72px the map page reserves. */
export default function SiteHeader({ solid = false }: { solid?: boolean }) {
  const { lang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const other = otherLocale(lang);
  const rest = pathname.replace(/^\/(en|ta)(?=\/|$)/, '');
  const onMap = rest.startsWith('/map');
  const filled = solid || scrolled || open;

  const hrefFor = (href: string) => `/${lang}${href}`;
  const remember = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <div
        className={`mx-auto max-w-6xl rounded-full border transition-colors duration-300 ${
          filled
            ? 'border-gold/30 bg-kiswa/92 shadow-lg shadow-black/25 backdrop-blur-md'
            : 'border-white/15 bg-kiswa/40 backdrop-blur-sm'
        }`}
      >
        <div className="flex h-[60px] items-center justify-between gap-4 pl-3 pr-2.5">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 text-white" onClick={() => setOpen(false)}>
            <span aria-hidden className="grid size-10 place-items-center rounded-full border border-gold/80 text-gold">
              <Star8 className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-[0.18em]">AL MARWA</span>
              <span className="block text-[10px] tracking-[0.22em] text-gold/90">{bi(lang, UI.brandSub)}</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = item.id === 'map' && onMap;
              return (
                <Link
                  key={item.id}
                  href={hrefFor(item.href)}
                  className={`rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-gold ${
                    active ? 'bg-white/10 text-gold' : 'text-white/85'
                  }`}
                >
                  {bi(lang, item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`/${other}${rest}`}
              hrefLang={other}
              lang={other}
              onClick={remember}
              aria-label={bi(lang, UI.switchLabel)}
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              {bi(lang, UI.switchTo)}
            </a>
            <Link
              href={hrefFor('#contact')}
              className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-kiswa transition-colors hover:bg-[#d9bd88] sm:inline-flex"
            >
              {bi(lang, UI.enquire)}
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={bi(lang, UI.menu)}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="mx-auto mt-2 max-w-6xl rounded-3xl border border-gold/25 bg-kiswa p-5 lg:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.id} className="border-b border-white/10 last:border-0">
                <Link href={hrefFor(item.href)} onClick={() => setOpen(false)} className="block py-3.5 text-base text-white/90">
                  {bi(lang, item.label)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={hrefFor('#contact')}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-kiswa"
          >
            {bi(lang, UI.enquire)}
          </Link>
        </nav>
      )}
    </header>
  );
}
