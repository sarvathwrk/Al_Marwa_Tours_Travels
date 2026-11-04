import { SERVICES } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { Chat, Compass, Crescent, Cube, Hotel, Plane } from './icons';

const ICONS = { crescent: Crescent, cube: Cube, plane: Plane, hotel: Hotel, compass: Compass, chat: Chat } as const;

export default function Services({ lang }: { lang: Locale }) {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, SERVICES.title)}</h2>
          <p className="mt-4 text-lg text-muted">{bi(lang, SERVICES.intro)}</p>
        </div>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <article key={item.title.en} className="bg-white p-8 transition-colors hover:bg-mist">
                <Icon className="size-9 text-gold-deep" />
                <h3 className="mt-5 font-display text-2xl font-bold text-haram">{bi(lang, item.title)}</h3>
                <p className="mt-2 text-[15px] text-muted">{bi(lang, item.body)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
