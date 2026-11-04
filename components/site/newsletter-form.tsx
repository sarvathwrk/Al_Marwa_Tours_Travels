'use client';

import { useActionState } from 'react';
import { subscribe } from '@/app/[lang]/actions';
import { NEWSLETTER_UI } from '@/lib/content';
import { idleState } from '@/lib/form';
import { bi } from '@/lib/i18n';
import { useLang } from './lang';

export default function NewsletterForm() {
  const { lang } = useLang();
  const [state, action, pending] = useActionState(subscribe, idleState);
  const error = state.errors?.email?.[0] ?? (state.status === 'error' ? state.message : undefined);

  return (
    <form action={action} noValidate className="grid gap-3">
      <input type="hidden" name="lang" value={lang} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="newsletter-email" className="sr-only">
        {bi(lang, NEWSLETTER_UI.title)}
      </label>
      <input
        key={state.fields?.email ?? ''}
        id="newsletter-email"
        name="email"
        type="email"
        required
        maxLength={120}
        autoComplete="email"
        defaultValue={state.fields?.email ?? ''}
        placeholder={bi(lang, NEWSLETTER_UI.placeholder)}
        aria-invalid={!!error}
        className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/50 focus:border-gold aria-[invalid=true]:border-red-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-6 py-3 font-semibold text-kiswa transition-colors hover:bg-[#d9bd88] disabled:opacity-60"
      >
        {pending ? bi(lang, NEWSLETTER_UI.sending) : bi(lang, NEWSLETTER_UI.submit)}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {state.status === 'success' && state.message && (
        <p role="status" className="text-sm text-gold">
          {state.message}
        </p>
      )}
    </form>
  );
}
