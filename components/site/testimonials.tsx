import type { Testimonial } from '@/db/schema';
import { TESTIMONIALS_UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import Carousel from './carousel';

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <p className="flex gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" aria-hidden className={`size-5 ${n <= value ? 'fill-gold text-gold' : 'fill-line text-line'}`}>
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </p>
  );
}

export default function Testimonials({ lang, items }: { lang: Locale; items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="reviews-title" className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 id="reviews-title" className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">
            {bi(lang, TESTIMONIALS_UI.title)}
          </h2>
          <p className="mt-4 text-lg text-muted">{bi(lang, TESTIMONIALS_UI.intro)}</p>
        </div>
        <div className="mt-10">
          <Carousel label={bi(lang, TESTIMONIALS_UI.title)}>
            {items.map((t) => (
              <figure key={t.id} className="flex w-[86%] shrink-0 snap-start flex-col rounded-3xl border border-line bg-white p-7 shadow-sm shadow-black/5 sm:w-[22rem]">
                <Stars value={t.rating} label={`${t.rating} ${bi(lang, TESTIMONIALS_UI.rating)}`} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">{tr(lang, t.quoteEn, t.quoteTa)}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <span className="block font-bold text-haram">{t.name}</span>
                  {(t.detailEn || t.detailTa) && <span className="text-sm text-muted">{tr(lang, t.detailEn, t.detailTa)}</span>}
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
