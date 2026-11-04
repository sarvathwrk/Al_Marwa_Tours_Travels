'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Offer } from '@/db/schema';
import { OFFERS_UI } from '@/lib/content';
import { bi, tr } from '@/lib/i18n';
import { X } from 'lucide-react';
import { useLang } from './lang';

const SNOOZE_KEY = 'am_offers_snooze_until';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export default function OfferPopup({ offers }: { offers: Offer[] }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [snooze, setSnooze] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasOffers = offers.length > 0;

  useEffect(() => {
    if (!hasOffers) return;
    try {
      if (Number(localStorage.getItem(SNOOZE_KEY)) > Date.now()) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, [hasOffers]);

  const close = useCallback(() => {
    if (snooze) {
      try {
        localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
      } catch {}
    }
    setOpen(false);
  }, [snooze]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="offers-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-haram to-haram-2 px-6 py-4 text-white">
          <h2 id="offers-title" className="font-display text-2xl font-bold">
            {bi(lang, OFFERS_UI.heading)}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={bi(lang, OFFERS_UI.close)}
            className="grid size-9 place-items-center rounded-full hover:bg-white/15"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="hizam" aria-hidden />

        <ul className="max-h-[50vh] divide-y divide-line overflow-y-auto px-6">
          {offers.map((o) => (
            <li key={o.id} className="py-4">
              <h3 className="font-bold text-haram">{tr(lang, o.titleEn, o.titleTa)}</h3>
              {(o.bodyEn || o.bodyTa) && <p className="mt-1 text-[15px] text-muted">{tr(lang, o.bodyEn, o.bodyTa)}</p>}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={snooze} onChange={(e) => setSnooze(e.target.checked)} className="size-4 accent-[#0f3d33]" />
            {bi(lang, OFFERS_UI.snooze)}
          </label>
          <Link
            href={`/${lang}#packages`}
            onClick={close}
            className="rounded-full bg-haram px-6 py-2.5 text-sm font-semibold text-white hover:bg-haram-2"
          >
            {bi(lang, OFFERS_UI.cta)}
          </Link>
        </div>
      </div>
    </div>
  );
}
