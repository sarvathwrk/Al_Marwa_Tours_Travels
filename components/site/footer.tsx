import { Lock, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { PublicSettings } from '@/lib/data';
import { FOOTER, NAV, NEWSLETTER_UI, UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import { telLink, waLink } from '@/lib/images';
import { Facebook, Instagram, Star8, WhatsApp } from './icons';
import NewsletterForm from './newsletter-form';

export default function Footer({ lang, settings }: { lang: Locale; settings: PublicSettings }) {
  const h = 'font-display text-xl font-bold text-gold';
  const link = 'flex items-center gap-2.5 py-2 text-[15px] text-white/75 transition-colors hover:text-gold';
  const social =
    'grid size-10 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-gold hover:text-gold';
  const address = tr(lang, settings.addressEn, settings.addressTa);

  return (
    <footer className="bg-kiswa text-white">
      <div className="hizam" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-16 sm:pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.2fr]">
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
            <ul className="mt-5 flex flex-wrap gap-3">
              <li>
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={social}>
                  <WhatsApp className="size-[18px]" />
                </a>
              </li>
              {settings.instagram && (
                <li>
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}>
                    <Instagram className="size-[18px]" />
                  </a>
                </li>
              )}
              {settings.facebook && (
                <li>
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}>
                    <Facebook className="size-[18px]" />
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
                  <Link href={`/${lang}${n.href}`} className="block py-1.5 text-[15px] text-white/75 transition-colors hover:text-gold">
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
                  <Phone className="size-4 shrink-0 text-gold" />
                  {settings.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className={link}>
                  <WhatsApp className="size-4 shrink-0 text-gold" />
                  WhatsApp
                </a>
              </li>
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={`${link} break-all`}>
                    <Mail className="size-4 shrink-0 text-gold" />
                    {settings.email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2.5 py-1 text-[15px] text-white/75">
                  <MapPin className="mt-1 size-4 shrink-0 text-gold" />
                  {address}
                </li>
              )}
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
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 py-2 transition-colors hover:text-gold" prefetch={false}>
            <Lock className="size-3" />
            {bi(lang, FOOTER.admin)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
