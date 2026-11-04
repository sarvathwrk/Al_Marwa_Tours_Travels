import Image from 'next/image';
import Link from 'next/link';
import { HERO, HERO_PHOTOS } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { HERO_IMAGE, unsplash } from '@/lib/images';

/** Wide hero: text on the left, a staggered trio of photos filling the right, edge to edge on large screens. */
export default function Hero({ lang }: { lang: Locale }) {
  const tamil = lang === 'ta';
  const frame = 'relative overflow-hidden rounded-[1.5rem] border border-gold/35 shadow-2xl shadow-black/40 sm:rounded-[2rem]';
  // Different heights per column give the row a skyline instead of three identical tiles on large screens.
  const heights = ['lg:h-[88%] lg:self-end', 'lg:h-full', 'lg:h-[76%] lg:self-start'];
  const focus = ['object-[50%_88%]', 'object-center', 'object-center'];

  return (
    <section id="home" className="relative isolate flex min-h-svh flex-col bg-kiswa text-white">
      <Image src={unsplash(HERO_IMAGE, 2400)} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-kiswa via-kiswa/80 to-kiswa/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-kiswa to-transparent" />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-10 px-5 pb-28 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:px-14">
        <div className="min-w-0 max-w-3xl">
          <h1
            className={`font-display font-bold text-balance break-words ${
              tamil
                ? 'text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[1.3]'
                : 'text-[clamp(2.75rem,5.6vw,6rem)] leading-[1.02] tracking-tight'
            }`}
          >
            {bi(lang, HERO.title)}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80 xl:text-xl">{bi(lang, HERO.body)}</p>
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

        {/* Hidden on phones to keep the first screen focused; a row on tablets, a tall staggered trio on desktop. */}
        <div className="hidden h-44 grid-cols-3 gap-3 sm:grid sm:h-56 sm:gap-4 lg:h-[min(70vh,680px)]">
          {HERO_PHOTOS.map((photo, i) => (
            <div key={photo.id} className={`${frame} ${heights[i] ?? ''}`}>
              <Image
                src={unsplash(photo.id, 900)}
                alt={bi(lang, photo.alt)}
                fill
                sizes="(min-width: 1024px) 26vw, 30vw"
                className={`object-cover ${focus[i] ?? 'object-center'}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hizam" aria-hidden />
    </section>
  );
}
