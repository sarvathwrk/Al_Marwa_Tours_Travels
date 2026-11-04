'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { submitEnquiry } from '@/app/[lang]/actions';
import { CONTACT } from '@/lib/content';
import { ENQUIRY_INTEREST_LABEL, ENQUIRY_INTERESTS } from '@/lib/constants';
import { idleState, type FormState } from '@/lib/form';
import { bi } from '@/lib/i18n';
import { waLink } from '@/lib/images';
import { Check, Chat } from './icons';
import { useLang } from './lang';

const input =
  'w-full rounded-xl border border-transparent bg-mist px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold focus:bg-white aria-[invalid=true]:border-red-500';

/** Saves the enquiry to the database, then offers to continue the conversation on WhatsApp. */
export default function EnquiryForm({ whatsapp }: { whatsapp: string }) {
  const [round, setRound] = useState(0);
  return <EnquiryRound key={round} whatsapp={whatsapp} onAnother={() => setRound((r) => r + 1)} />;
}

function EnquiryRound({ whatsapp, onAnother }: { whatsapp: string; onAnother: () => void }) {
  const { lang } = useLang();
  const f = CONTACT.form;
  const [state, action, pending] = useActionState(submitEnquiry, idleState);

  if (state.status === 'success') {
    const v = state.fields ?? {};
    const interest = ENQUIRY_INTERESTS.find((i) => i === v.interest);
    const L = f.labels;
    const message = [
      bi(lang, f.waIntro),
      `${bi(lang, L.name)}: ${v.name ?? ''}`,
      `${bi(lang, L.mobile)}: ${v.phone ?? ''}`,
      `${bi(lang, L.interest)}: ${interest ? bi(lang, ENQUIRY_INTEREST_LABEL[interest]) : ''}`,
      `${bi(lang, L.travellers)}: ${v.travellers || bi(lang, L.notSpecified)}`,
      `${bi(lang, L.message)}: ${v.message || bi(lang, L.shareDetails)}`,
    ].join('\n');

    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 p-2 md:p-4" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-sage text-haram">
          <Check className="size-7" />
        </span>
        <h3 className="font-display text-3xl font-bold text-haram">{bi(lang, f.successTitle)}</h3>
        {state.message && <p className="text-muted">{state.message}</p>}
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href={waLink(whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-haram px-6 py-3 font-semibold text-white hover:bg-haram-2"
          >
            <Chat className="size-5" />
            {bi(lang, f.waContinue)}
          </a>
          <button type="button" onClick={onAnother} className="rounded-full border border-haram px-6 py-3 font-semibold text-haram hover:bg-mist">
            {bi(lang, f.another)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="lang" value={lang} />
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field state={state} name="name" label={bi(lang, f.name)}>
          {(p) => <input {...p} required maxLength={80} autoComplete="name" placeholder={bi(lang, f.namePh)} />}
        </Field>
        <Field state={state} name="phone" label={bi(lang, f.phone)}>
          {(p) => <input {...p} required type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="+91" />}
        </Field>
        <Field state={state} name="email" label={bi(lang, f.email)}>
          {(p) => <input {...p} type="email" maxLength={120} autoComplete="email" />}
        </Field>
        <Field state={state} name="interest" label={bi(lang, f.interest)}>
          {(p) => (
            <select {...p} defaultValue={state.fields?.interest ?? 'umrah'}>
              {ENQUIRY_INTERESTS.map((i) => (
                <option key={i} value={i}>
                  {bi(lang, ENQUIRY_INTEREST_LABEL[i])}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field state={state} name="travellers" label={bi(lang, f.travellers)}>
          {(p) => <input {...p} type="number" inputMode="numeric" min={1} max={500} placeholder={bi(lang, f.travellersPh)} />}
        </Field>
        <Field state={state} name="message" label={bi(lang, f.message)} className="sm:col-span-2">
          {(p) => <textarea {...p} rows={4} maxLength={600} placeholder={bi(lang, f.messagePh)} className={`${p.className} resize-y`} />}
        </Field>
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-haram px-8 py-3.5 font-semibold text-white transition-colors hover:bg-haram-2 disabled:opacity-60"
      >
        {pending ? bi(lang, f.sending) : bi(lang, f.submit)}
      </button>
      <p className="-mt-1 text-xs text-muted">{bi(lang, f.note)}</p>
    </form>
  );
}

type ControlProps = { name: string; defaultValue: string; className: string; 'aria-invalid': boolean; id: string };

function Field({
  state,
  name,
  label,
  className,
  children,
}: {
  state: FormState;
  name: string;
  label: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const value = state.fields?.[name] ?? '';
  const error = state.errors?.[name]?.[0];
  return (
    <div className={`grid gap-1.5 ${className ?? ''}`}>
      <label htmlFor={`enq-${name}`} className="text-sm font-semibold text-haram">
        {label}
      </label>
      {/* key = value so what the visitor typed survives a validation error */}
      <div key={value}>{children({ name, id: `enq-${name}`, defaultValue: value, className: input, 'aria-invalid': !!error })}</div>
      {error && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
