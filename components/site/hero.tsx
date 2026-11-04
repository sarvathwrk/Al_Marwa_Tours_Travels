import Image from 'next/image';
import Link from 'next/link';
import { HERO, HERO_PHOTOS } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { HERO_IMAGE, unsplash } from '@/lib/images';

export default function Hero({ lang }: { lang: Locale }) {
  const tamil = lang === 'ta';
  const [tall, topRight, bottomRight] = HERO_PHOTOS;
  const frame = 'relative overflow-hidden rounded-[1.75rem] border border-gold/35 shadow-2xl shadow-black/40';

  return (
    <section id="home" className="relative isolate flex min-h-svh flex-col bg-kiswa text-white">
      <Image src={unsplash(HERO_IMAGE, 2000)} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-kiswa via-kiswa/85 to-kiswa/30" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-kiswa to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 pb-32 pt-32 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 max-w-2xl">
          <h1
            className={`font-display font-bold text-balance break-words ${
              tamil
                ? 'text-[clamp(1.7rem,5vw,3.8rem)] leading-[1.3]'
                : 'text-[clamp(2.75rem,6.4vw,5.2rem)] leading-[1.02] tracking-tight'
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
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/75">
            {HERO.trust.map((t) => (
              <li key={t.en} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                {bi(lang, t)}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo mosaic, desktop only */}
        {tall && topRight && bottomRight && (
          <div className="hidden h-[520px] grid-cols-2 grid-rows-2 gap-4 lg:grid">
            <div className={`${frame} row-span-2`}>
              <Image src={unsplash(tall.id, 700)} alt={bi(lang, tall.alt)} fill sizes="22vw" className="object-cover" />
            </div>
            <div className={`${frame} mt-8`}>
              <Image src={unsplash(topRight.id, 500)} alt={bi(lang, topRight.alt)} fill sizes="16vw" className="object-cover" />
            </div>
            <div className={`${frame} mb-8`}>
              <Image src={unsplash(bottomRight.id, 500)} alt={bi(lang, bottomRight.alt)} fill sizes="16vw" className="object-cover" />
            </div>
          </div>
        )}
      </div>

      <div className="hizam" aria-hidden />
    </section>
  );
}
