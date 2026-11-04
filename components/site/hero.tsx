import Image from 'next/image';
import Link from 'next/link';
import { HERO } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { HERO_IMAGE, unsplash } from '@/lib/images';

export default function Hero({ lang }: { lang: Locale }) {
  const tamil = lang === 'ta';
  return (
    <section id="home" className="relative isolate flex min-h-svh flex-col bg-kiswa text-white">
      <Image
        src={unsplash(HERO_IMAGE, 2000)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-50"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-kiswa via-kiswa/85 to-kiswa/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-kiswa to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 pb-32 pt-32 sm:pb-20">
        <div className="max-w-2xl">
          <h1
            className={`font-display font-bold text-balance ${
              tamil
                ? 'text-[clamp(2.1rem,5.2vw,4rem)] leading-[1.3]'
                : 'text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-tight'
            }`}
          >
            {bi(lang, HERO.title)}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{bi(lang, HERO.body)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${lang}#packages`}
              className="rounded-full bg-gold px-7 py-3.5 font-semibold text-kiswa transition-colors hover:bg-[#d9bd88]"
            >
              {bi(lang, HERO.primary)}
            </Link>
            <Link
              href={`/${lang}#contact`}
              className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {bi(lang, HERO.secondary)}
            </Link>
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/75">
            {HERO.trust.map((t) => (
              <li key={t.en} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                {bi(lang, t)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hizam" aria-hidden />
    </section>
  );
}
