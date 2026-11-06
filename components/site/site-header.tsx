'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, UI } from '@/lib/content';
import { bi, LOCALE_COOKIE, otherLocale } from '@/lib/i18n';
import { Menu, X } from 'lucide-react';
import BrandLogo from './brand-logo';
import { useLang } from './lang';

/** Floating pill (12px gap + 60px bar) that docks into a 72px bar on scroll; either way the 72px the map page reserves. */
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
  // Tamil labels are wider, so the full nav needs more room before it replaces the menu button.
  const showNav = lang === 'ta' ? 'xl:flex' : 'lg:flex';
  const hideMenu = lang === 'ta' ? 'xl:hidden' : 'lg:hidden';

  const hrefFor = (href: string) => `/${lang}${href}`;
  const remember = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[padding] duration-300 ${filled ? 'p-0' : 'px-3 pt-3'}`}>
      {/* Floating pill over the hero; once scrolled it docks as a full-width bar so page content never shows above it. */}
      <div
        className={`mx-auto border transition-all duration-300 ${
          filled
            ? 'max-w-none rounded-none border-x-0 border-t-0 border-b-gold/30 bg-kiswa/95 shadow-lg shadow-black/25 backdrop-blur-md'
            : 'max-w-[1600px] rounded-full border-white/15 bg-kiswa/40 backdrop-blur-sm'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between gap-2 transition-[height,padding] duration-300 min-[380px]:gap-4 ${
            filled ? 'h-[72px] px-3 sm:px-5' : 'h-[60px] pl-3 pr-2.5'
          }`}
        >
          <Link href={`/${lang}`} className="flex min-w-0 shrink items-center" onClick={() => setOpen(false)}>
            <BrandLogo lang={lang} className="h-9 sm:h-10" />
          </Link>

          <nav aria-label={bi(lang, UI.mainNav)} className={`hidden items-center gap-1 ${showNav}`}>
            {NAV.map((item) => {
              const active = item.id === 'map' && onMap;
              return (
                <Link
                  key={item.id}
                  href={hrefFor(item.href)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-gold xl:px-3.5 ${
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
              className="whitespace-nowrap rounded-full border border-white/30 px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold min-[380px]:px-4"
            >
              {bi(lang, UI.switchTo)}
            </a>
            <Link
              href={hrefFor('#contact')}
              className="hidden whitespace-nowrap rounded-full bg-gold px-5 py-2 text-sm font-semibold text-kiswa transition-colors hover:bg-[#d9bd88] sm:inline-flex"
            >
              {bi(lang, UI.enquire)}
            </Link>
            <button
              type="button"
              className={`grid size-10 place-items-center rounded-full text-white ${hideMenu}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={bi(lang, UI.menu)}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={bi(lang, UI.mobileNav)} className={`mx-3 mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-gold/25 bg-kiswa p-5 ${hideMenu}`}>
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
