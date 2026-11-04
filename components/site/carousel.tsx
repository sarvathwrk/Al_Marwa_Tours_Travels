'use client';

import { useRef, type ReactNode } from 'react';
import { GALLERY_UI } from '@/lib/content';
import { bi } from '@/lib/i18n';
import { useLang } from './lang';

/** Scroll-snap row with round previous / next buttons. Children should be `shrink-0 snap-start`. */
export default function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const { lang } = useLang();
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  };

  const round = 'grid size-11 place-items-center rounded-full border transition-colors';
  return (
    <div>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={bi(lang, GALLERY_UI.prev)}
          className={`${round} border-haram text-haram hover:bg-haram hover:text-white`}
        >
          <Arrow className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={bi(lang, GALLERY_UI.next)}
          className={`${round} border-haram bg-haram text-white hover:bg-haram-2`}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`size-5 ${className ?? ''}`}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
