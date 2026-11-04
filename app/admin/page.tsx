import Link from 'next/link';
import { AccountForm, DeleteOfferForm, DeletePackageForm, OfferForm, PackageForm, SettingsForm } from '@/components/admin/forms';
import { formatInr, PACKAGE_KIND_LABEL } from '@/lib/constants';
import { getOffers, getPackages, getSettings } from '@/lib/data';
import { requireAdmin } from '@/lib/session';
import { logout } from './actions';

const TABS = [
  { id: 'packages', label: 'Packages' },
  { id: 'offers', label: 'Offers popup' },
  { id: 'contact', label: 'Contact details' },
  { id: 'account', label: 'Account' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const panel = 'rounded-2xl bg-white p-6 shadow-sm shadow-black/5 md:p-8';
const badge = 'rounded-full px-2.5 py-0.5 text-xs font-semibold';

export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  const session = await requireAdmin();
  const { tab: rawTab } = await searchParams;
  const tab: TabId = TABS.find((t) => t.id === rawTab)?.id ?? 'packages';

  return (
    <div className="min-h-svh">
      <header className="bg-kiswa text-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.16em]">AL MARWA</p>
            <p className="text-xs text-gold">Website admin</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-white/80 hover:text-gold">
              View website ↗
            </Link>
            <span className="hidden text-white/50 sm:inline">Signed in as {session.username}</span>
            <form action={logout}>
              <button type="submit" className="rounded-full border border-white/30 px-4 py-1.5 font-semibold hover:border-gold hover:text-gold">
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="hizam" aria-hidden />
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/admin?tab=${t.id}`}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? 'bg-haram text-white' : 'bg-white text-haram hover:bg-white/70'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-6">
          {tab === 'packages' && <PackagesTab />}
          {tab === 'offers' && <OffersTab />}
          {tab === 'contact' && <ContactTab />}
          {tab === 'account' && (
            <section className={panel}>
              <h1 className="font-display text-3xl font-bold text-haram">Account</h1>
              <p className="mb-6 mt-1 text-sm text-muted">Your username and password are stored in the database. Changing the password signs out other devices.</p>
              <AccountForm username={session.username} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

async function PackagesTab() {
  const packages = await getPackages({ includeInactive: true });
  return (
    <>
      <section className={panel}>
        <h1 className="font-display text-3xl font-bold text-haram">Packages</h1>
        <p className="mt-1 text-sm text-muted">Edit prices in rupees (₹). Changes appear on the website within a few seconds, in English and Tamil.</p>
      </section>

      {packages.map((p) => (
        <details key={p.id} className={`${panel} group`}>
          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-xl font-bold text-haram">{p.nameEn}</span>
            <span className={`${badge} bg-mist text-haram`}>{PACKAGE_KIND_LABEL[p.kind].en}</span>
            {p.featured && <span className={`${badge} bg-gold/25 text-gold-deep`}>Popular</span>}
            {!p.active && <span className={`${badge} bg-red-50 text-red-700`}>Hidden</span>}
            <span className="ml-auto text-sm font-semibold text-gold-deep">{p.priceInr != null ? formatInr(p.priceInr) : 'Enquire for price'}</span>
          </summary>
          <div className="mt-6 border-t border-line pt-6">
            <PackageForm pkg={p} />
            <DeletePackageForm id={p.id} />
          </div>
        </details>
      ))}

      <details className={panel} open={packages.length === 0}>
        <summary className="cursor-pointer font-display text-xl font-bold text-haram">+ Add a package</summary>
        <div className="mt-6 border-t border-line pt-6">
          <PackageForm />
        </div>
      </details>
    </>
  );
}

async function OffersTab() {
  const offers = await getOffers({ includeInactive: true });
  return (
    <>
      <section className={panel}>
        <h1 className="font-display text-3xl font-bold text-haram">Offers popup</h1>
        <p className="mt-1 text-sm text-muted">
          Active offers appear in a “Latest offers &amp; updates” popup when visitors open the site. With no active offers, no popup is shown.
        </p>
      </section>

      {offers.map((o) => (
        <details key={o.id} className={panel}>
          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-xl font-bold text-haram">{o.titleEn}</span>
            {!o.active && <span className={`${badge} bg-red-50 text-red-700`}>Hidden</span>}
          </summary>
          <div className="mt-6 border-t border-line pt-6">
            <OfferForm offer={o} />
            <DeleteOfferForm id={o.id} />
          </div>
        </details>
      ))}

      <details className={panel} open={offers.length === 0}>
        <summary className="cursor-pointer font-display text-xl font-bold text-haram">+ Add an offer</summary>
        <div className="mt-6 border-t border-line pt-6">
          <OfferForm />
        </div>
      </details>
    </>
  );
}

async function ContactTab() {
  const settings = await getSettings();
  return (
    <section className={panel}>
      <h1 className="font-display text-3xl font-bold text-haram">Contact details</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Shown in the header buttons, contact section, footer and every WhatsApp link.</p>
      <SettingsForm settings={settings} />
    </section>
  );
}
