import { Plus } from 'lucide-react';
import type { Faq } from '@/db/schema';
import { FAQ_UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import { waLink } from '@/lib/images';
import { WhatsApp } from './icons';

export default function FaqSection({ lang, items, whatsapp }: { lang: Locale; items: Faq[]; whatsapp: string }) {
  if (items.length === 0) return null;
  return (
    <section id="faq" className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-mist p-6 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display section-title text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, FAQ_UI.title)}</h2>
            <p className="mt-4 text-lg text-muted">{bi(lang, FAQ_UI.intro)}</p>
            <a
              href={waLink(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-haram px-6 py-3 text-sm font-semibold text-haram transition-colors hover:bg-haram hover:text-white"
            >
              <WhatsApp className="size-4" />
              {bi(lang, FAQ_UI.ask)}
            </a>
          </div>

          <div className="grid gap-3">
            {items.map((f) => (
              <details key={f.id} className="group rounded-2xl bg-white px-6 py-5 open:shadow-sm open:shadow-haram/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-haram [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 break-words">{tr(lang, f.questionEn, f.questionTa)}</span>
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-sage transition-transform group-open:rotate-45">
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{tr(lang, f.answerEn, f.answerTa)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
