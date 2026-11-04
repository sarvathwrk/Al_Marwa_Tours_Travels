import { STEPS } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';

export default function Steps({ lang }: { lang: Locale }) {
  return (
    <section className="bg-mist py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, STEPS.title)}</h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.items.map((s, i) => (
            <li key={s.title.en} className="border-t-2 border-gold pt-5">
              <span className="font-display text-4xl font-bold text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-lg font-bold text-haram">{bi(lang, s.title)}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{bi(lang, s.body)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
