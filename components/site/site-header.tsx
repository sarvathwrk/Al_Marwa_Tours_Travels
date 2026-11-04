'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, UI } from '@/lib/content';
import { bi, LOCALE_COOKIE, otherLocale } from '@/lib/i18n';
import { Close, Menu, Star8 } from './icons';
import { useLang } from './lang';

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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        filled ? 'border-b border-gold/25 bg-kiswa/95 backdrop-blur' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5">
        <Link href={`/${lang}`} className="flex items-center gap-3 text-white" onClick={() => setOpen(false)}>
          <span aria-hidden className="grid size-11 place-items-center rounded-full border border-gold/80 text-gold">
            <Star8 className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold tracking-[0.18em]">AL MARWA</span>
            <span className="block text-[11px] tracking-[0.22em] text-gold/90">{bi(lang, UI.brandSub)}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = item.id === 'map' && onMap;
            return (
              <Link
                key={item.id}
                href={hrefFor(item.href)}
                className={`text-[15px] font-medium transition-colors hover:text-gold ${
                  active ? 'text-gold' : 'text-white/85'
                }`}
              >
                {bi(lang, item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
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

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-gold/20 bg-kiswa px-5 pb-6 lg:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.id} className="border-b border-white/10">
                <Link
                  href={hrefFor(item.href)}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-base text-white/90"
                >
                  {bi(lang, item.label)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={hrefFor('#contact')}
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-kiswa"
          >
            {bi(lang, UI.enquire)}
          </Link>
        </nav>
      )}
    </header>
  );
}
