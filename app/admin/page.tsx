import Link from 'next/link';
import {
  AccountTab,
  ContactTab,
  EnquiriesTab,
  FaqTab,
  FounderTab,
  GalleryTab,
  NumbersTab,
  OffersTab,
  PackagesTab,
  ReviewsTab,
  SubscribersTab,
} from '@/components/admin/tabs';
import { countNewEnquiries } from '@/lib/data';
import { requireAdmin } from '@/lib/session';
import { logout } from './actions';

const GROUPS = [
  {
    label: 'Inbox',
    tabs: [
      { id: 'enquiries', label: 'Enquiries' },
      { id: 'newsletter', label: 'Newsletter' },
    ],
  },
  {
    label: 'Website content',
    tabs: [
      { id: 'packages', label: 'Packages' },
      { id: 'offers', label: 'Offers popup' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'numbers', label: 'Numbers' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'faq', label: 'FAQ' },
      { id: 'founder', label: 'Founder' },
    ],
  },
  {
    label: 'Settings',
    tabs: [
      { id: 'contact', label: 'Contact details' },
      { id: 'account', label: 'Account' },
    ],
  },
] as const;

type TabId = (typeof GROUPS)[number]['tabs'][number]['id'];
const ALL_TABS: TabId[] = GROUPS.flatMap((g) => g.tabs.map((t) => t.id));

export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  const session = await requireAdmin();
  const { tab: rawTab } = await searchParams;
  const tab: TabId = ALL_TABS.find((t) => t === rawTab) ?? 'enquiries';
  const newCount = await countNewEnquiries();

  return (
    <div className="min-h-svh">
      <header className="bg-kiswa text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
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

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-6 lg:flex-col lg:self-start lg:overflow-visible">
          {GROUPS.map((g) => (
            <div key={g.label} className="flex gap-2 lg:mb-4 lg:flex-col lg:gap-1">
              <p className="hidden px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted lg:block">{g.label}</p>
              {g.tabs.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin?tab=${t.id}`}
                  aria-current={tab === t.id ? 'page' : undefined}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors lg:rounded-xl ${
                    tab === t.id ? 'bg-haram text-white' : 'bg-white text-haram hover:bg-white/70'
                  }`}
                >
                  {t.label}
                  {t.id === 'enquiries' && newCount > 0 && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-kiswa" aria-label={`${newCount} new`}>
                      {newCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <main className="grid min-w-0 content-start gap-6">
          {tab === 'enquiries' && <EnquiriesTab />}
          {tab === 'newsletter' && <SubscribersTab />}
          {tab === 'packages' && <PackagesTab />}
          {tab === 'offers' && <OffersTab />}
          {tab === 'gallery' && <GalleryTab />}
          {tab === 'numbers' && <NumbersTab />}
          {tab === 'reviews' && <ReviewsTab />}
          {tab === 'faq' && <FaqTab />}
          {tab === 'founder' && <FounderTab />}
          {tab === 'contact' && <ContactTab />}
          {tab === 'account' && <AccountTab username={session.username} />}
        </main>
      </div>
    </div>
  );
}
