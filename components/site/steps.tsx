import { STEPS } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';

// Each step gets its own tint so the row reads as a sequence, not four identical cards.
const TINTS = ['bg-sage', 'bg-sand', 'bg-blush', 'bg-mist'] as const;

export default function Steps({ lang }: { lang: Locale }) {
  return (
    <section className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, STEPS.title)}</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.items.map((s, i) => (
            <li key={s.title.en} className={`rounded-3xl p-7 ${TINTS[i % TINTS.length]}`}>
              <span className="font-display text-5xl font-bold text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-lg font-bold text-haram">{bi(lang, s.title)}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{bi(lang, s.body)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
