import type { PublicSettings } from '@/lib/data';
import { UI } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { telLink, waLink } from '@/lib/images';
import { Phone } from 'lucide-react';
import { WhatsApp } from './icons';

export default function FloatingContact({ lang, settings }: { lang: Locale; settings: PublicSettings }) {
  const base = 'grid size-14 place-items-center rounded-full shadow-lg shadow-black/30 transition-transform hover:scale-105';
  return (
    <div className="fixed bottom-5 right-4 z-30 flex flex-col gap-3 sm:right-6">
      <a
        href={waLink(settings.whatsapp, bi(lang, UI.waGeneral))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={bi(lang, UI.whatsapp)}
        className={`${base} bg-[#1fae62] text-white`}
      >
        <WhatsApp className="size-7" />
      </a>
      <a href={telLink(settings.phoneDisplay)} aria-label={bi(lang, UI.call)} className={`${base} border border-gold/60 bg-haram text-gold`}>
        <Phone className="size-6" />
      </a>
    </div>
  );
}
