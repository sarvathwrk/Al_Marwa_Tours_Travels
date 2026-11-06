import type { Customer } from '@/db/schema';
import type { CustomerStatus } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' });

/** "2027-03-15" (a calendar date, no time zone) -> "15 Mar 2027". */
export const fmtDate = (d: string | null) => (d ? dateFmt.format(new Date(`${d}T00:00:00Z`)) : '');

/** Today's calendar date in India, as YYYY-MM-DD. */
export const todayIST = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

export const daysUntil = (d: string) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${todayIST()}T00:00:00Z`)) / 86_400_000);

export const STATUS_STYLE: Record<CustomerStatus, string> = {
  applied: 'bg-gold/25 text-gold-deep',
  documents: 'bg-sky-100 text-sky-900',
  confirmed: 'bg-sage text-haram',
  completed: 'bg-haram text-white',
  cancelled: 'bg-mist text-muted',
};

/** Money still to collect (never negative). */
export const dueAmount = (c: Pick<Customer, 'totalAmount' | 'paidAmount'>) => Math.max(0, (c.totalAmount ?? 0) - c.paidAmount);

/** Saudi Arabia expects a passport valid for at least 6 months beyond the travel date (taken from the customer's group). */
export function passportRisk(c: { passportExpiry: string | null; group: { departureDate: string | null } }) {
  if (!c.passportExpiry || !c.group.departureDate) return false;
  const limit = new Date(`${c.group.departureDate}T00:00:00Z`);
  limit.setUTCMonth(limit.getUTCMonth() + 6);
  return c.passportExpiry < limit.toISOString().slice(0, 10);
}

/** Digits for a wa.me link; bare 10-digit Indian numbers get the 91 country code. */
export function waDigits(c: Pick<Customer, 'whatsapp' | 'phone'>) {
  const d = (c.whatsapp || c.phone).replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
}

// ---------- months (for charts) ----------

/** "2026-11" for a moment in time, in India. */
export const istMonthKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' }).format(d);

export const addMonths = (key: string, n: number) => {
  const d = new Date(`${key}-01T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 7);
};

const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' });
export const monthLabel = (key: string) => monthFmt.format(new Date(`${key}-01T00:00:00Z`));
