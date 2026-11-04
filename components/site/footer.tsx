import Link from 'next/link';
import type { PublicSettings } from '@/lib/data';
import { FOOTER, NAV, NEWSLETTER_UI, UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import { telLink, waLink } from '@/lib/images';
import { Star8 } from './icons';
import NewsletterForm from './newsletter-form';

export default function Footer({ lang, settings }: { lang: Locale; settings: PublicSettings }) {
  const h = 'font-display text-xl font-bold text-gold';
  const link = 'block py-1 text-[15px] text-white/75 transition-colors hover:text-gold';
  const social = 'rounded-full border border-white/25 px-4 py-1.5 text-sm hover:border-gold hover:text-gold';

  return (
    <footer className="bg-kiswa text-white">
      <div className="hizam" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-16 sm:pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr]">
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center rounded-full border border-gold/80 text-gold">
                <Star8 className="size-6" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-bold tracking-[0.18em]">AL MARWA</span>
                <span className="block text-[11px] tracking-[0.22em] text-gold/90">{bi(lang, UI.brandSub)}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-[15px] text-white/65">{bi(lang, FOOTER.blurb)}</p>
            <ul className="mt-5 flex gap-3">
              {settings.instagram && (
                <li>
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className={social}>
                    Instagram
                  </a>
                </li>
              )}
              {settings.facebook && (
                <li>
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className={social}>
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </div>

          <nav aria-label={bi(lang, FOOTER.quick)}>
            <h2 className={h}>{bi(lang, FOOTER.quick)}</h2>
            <ul className="mt-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <Link href={`/${lang}${n.href}`} className={link}>
                    {bi(lang, n.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={h}>{bi(lang, FOOTER.contact)}</h2>
            <ul className="mt-3">
              <li>
                <a href={telLink(settings.phoneDisplay)} className={link}>
                  {settings.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp
                </a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={`${link} break-all`}>
                    {settings.email}
                  </a>
                </li>
              )}
              <li className="py-1 text-[15px] text-white/75">{tr(lang, settings.addressEn, settings.addressTa)}</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/5 p-6">
            <h2 className={h}>{bi(lang, NEWSLETTER_UI.title)}</h2>
            <p className="mb-4 mt-2 text-sm text-white/65">{bi(lang, NEWSLETTER_UI.body)}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-5 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Al Marwa Tours &amp; Travels. {bi(lang, FOOTER.rights)}
          </p>
          <p>{bi(lang, FOOTER.tagline)}</p>
          {/* Only entry point to the admin area. Deliberately small and absent from the main navigation. */}
          <Link href="/admin/login" className="transition-colors hover:text-gold" prefetch={false}>
            {bi(lang, FOOTER.admin)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
