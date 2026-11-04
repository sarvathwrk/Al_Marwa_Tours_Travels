import { QUOTE } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';

export default function Quote({ lang }: { lang: Locale }) {
  return (
    <section aria-label="Quote">
      <div className="hizam" aria-hidden />
      <figure className="bg-haram px-5 py-20 text-center text-white">
        <blockquote className="mx-auto max-w-3xl font-display text-3xl leading-snug md:text-4xl">{bi(lang, QUOTE.text)}</blockquote>
        <figcaption className="mt-4 text-white/70">{bi(lang, QUOTE.source)}</figcaption>
      </figure>
    </section>
  );
}
