'use client';

import type { FormEvent } from 'react';
import { CONTACT } from '@/lib/content';
import { bi } from '@/lib/i18n';
import { waLink } from '@/lib/images';
import { Chat } from './icons';
import { useLang } from './lang';

const input =
  'w-full rounded-md border border-line bg-white px-3.5 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold';

export default function EnquiryForm({ whatsapp }: { whatsapp: string }) {
  const { lang } = useLang();
  const f = CONTACT.form;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const interest = f.interests.find((i) => i.value === get('interest'));
    const L = f.labels;
    const message = [
      bi(lang, f.waIntro),
      `${bi(lang, L.name)}: ${get('name')}`,
      `${bi(lang, L.mobile)}: ${get('phone')}`,
      `${bi(lang, L.interest)}: ${interest ? bi(lang, interest.label) : get('interest')}`,
      `${bi(lang, L.travellers)}: ${get('travellers') || bi(lang, L.notSpecified)}`,
      `${bi(lang, L.message)}: ${get('message') || bi(lang, L.shareDetails)}`,
    ].join('\n');
    window.open(waLink(whatsapp, message), '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-white p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-haram">
          {bi(lang, f.name)}
          <input name="name" required maxLength={80} autoComplete="name" placeholder={bi(lang, f.namePh)} className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-haram">
          {bi(lang, f.phone)}
          <input name="phone" required type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="+91" className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-haram">
          {bi(lang, f.interest)}
          <select name="interest" className={input} defaultValue="Umrah">
            {f.interests.map((i) => (
              <option key={i.value} value={i.value}>
                {bi(lang, i.label)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-haram">
          {bi(lang, f.travellers)}
          <input name="travellers" type="number" min={1} max={500} placeholder={bi(lang, f.travellersPh)} className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-haram sm:col-span-2">
          {bi(lang, f.message)}
          <textarea name="message" rows={4} maxLength={600} placeholder={bi(lang, f.messagePh)} className={`${input} resize-y`} />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-haram px-6 py-3.5 font-semibold text-white transition-colors hover:bg-haram-2"
      >
        <Chat className="size-5" />
        {bi(lang, f.submit)}
      </button>
      <p className="mt-3 text-xs text-muted">{bi(lang, f.note)}</p>
    </form>
  );
}
