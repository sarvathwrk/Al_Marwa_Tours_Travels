/** Admin menu: one entry per sidebar item, with optional submenu. Hrefs use the `?tab=` scheme the page reads. */

export type IconName = 'dashboard' | 'customers' | 'inbox' | 'website' | 'settings';

export type NavLeaf = {
  label: string;
  tab: string;
  /** Customers submenu filters by type, the enquiries submenu by status. */
  type?: string;
  status?: string;
  badge?: 'newEnquiries';
};

export type NavItem = { label: string; icon: IconName; tab?: string; children?: NavLeaf[] };

export const NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', tab: 'dashboard' },
  {
    label: 'Customers',
    icon: 'customers',
    children: [
      { label: 'All customers', tab: 'customers' },
      { label: 'Umrah', tab: 'customers', type: 'umrah' },
      { label: 'Hajj', tab: 'customers', type: 'hajj' },
      { label: 'Ziyarah', tab: 'customers', type: 'ziyarah' },
      { label: 'Groups', tab: 'groups' },
    ],
  },
  {
    label: 'Inbox',
    icon: 'inbox',
    children: [
      { label: 'All enquiries', tab: 'enquiries' },
      { label: 'New', tab: 'enquiries', status: 'new', badge: 'newEnquiries' },
      { label: 'Contacted', tab: 'enquiries', status: 'contacted' },
      { label: 'Closed', tab: 'enquiries', status: 'closed' },
      { label: 'Newsletter', tab: 'newsletter' },
    ],
  },
  {
    label: 'Website',
    icon: 'website',
    children: [
      { label: 'Packages', tab: 'packages' },
      { label: 'Offers popup', tab: 'offers' },
      { label: 'Gallery', tab: 'gallery' },
      { label: 'Numbers', tab: 'numbers' },
      { label: 'Reviews', tab: 'reviews' },
      { label: 'FAQ', tab: 'faq' },
      { label: 'Founder', tab: 'founder' },
    ],
  },
  {
    label: 'Settings',
    icon: 'settings',
    children: [
      { label: 'Contact details', tab: 'contact' },
      { label: 'Account', tab: 'account' },
    ],
  },
];

export const TAB_IDS = NAV.flatMap((i) => (i.tab ? [i.tab] : (i.children ?? []).map((c) => c.tab)));

export const leafHref = (l: NavLeaf) => {
  const q = new URLSearchParams({ tab: l.tab });
  if (l.type) q.set('type', l.type);
  if (l.status) q.set('status', l.status);
  return `/admin?${q.toString()}`;
};

export type NavState = { tab: string; type?: string; status?: string };

export function isActive(l: { tab?: string; type?: string; status?: string }, s: NavState) {
  if (l.tab !== s.tab) return false;
  if (s.tab === 'customers') return (l.type ?? '') === (s.type ?? '');
  if (s.tab === 'enquiries') return (l.status ?? '') === (s.status ?? '');
  return true;
}

export type Crumb = { label: string; href?: string };

/** "Admin / Customers / Umrah" for the top bar; every step except the current page links back. */
export function breadcrumb(s: NavState): Crumb[] {
  const home: Crumb = { label: 'Admin', href: '/admin?tab=dashboard' };
  for (const item of NAV) {
    if (item.tab && isActive(item, s)) return [home, { label: item.label }];
    const leaf = item.children?.find((c) => isActive(c, s));
    const first = item.children?.[0];
    if (leaf && first) return [home, { label: item.label, href: leafHref(first) }, { label: leaf.label }];
  }
  return [home, { label: 'Dashboard' }];
}
