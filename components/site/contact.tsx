import type { PublicSettings } from '@/lib/data';
import { CONTACT } from '@/lib/content';
import { telLink, waLink } from '@/lib/images';
import { tr, bi, type Locale } from '@/lib/i18n';
import EnquiryForm from './enquiry-form';
import { Chat, Clock, Mail, Phone, Pin } from './icons';

export default function Contact({ lang, settings }: { lang: Locale; settings: PublicSettings }) {
  const address = tr(lang, settings.addressEn, settings.addressTa);
  const hours = tr(lang, settings.hoursEn, settings.hoursTa);
  const row = 'flex items-start gap-3.5 border-b border-white/15 py-4 text-[15px]';

  return (
    <section id="contact" className="bg-mist py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, CONTACT.title)}</h2>
          <p className="mt-4 text-lg text-muted">{bi(lang, CONTACT.intro)}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-haram p-8 text-white md:p-10">
            <h3 className="font-display text-3xl font-bold">{bi(lang, CONTACT.boxTitle)}</h3>
            <p className="mt-2 text-white/75">{bi(lang, CONTACT.boxBody)}</p>
            <div className="mt-6 border-t border-white/15">
              <div className={row}>
                <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
                <a href={telLink(settings.phoneDisplay)} className="font-semibold hover:text-gold">
                  {settings.phoneDisplay}
                </a>
              </div>
              <div className={row}>
                <Chat className="mt-0.5 size-5 shrink-0 text-gold" />
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  WhatsApp
                </a>
              </div>
              {settings.email && (
                <div className={row}>
                  <Mail className="mt-0.5 size-5 shrink-0 text-gold" />
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-gold">
                    {settings.email}
                  </a>
                </div>
              )}
              {address && (
                <div className={row}>
                  <Pin className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{address}</span>
                </div>
              )}
              {hours && (
                <div className={row}>
                  <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{hours}</span>
                </div>
              )}
            </div>
          </div>

          <EnquiryForm whatsapp={settings.whatsapp} />
        </div>
      </div>
    </section>
  );
}
