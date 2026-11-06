import 'server-only';
import { asc, count, desc, eq, isNotNull, sql } from 'drizzle-orm';
import {
  customers,
  enquiries,
  faqs,
  founder,
  galleryItems,
  offers,
  packages,
  siteSettings,
  stats,
  subscribers,
  testimonials,
  travelGroups,
  type Customer,
  type Enquiry,
  type Faq,
  type Founder,
  type GalleryItem,
  type Offer,
  type Pkg,
  type SiteSettings,
  type Stat,
  type Subscriber,
  type Testimonial,
  type TravelGroup,
} from '@/db/schema';
import { db, type Db } from './db';

export type PublicSettings = Omit<SiteSettings, 'id' | 'updatedAt'>;

export const DEFAULT_SETTINGS: PublicSettings = {
  phoneDisplay: '+91 99435 15474',
  whatsapp: '919943515474',
  email: 'almarwatours5@gmail.com',
  addressEn: 'Tamil Nadu, India',
  addressTa: 'தமிழ்நாடு, இந்தியா',
  hoursEn: 'Contact us for current working hours',
  hoursTa: 'அலுவலக நேரத்திற்கு எங்களைத் தொடர்புகொள்ளவும்',
  instagram: '',
  facebook: '',
  latitude: null,
  longitude: null,
};

// The public site must never crash because the database is down or not migrated yet.
async function safe<T>(label: string, run: (d: Db) => Promise<T>, fallback: T): Promise<T> {
  if (!db) return fallback;
  try {
    return await run(db);
  } catch (err) {
    console.error(`[data] ${label} failed:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

export function getPackages(opts: { includeInactive?: boolean } = {}): Promise<Pkg[]> {
  return safe(
    'getPackages',
    (d) =>
      d
        .select()
        .from(packages)
        .where(opts.includeInactive ? undefined : eq(packages.active, true))
        .orderBy(asc(packages.sort), asc(packages.id)),
    [],
  );
}

export function getOffers(opts: { includeInactive?: boolean } = {}): Promise<Offer[]> {
  return safe(
    'getOffers',
    (d) =>
      d
        .select()
        .from(offers)
        .where(opts.includeInactive ? undefined : eq(offers.active, true))
        .orderBy(asc(offers.sort), asc(offers.id)),
    [],
  );
}

export function getSettings(): Promise<PublicSettings> {
  return safe(
    'getSettings',
    async (d) => {
      const [row] = await d.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
      if (!row) return DEFAULT_SETTINGS;
      const { id: _id, updatedAt: _updatedAt, ...rest } = row;
      return rest;
    },
    DEFAULT_SETTINGS,
  );
}

// ---------- generic helpers for "sorted list" tables ----------

type Listing = { includeInactive?: boolean };

export const getStats = (o: Listing = {}): Promise<Stat[]> =>
  safe('getStats', (d) => d.select().from(stats).where(o.includeInactive ? undefined : eq(stats.active, true)).orderBy(asc(stats.sort), asc(stats.id)), []);

export const getGallery = (o: Listing = {}): Promise<GalleryItem[]> =>
  safe(
    'getGallery',
    (d) => d.select().from(galleryItems).where(o.includeInactive ? undefined : eq(galleryItems.active, true)).orderBy(asc(galleryItems.sort), asc(galleryItems.id)),
    [],
  );

export const getTestimonials = (o: Listing = {}): Promise<Testimonial[]> =>
  safe(
    'getTestimonials',
    (d) => d.select().from(testimonials).where(o.includeInactive ? undefined : eq(testimonials.active, true)).orderBy(asc(testimonials.sort), asc(testimonials.id)),
    [],
  );

export const getFaqs = (o: Listing = {}): Promise<Faq[]> =>
  safe('getFaqs', (d) => d.select().from(faqs).where(o.includeInactive ? undefined : eq(faqs.active, true)).orderBy(asc(faqs.sort), asc(faqs.id)), []);

export const getFounder = (o: Listing = {}): Promise<Founder | null> =>
  safe(
    'getFounder',
    async (d) => {
      const [row] = await d.select().from(founder).where(eq(founder.id, 1)).limit(1);
      if (!row) return null;
      return o.includeInactive || row.active ? row : null;
    },
    null,
  );

// ---------- admin inbox ----------

export const getEnquiries = (): Promise<Enquiry[]> =>
  safe('getEnquiries', (d) => d.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(300), []);

export const getSubscribers = (): Promise<Subscriber[]> =>
  safe('getSubscribers', (d) => d.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(1000), []);

export const countNewEnquiries = (): Promise<number> =>
  safe(
    'countNewEnquiries',
    async (d) => {
      const [row] = await d.select({ n: count() }).from(enquiries).where(eq(enquiries.status, 'new'));
      return row?.n ?? 0;
    },
    0,
  );

// ---------- customers (admin only) ----------

export type CustomerWithGroup = Customer & { group: TravelGroup };

/** Groups with the earliest departure first; groups without a date come last. */
export const getGroups = (): Promise<TravelGroup[]> =>
  safe('getGroups', (d) => d.select().from(travelGroups).orderBy(sql`${travelGroups.departureDate} asc nulls last`, asc(travelGroups.name)), []);

export const getCustomers = (): Promise<CustomerWithGroup[]> =>
  safe(
    'getCustomers',
    async (d) => {
      const rows = await d.select().from(customers).innerJoin(travelGroups, eq(customers.groupId, travelGroups.id)).orderBy(desc(customers.createdAt)).limit(2000);
      return rows.map((r) => ({ ...r.customers, group: r.travel_groups }));
    },
    [],
  );

export const getEnquiry = (id: number): Promise<Enquiry | null> =>
  safe(
    'getEnquiry',
    async (d) => {
      const [row] = await d.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
      return row ?? null;
    },
    null,
  );

/** Enquiries that already became a customer (so the inbox can show "In customers"). */
export const getLinkedEnquiryIds = (): Promise<Set<number>> =>
  safe(
    'getLinkedEnquiryIds',
    async (d) => {
      const rows = await d.select({ id: customers.enquiryId }).from(customers).where(isNotNull(customers.enquiryId));
      return new Set(rows.map((r) => r.id as number));
    },
    new Set<number>(),
  );
