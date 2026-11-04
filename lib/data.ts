import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { offers, packages, siteSettings, type Offer, type Pkg, type SiteSettings } from '@/db/schema';
import { db, type Db } from './db';

export type PublicSettings = Omit<SiteSettings, 'id' | 'updatedAt'>;

export const DEFAULT_SETTINGS: PublicSettings = {
  phoneDisplay: '+91 99435 15474',
  whatsapp: '919943515474',
  email: '',
  addressEn: 'Tamil Nadu, India',
  addressTa: 'தமிழ்நாடு, இந்தியா',
  hoursEn: 'Contact us for current working hours',
  hoursTa: 'அலுவலக நேரத்திற்கு எங்களைத் தொடர்புகொள்ளவும்',
  instagram: '',
  facebook: '',
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
