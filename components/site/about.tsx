import Image from 'next/image';
import Link from 'next/link';
import { ABOUT } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { ABOUT_IMAGE, unsplash } from '@/lib/images';
import { Check } from './icons';

export default function About({ lang }: { lang: Locale }) {
  return (
    <section id="about" className="bg-mist py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -bottom-3.5 -left-3.5 h-1/2 w-1/2 border-b-[3px] border-l-[3px] border-gold" aria-hidden />
          <Image
            src={unsplash(ABOUT_IMAGE, 1100, 85)}
            alt={bi(lang, ABOUT.imageAlt)}
            width={1100}
            height={1400}
            sizes="(min-width: 768px) 560px, 100vw"
            className="relative h-[360px] w-full object-cover md:h-[500px]"
          />
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, ABOUT.title)}</h2>
          <p className="mt-5 text-lg text-muted">{bi(lang, ABOUT.body)}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {ABOUT.checks.map((c) => (
              <li key={c.en} className="flex items-start gap-2.5 text-[15px] font-medium">
                <Check className="mt-0.5 size-5 shrink-0 text-gold-deep" />
                {bi(lang, c)}
              </li>
            ))}
          </ul>
          <Link
            href={`/${lang}#contact`}
            className="mt-9 inline-flex rounded-full bg-haram px-7 py-3.5 font-semibold text-white transition-colors hover:bg-haram-2"
          >
            {bi(lang, ABOUT.cta)}
          </Link>
        </div>
      </div>
    </section>
  );
}
