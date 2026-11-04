import type { PublicSettings } from '@/lib/data';
import { CONTACT } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import { telLink, waLink } from '@/lib/images';
import EnquiryForm from './enquiry-form';
import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import { WhatsApp } from './icons';
import OfficeMap from './office-map';

function InfoCard({
  tint,
  Icon,
  title,
  children,
}: {
  tint: string;
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 ${tint}`}>
      {/* big faint watermark, like the reference */}
      <Icon aria-hidden strokeWidth={1} className="absolute -right-6 -top-6 size-40 text-haram opacity-[0.1]" />
      <span className="relative grid size-12 place-items-center rounded-full bg-white text-haram">
        <Icon className="size-6" />
      </span>
      <h3 className="relative mt-5 text-lg font-bold text-ink">{title}</h3>
      <div className="relative mt-1 grid gap-0.5 text-[15px] text-muted">{children}</div>
    </div>
  );
}

export default function Contact({ lang, settings }: { lang: Locale; settings: PublicSettings }) {
  const address = tr(lang, settings.addressEn, settings.addressTa);
  const hours = tr(lang, settings.hoursEn, settings.hoursTa);
  const hasMap = settings.latitude !== null && settings.longitude !== null;

  return (
    <section id="contact" className="px-3 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, CONTACT.title)}</h2>
          <p className="text-lg text-muted">{bi(lang, CONTACT.intro)}</p>
        </div>

        <div className="mt-10 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
          <InfoCard tint="bg-sage" Icon={Phone} title={bi(lang, CONTACT.cards.phone)}>
            <a href={telLink(settings.phoneDisplay)} className="inline-flex min-h-9 items-center font-semibold text-haram hover:underline">
              {settings.phoneDisplay}
            </a>
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 hover:underline">
              <WhatsApp className="size-4 text-[#1fae62]" />
              WhatsApp
            </a>
          </InfoCard>
          {settings.email && (
            <InfoCard tint="bg-blush" Icon={Mail} title={bi(lang, CONTACT.cards.email)}>
              <a href={`mailto:${settings.email}`} className="break-all font-semibold text-haram hover:underline">
                {settings.email}
              </a>
            </InfoCard>
          )}
          {(address || hours) && (
            <InfoCard tint="bg-sand" Icon={MapPin} title={bi(lang, CONTACT.cards.visit)}>
              {address && <span className="font-semibold text-haram">{address}</span>}
              {hours && (
                <span className="flex items-start gap-2">
                  <Clock className="mt-1 size-4 shrink-0" />
                  {hours}
                </span>
              )}
            </InfoCard>
          )}
        </div>

        <div className="mt-6 rounded-[2rem] bg-sage p-3 md:p-5">
          <div className="grid gap-6 rounded-[1.5rem] bg-white p-5 md:p-8 lg:grid-cols-2">
            <EnquiryForm whatsapp={settings.whatsapp} />

            {hasMap ? (
              <OfficeMap lat={settings.latitude as number} lng={settings.longitude as number} label={bi(lang, CONTACT.mapLabel)} />
            ) : (
              <div className="flex min-h-[260px] flex-col overflow-hidden rounded-2xl bg-kiswa text-white">
                <div className="flex flex-1 flex-col items-start justify-center p-8">
                  <h3 className="font-display text-3xl font-bold">{bi(lang, CONTACT.fallbackTitle)}</h3>
                  <p className="mt-3 text-white/75">{bi(lang, CONTACT.boxBody)}</p>
                  <a
                    href={waLink(settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1fae62] px-6 py-3 font-semibold text-white"
                  >
                    <WhatsApp className="size-5" />
                    WhatsApp
                  </a>
                </div>
                <div className="hizam" aria-hidden />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
