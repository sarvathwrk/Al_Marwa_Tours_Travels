import { CircleHelp, ExternalLink, Hash, Images, Inbox, KeyRound, LogOut, Mail, Megaphone, Package, Phone, Star, User } from 'lucide-react';
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
      { id: 'enquiries', label: 'Enquiries', icon: Inbox },
      { id: 'newsletter', label: 'Newsletter', icon: Mail },
    ],
  },
  {
    label: 'Website content',
    tabs: [
      { id: 'packages', label: 'Packages', icon: Package },
      { id: 'offers', label: 'Offers popup', icon: Megaphone },
      { id: 'gallery', label: 'Gallery', icon: Images },
      { id: 'numbers', label: 'Numbers', icon: Hash },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: CircleHelp },
      { id: 'founder', label: 'Founder', icon: User },
    ],
  },
  {
    label: 'Settings',
    tabs: [
      { id: 'contact', label: 'Contact details', icon: Phone },
      { id: 'account', label: 'Account', icon: KeyRound },
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
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 py-2 text-white/80 hover:text-gold">
              View website
              <ExternalLink aria-hidden className="size-3.5" />
            </Link>
            <span className="hidden text-white/50 sm:inline">Signed in as {session.username}</span>
            <form action={logout}>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-1.5 font-semibold hover:border-gold hover:text-gold">
                <LogOut aria-hidden className="size-3.5" />
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
                  <span className="flex items-center gap-2.5">
                    <t.icon aria-hidden className="size-4 shrink-0" />
                    {t.label}
                  </span>
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
