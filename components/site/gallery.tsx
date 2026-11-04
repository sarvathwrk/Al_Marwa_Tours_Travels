import Image from 'next/image';
import { GALLERY } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import { unsplash } from '@/lib/images';

export default function Gallery({ lang }: { lang: Locale }) {
  return (
    <section id="gallery" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, GALLERY.title)}</h2>
          <p className="mt-4 text-lg text-muted">{bi(lang, GALLERY.intro)}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-[1.25fr_1fr_1fr] md:grid-rows-[220px_220px]">
          {GALLERY.images.map((img, i) => (
            <div
              key={img.id}
              className={`relative h-44 overflow-hidden bg-mist md:h-auto ${i === 0 ? 'col-span-2 h-56 md:col-span-1 md:row-span-2' : ''}`}
            >
              <Image
                src={unsplash(img.id, img.w)}
                alt={bi(lang, img.alt)}
                fill
                sizes={i === 0 ? '(min-width: 768px) 40vw, 100vw' : '(min-width: 768px) 30vw, 50vw'}
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
