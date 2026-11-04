import Image from 'next/image';
import type { Founder as FounderRow } from '@/db/schema';
import { FOUNDER_UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';

export default function Founder({ lang, founder }: { lang: Locale; founder: FounderRow | null }) {
  if (!founder) return null;
  const name = tr(lang, founder.nameEn, founder.nameTa);
  const role = tr(lang, founder.roleEn, founder.roleTa);
  const paragraphs = tr(lang, founder.bioEn, founder.bioTa)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section aria-labelledby="founder-title" className="px-3 pb-16 md:pb-24">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 ${founder.photoUrl ? 'lg:grid-cols-[0.8fr_1.2fr]' : ''}`}>
        {founder.photoUrl && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-mist">
            <Image src={founder.photoUrl} alt={name} fill unoptimized sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
          </div>
        )}
        <div>
          {role && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1 text-sm font-medium text-haram">
              <span aria-hidden className="size-2 rounded-full bg-gold" />
              {role}
            </span>
          )}
          <h2 id="founder-title" className="mt-4 font-display text-4xl font-bold leading-tight text-haram md:text-5xl">
            <span className="sr-only">{bi(lang, FOUNDER_UI.title)}: </span>
            {name}
          </h2>
          <div className="mt-5 grid max-w-2xl gap-4 text-lg text-muted">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
