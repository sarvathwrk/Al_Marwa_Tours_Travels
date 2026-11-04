'use client';

import { useMemo, useState } from 'react';
import type { Pkg } from '@/db/schema';
import { PACKAGES } from '@/lib/content';
import { formatInr, PACKAGE_KIND_LABEL, PACKAGE_KINDS, type PackageKind } from '@/lib/constants';
import { bi, tr } from '@/lib/i18n';
import { waLink } from '@/lib/images';
import { Check } from 'lucide-react';
import { WhatsApp } from './icons';
import { useLang } from './lang';

export default function PackageBrowser({ packages, whatsapp }: { packages: Pkg[]; whatsapp: string }) {
  const { lang } = useLang();
  const [kind, setKind] = useState<'all' | PackageKind>('all');

  const kinds = useMemo(() => PACKAGE_KINDS.filter((k) => packages.some((p) => p.kind === k)), [packages]);
  const visible = kind === 'all' ? packages : packages.filter((p) => p.kind === kind);

  if (packages.length === 0) {
    return (
      <div className="mt-12 border border-dashed border-line p-10 text-center">
        <p className="mx-auto max-w-md text-muted">{bi(lang, PACKAGES.empty)}</p>
        <a
          href={waLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full bg-haram px-6 py-3 font-semibold text-white"
        >
          {bi(lang, PACKAGES.whatsapp)}
        </a>
      </div>
    );
  }

  return (
    <>
      {kinds.length > 1 && (
        <div role="tablist" aria-label="Package type" className="mt-10 flex flex-wrap gap-2">
          {(['all', ...kinds] as const).map((k) => {
            const selected = kind === k;
            return (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setKind(k)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-haram bg-haram text-white'
                    : 'border-line bg-white text-haram hover:border-haram'
                }`}
              >
                {k === 'all' ? bi(lang, PACKAGES.all) : bi(lang, PACKAGE_KIND_LABEL[k])}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const name = tr(lang, p.nameEn, p.nameTa);
          const features = lang === 'ta' && p.featuresTa.length ? p.featuresTa : p.featuresEn;
          const dark = p.featured;
          return (
            <article
              key={p.id}
              className={`flex flex-col rounded-[1.75rem] p-8 ${
                dark ? 'border border-gold bg-haram text-white shadow-[0_24px_60px_-24px_rgba(15,61,51,.6)]' : 'border border-line bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className={dark ? 'text-gold' : 'text-gold-deep'}>{bi(lang, PACKAGE_KIND_LABEL[p.kind])}</span>
                {dark ? (
                  <span className="rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-kiswa">{bi(lang, PACKAGES.popular)}</span>
                ) : p.duration ? (
                  <span className="text-muted">{p.duration}</span>
                ) : null}
              </div>
              <h3 className={`mt-3 font-display text-3xl font-bold leading-tight ${dark ? 'text-white' : 'text-haram'}`}>{name}</h3>
              {dark && p.duration && <p className="mt-1 text-sm text-white/70">{p.duration}</p>}
              {(p.taglineEn || p.taglineTa) && (
                <p className={`mt-3 text-[15px] ${dark ? 'text-white/75' : 'text-muted'}`}>{tr(lang, p.taglineEn, p.taglineTa)}</p>
              )}

              <div className={`mt-6 border-t pt-5 ${dark ? 'border-white/15' : 'border-line'}`}>
                {p.priceInr != null ? (
                  <>
                    <p className={`text-sm ${dark ? 'text-white/65' : 'text-muted'}`}>{bi(lang, PACKAGES.startingFrom)}</p>
                    <p className={`font-display text-4xl font-bold ${dark ? 'text-gold' : 'text-gold-deep'}`}>{formatInr(p.priceInr)}</p>
                  </>
                ) : (
                  <p className={`font-display text-2xl font-bold ${dark ? 'text-gold' : 'text-gold-deep'}`}>{bi(lang, PACKAGES.enquirePrice)}</p>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5 text-[15px]">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`mt-1 size-4 shrink-0 ${dark ? 'text-gold' : 'text-gold-deep'}`} />
                    <span className={dark ? 'text-white/85' : 'text-ink'}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={waLink(whatsapp, bi(lang, PACKAGES.waMessage(name)))}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${
                  dark ? 'bg-gold text-kiswa hover:bg-[#d9bd88]' : 'bg-haram text-white hover:bg-haram-2'
                }`}
              >
                <WhatsApp className="size-5" />
                {bi(lang, PACKAGES.whatsapp)}
              </a>
            </article>
          );
        })}
      </div>
    </>
  );
}
