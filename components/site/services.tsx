import Link from 'next/link';
import { SERVICES, SERVICES_UI } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { Box, Compass, Hotel, Languages, MoonStar, Plane } from 'lucide-react';

const ICONS = { crescent: MoonStar, cube: Box, plane: Plane, hotel: Hotel, compass: Compass, chat: Languages } as const;

export default function Services({ lang }: { lang: Locale }) {
  return (
    <section id="services" className="px-3 py-16 md:py-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-sage p-6 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, SERVICES.title)}</h2>
            <p className="mt-4 text-lg text-muted">{bi(lang, SERVICES.intro)}</p>
            <Link
              href={`/${lang}#contact`}
              className="mt-8 inline-flex rounded-full bg-haram px-7 py-3.5 font-semibold text-white transition-colors hover:bg-haram-2"
            >
              {bi(lang, SERVICES_UI.cta)}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <article key={item.title.en} className="rounded-3xl bg-white p-6 shadow-sm shadow-haram/5">
                  <span className="grid size-12 place-items-center rounded-full bg-sand text-gold-deep">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-haram">{bi(lang, item.title)}</h3>
                  <p className="mt-2 text-[15px] text-muted">{bi(lang, item.body)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
