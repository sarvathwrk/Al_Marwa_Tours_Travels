import Image from 'next/image';
import Link from 'next/link';
import type { GalleryItem } from '@/db/schema';
import { GALLERY, GALLERY_UI } from '@/lib/content';
import { bi, tr, type Locale } from '@/lib/i18n';
import Carousel from './carousel';

export default function Gallery({ lang, items }: { lang: Locale; items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section id="gallery" className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display section-title text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, GALLERY.title)}</h2>
            <p className="mt-4 text-lg text-muted">{bi(lang, GALLERY.intro)}</p>
          </div>
          <Link
            href={`/${lang}/map`}
            className="rounded-full border border-haram px-6 py-3 text-sm font-semibold text-haram transition-colors hover:bg-haram hover:text-white"
          >
            {bi(lang, GALLERY_UI.mapCta)}
          </Link>
        </div>

        <div className="mt-10">
          <Carousel label={bi(lang, GALLERY.title)}>
            {items.map((item) => (
              <figure key={item.id} className="w-[78%] shrink-0 snap-start sm:w-72">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
                  {/* Admin-provided https links can be any host, so skip the image optimizer. */}
                  <Image
                    src={item.imageUrl}
                    alt={tr(lang, item.captionEn, item.captionTa)}
                    fill
                    unoptimized
                    sizes="288px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3 px-1 font-semibold text-haram">{tr(lang, item.captionEn, item.captionTa)}</figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
