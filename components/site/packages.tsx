import type { Pkg } from '@/db/schema';
import { PACKAGES } from '@/lib/content';
import { bi, type Locale } from '@/lib/i18n';
import PackageBrowser from './package-browser';

export default function Packages({ lang, packages, whatsapp }: { lang: Locale; packages: Pkg[]; whatsapp: string }) {
  return (
    <section id="packages" className="px-3 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-haram md:text-5xl">{bi(lang, PACKAGES.title)}</h2>
          <p className="mt-4 text-lg text-muted">{bi(lang, PACKAGES.intro)}</p>
        </div>
        <PackageBrowser packages={packages} whatsapp={whatsapp} />
        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">{bi(lang, PACKAGES.disclaimer)}</p>
      </div>
    </section>
  );
}
