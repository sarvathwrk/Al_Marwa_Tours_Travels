import Image from 'next/image';
import Link from 'next/link';
import type { Stat } from '@/db/schema';
import { ABOUT, ABOUT_UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import { ABOUT_IMAGE, unsplash } from '@/lib/images';
import { BadgeCheck, Check, Compass, MoonStar, Users } from 'lucide-react';

const STAT_ICONS = [BadgeCheck, Compass, Users, MoonStar] as const;

/** Text and admin-managed numbers on the left, tall photo on the right. Falls back to the original highlights when no numbers exist. */
export default function About({ lang, stats }: { lang: Locale; stats: Stat[] }) {
  const card = 'rounded-3xl bg-white p-6 shadow-sm shadow-gold-deep/10';

  return (
    <section id="about" className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-sand p-6 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col">
            <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, ABOUT.title)}</h2>
            <p className="mt-5 max-w-xl text-lg text-muted">{bi(lang, ABOUT.body)}</p>

            {stats.length > 0 ? (
              <>
                <h3 className="sr-only">{bi(lang, ABOUT_UI.statsTitle)}</h3>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {stats.map((s, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length] ?? BadgeCheck;
                    return (
                      <div key={s.id} className={card}>
                        <span className="grid size-11 place-items-center rounded-full bg-sage text-haram">
                          <Icon className="size-5" />
                        </span>
                        <p className="mt-5 font-display text-5xl font-bold text-haram">{s.value}</p>
                        <p className="mt-1 text-[15px] text-muted">{tr(lang, s.labelEn, s.labelTa)}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {ABOUT.checks.map((c) => (
                  <li key={c.en} className={`${card} flex items-start gap-3`}>
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-sage text-haram">
                      <Check className="size-4" />
                    </span>
                    <span className="font-semibold text-haram">{bi(lang, c)}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/${lang}#contact`}
              className="mt-8 inline-flex w-fit rounded-full bg-haram px-7 py-3.5 font-semibold text-white transition-colors hover:bg-haram-2"
            >
              {bi(lang, ABOUT.cta)}
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-3xl">
            <Image
              src={unsplash(ABOUT_IMAGE, 1100, 85)}
              alt={bi(lang, ABOUT.imageAlt)}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
