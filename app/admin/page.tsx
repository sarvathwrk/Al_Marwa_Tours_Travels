import { Suspense } from 'react';
import AdminShell from '@/components/admin/shell';
import { TabSkeleton } from '@/components/admin/skeleton';
import { CustomersTab, GroupsTab } from '@/components/admin/customers';
import { DashboardTab } from '@/components/admin/dashboard';
import { TAB_IDS } from '@/components/admin/nav';
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
import { ENQUIRY_STATUSES } from '@/lib/constants';
import { countNewEnquiries } from '@/lib/data';
import { requireAdmin } from '@/lib/session';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const rawTab = one(sp.tab);
  const tab = TAB_IDS.find((t) => t === rawTab) ?? 'dashboard';
  const q = one(sp.q);
  const type = one(sp.type);
  const status = one(sp.status);
  const group = one(sp.group);
  const fromEnquiry = one(sp.fromEnquiry);
  const newCount = await countNewEnquiries();

  return (
    <AdminShell state={{ tab, type, status }} newCount={newCount} username={session.username}>
      {/* Keyed so that switching tab or filter shows a skeleton straight away while the new data loads. */}
      <Suspense key={[tab, q, type, status, group, fromEnquiry].join('|')} fallback={<TabSkeleton />}>
        {tab === 'dashboard' && <DashboardTab username={session.username} />}
        {tab === 'customers' && <CustomersTab q={q} status={status} type={type} group={group} fromEnquiry={fromEnquiry} />}
        {tab === 'groups' && <GroupsTab />}
        {tab === 'enquiries' && <EnquiriesTab status={ENQUIRY_STATUSES.find((s) => s === status)} />}
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
      </Suspense>
    </AdminShell>
  );
}
