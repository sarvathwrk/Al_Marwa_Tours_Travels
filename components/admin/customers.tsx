import { AlertTriangle, ExternalLink, Info, Mail, MessageCircle, Phone, Plus } from 'lucide-react';
import Link from 'next/link';
import { deleteCustomer, deleteGroup, saveCustomer, saveGroup } from '@/app/admin/customer-actions';
import type { Customer, Pkg, TravelGroup } from '@/db/schema';
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  formatInr,
  PACKAGE_KIND_LABEL,
  PACKAGE_KINDS,
  VISA_STATUS_LABEL,
  VISA_STATUSES,
  type CustomerStatus,
} from '@/lib/constants';
import { getCustomers, getEnquiry, getGroups, getLinkedEnquiryIds, getPackages, type CustomerWithGroup } from '@/lib/data';
import CustomerFilters from './customer-filters';
import { dueAmount, fmtDate, passportRisk, STATUS_STYLE, waDigits } from './customer-utils';
import { ActionForm, Area, Field, Hidden, Select, SubmitButton } from './form';
import { badge, Heading, panel, Title } from './tabs';

const KIND_OPTIONS = PACKAGE_KINDS.map((k) => ({ value: k, label: PACKAGE_KIND_LABEL[k].en }));
const STATUS_OPTIONS = CUSTOMER_STATUSES.map((s) => ({ value: s, label: CUSTOMER_STATUS_LABEL[s] }));
const VISA_OPTIONS = VISA_STATUSES.map((s) => ({ value: s, label: VISA_STATUS_LABEL[s] }));
const GENDER_OPTIONS = [
  { value: '', label: '—' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

type Query = { q?: string; status?: string; type?: string; group?: string; fromEnquiry?: string };
const asStatus = (v?: string) => CUSTOMER_STATUSES.find((s) => s === v);
const asKind = (v?: string) => PACKAGE_KINDS.find((k) => k === v);
const asId = (v?: string) => (v && /^\d{1,9}$/.test(v) ? Number(v) : undefined);

const href = (q: Omit<Query, 'fromEnquiry'>) => {
  const p = new URLSearchParams({ tab: 'customers' });
  for (const [k, v] of Object.entries(q)) if (v) p.set(k, v);
  return `/admin?${p.toString()}`;
};

const groupLabel = (g: TravelGroup) => `${g.name} · ${PACKAGE_KIND_LABEL[g.kind].en}${g.departureDate ? ` · ${fmtDate(g.departureDate)}` : ''}`;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="mb-3 border-b border-line pb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
);

// ---------- customer form ----------

export function CustomerForm({
  customer,
  defaults,
  packages,
  groups,
  enquiryId,
}: {
  customer?: Customer;
  /** Starting values for a new customer (e.g. copied from an enquiry). */
  defaults?: Partial<Customer>;
  packages: Pkg[];
  groups: TravelGroup[];
  enquiryId?: number;
}) {
  const c = customer ?? defaults;
  const packageOptions = [
    { value: '', label: customer && !customer.packageId && customer.packageName ? `— ${customer.packageName} (package removed) —` : '— Not chosen yet —' },
    ...packages.map((p) => ({ value: String(p.id), label: `${p.nameEn} (${PACKAGE_KIND_LABEL[p.kind].en})` })),
  ];
  const groupOptions = [{ value: '', label: '— Choose a group —' }, ...groups.map((g) => ({ value: String(g.id), label: groupLabel(g) }))];

  return (
    <ActionForm action={saveCustomer} className="grid gap-7">
      {customer && <Hidden name="id" value={customer.id} />}
      {enquiryId && <Hidden name="enquiryId" value={enquiryId} />}

      <Section title="Personal details">
        <Field autoComplete="off" name="name" label="Full name (as on passport)" required maxLength={80} defaultValue={c?.name} className="lg:col-span-2" />
        <Select name="gender" label="Gender" defaultValue={c?.gender ?? ''} options={GENDER_OPTIONS} />
        <Field autoComplete="off" name="phone" label="Mobile number" type="tel" inputMode="tel" required maxLength={20} placeholder="+91 99435 15474" defaultValue={c?.phone} />
        <Field autoComplete="off" name="whatsapp" label="WhatsApp number" hint="Only if different from the mobile number" type="tel" inputMode="tel" maxLength={20} defaultValue={c?.whatsapp} />
        <Field autoComplete="off" name="email" label="Email" type="email" maxLength={120} defaultValue={c?.email} />
        <Field autoComplete="off" name="dateOfBirth" label="Date of birth" type="date" defaultValue={c?.dateOfBirth} />
        <Field autoComplete="off" name="address" label="Address / city" maxLength={200} defaultValue={c?.address} className="lg:col-span-2" />
        <Field autoComplete="off" name="emergencyContact" label="Emergency contact" hint="Name and phone number" maxLength={120} defaultValue={c?.emergencyContact} />
        <Field autoComplete="off" name="passportNumber" label="Passport number" maxLength={20} defaultValue={c?.passportNumber} />
        <Field autoComplete="off" name="passportExpiry" label="Passport expiry" type="date" defaultValue={c?.passportExpiry} />
      </Section>

      <Section title="Travel details">
        <Select
          name="groupId"
          label="Group / batch *"
          hint="Required. The group sets Hajj / Umrah / Ziyarah and the travel dates."
          required
          defaultValue={String(c?.groupId ?? '')}
          options={groupOptions}
          className="lg:col-span-2"
        />
        <Field autoComplete="off" name="travellers" label="Number of travellers" hint="People in this booking" type="number" inputMode="numeric" defaultValue={c?.travellers ?? 1} />
        <Select name="packageId" label="Package selected" defaultValue={String(c?.packageId ?? '')} options={packageOptions} className="lg:col-span-2" />
        <Select name="visaStatus" label="Visa" defaultValue={c?.visaStatus ?? 'not_started'} options={VISA_OPTIONS} />
        <Field
          autoComplete="off"
          name="documentsUrl"
          label="Documents link"
          hint="Optional. Paste a link to a shared folder. Nothing is uploaded here."
          type="url"
          maxLength={500}
          placeholder="https://"
          defaultValue={c?.documentsUrl}
          className="lg:col-span-3"
        />
      </Section>

      <Section title="Payment (₹) and status">
        <Field autoComplete="off" name="totalAmount" label="Total package cost" hint="Whole rupees" inputMode="numeric" defaultValue={c?.totalAmount} />
        <Field autoComplete="off" name="paidAmount" label="Amount received so far" hint="Whole rupees" inputMode="numeric" defaultValue={c?.paidAmount ?? ''} />
        <Select name="status" label="Status" defaultValue={c?.status ?? 'applied'} options={STATUS_OPTIONS} />
        <Area name="notes" label="Notes" hint="Anything worth remembering about this customer" rows={3} defaultValue={c?.notes} className="sm:col-span-2 lg:col-span-3" />
      </Section>

      <div>
        <SubmitButton pendingLabel={customer ? 'Saving…' : 'Adding…'}>{customer ? 'Save customer' : 'Add customer'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

// ---------- customers list ----------

const COLS = 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_44px_minmax(0,1fr)_minmax(0,1.1fr)_100px]';

function PaymentCell({ c }: { c: Customer }) {
  if (c.totalAmount === null && c.paidAmount === 0) return <span className="text-muted">—</span>;
  const pct = c.totalAmount ? Math.min(100, Math.round((c.paidAmount / c.totalAmount) * 100)) : null;
  return (
    <div className="min-w-0">
      <p className="truncate text-[13px] font-semibold text-haram">
        {formatInr(c.paidAmount)}
        {c.totalAmount !== null && <span className="font-normal text-muted"> / {formatInr(c.totalAmount)}</span>}
      </p>
      {pct !== null && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mist" role="img" aria-label={`${pct}% paid`}>
          <div className="h-full rounded-full bg-haram" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

function Contact({ c }: { c: CustomerWithGroup }) {
  const link = 'inline-flex items-center gap-1.5 rounded-full border border-edge px-3.5 py-1.5 text-sm font-semibold text-haram transition-colors hover:border-haram';
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className={link}>
        <Phone aria-hidden className="size-4" /> Call
      </a>
      <a href={`https://wa.me/${waDigits(c)}`} target="_blank" rel="noopener noreferrer" className={link}>
        <MessageCircle aria-hidden className="size-4" /> WhatsApp
      </a>
      {c.email && (
        <a href={`mailto:${c.email}`} className={link}>
          <Mail aria-hidden className="size-4" /> Email
        </a>
      )}
      {c.documentsUrl && (
        <a href={c.documentsUrl} target="_blank" rel="noopener noreferrer" className={link}>
          <ExternalLink aria-hidden className="size-4" /> Documents
        </a>
      )}
      {passportRisk(c) && (
        <span className={`${badge} inline-flex items-center gap-1.5 bg-red-50 py-1.5 text-red-700`}>
          <AlertTriangle aria-hidden className="size-3.5" /> Passport expires within 6 months of travel
        </span>
      )}
      {dueAmount(c) > 0 && (
        <span className="ml-auto text-sm text-muted">
          Balance to collect: <strong className="text-haram">{formatInr(dueAmount(c))}</strong>
        </span>
      )}
    </div>
  );
}

export async function CustomersTab({ q, status, type, group, fromEnquiry }: Query) {
  const [all, packages, groups, linked] = await Promise.all([getCustomers(), getPackages({ includeInactive: true }), getGroups(), getLinkedEnquiryIds()]);

  // "Add as customer" from the inbox: open the add form with the enquiry's details filled in.
  const enquiryId = asId(fromEnquiry);
  const enquiry = enquiryId && !linked.has(enquiryId) ? await getEnquiry(enquiryId) : null;
  const defaults: Partial<Customer> | undefined = enquiry
    ? { name: enquiry.name, phone: enquiry.phone, email: enquiry.email, travellers: enquiry.travellers ?? 1, notes: enquiry.message ? `From website enquiry:\n${enquiry.message}` : '' }
    : undefined;

  const st = asStatus(status);
  const kind = asKind(type);
  const groupId = asId(group);
  const needle = q?.trim().toLowerCase() ?? '';
  // Phone numbers are saved with spaces ("+91 90000 11111"), so a search typed as digits only also matches them.
  const needleDigits = needle.replace(/\D/g, '');

  const base = all.filter(
    (c) =>
      (!kind || c.group.kind === kind) &&
      (!groupId || c.groupId === groupId) &&
      (!needle ||
        [c.name, c.phone, c.whatsapp, c.email, c.group.name, c.packageName, c.address].some((v) => v.toLowerCase().includes(needle)) ||
        (needleDigits.length >= 4 && [c.phone, c.whatsapp].some((v) => v.replace(/\D/g, '').includes(needleDigits)))),
  );
  const rows = st ? base.filter((c) => c.status === st) : base;
  const count = (s: CustomerStatus) => base.filter((c) => c.status === s).length;
  const keep = { q, type, group };

  return (
    <>
      <Heading
        title={kind ? `${PACKAGE_KIND_LABEL[kind].en} customers` : 'Customers'}
        intro="Everyone who applied for Hajj, Umrah or Ziyarah: personal details, travel details, package, group and payments."
      />

      <details className={`${panel} !py-3`} open={all.length === 0 || !!enquiry}>
        <summary className="flex min-h-10 cursor-pointer items-center gap-2 font-display text-xl font-bold text-haram">
          <Plus aria-hidden className="size-5" /> Add a customer
        </summary>
        <div className="mt-5 border-t border-line pt-5">
          {enquiry && (
            <p className="mb-5 flex items-start gap-2.5 rounded-xl bg-sage px-4 py-3 text-sm text-haram">
              <Info aria-hidden className="mt-0.5 size-[18px] shrink-0" />
              <span>
                Adding <strong>{enquiry.name}</strong> from a website enquiry. Their details are filled in below. Choose a group and save.
              </span>
            </p>
          )}
          {groups.length === 0 ? (
            <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-gold-deep">
              Every customer must belong to a group, and there are no groups yet.{' '}
              <Link href="/admin?tab=groups" className="font-semibold underline underline-offset-4">
                Create a group first
              </Link>
              .
            </p>
          ) : (
            <CustomerForm defaults={defaults} packages={packages} groups={groups} enquiryId={enquiry?.id} />
          )}
        </div>
      </details>

      <section className={`${panel} grid gap-4`} aria-label="Search and filter">
        <CustomerFilters q={q} type={kind} group={group} status={st} types={KIND_OPTIONS} groups={groups.map((g) => ({ value: String(g.id), label: g.name }))} />
        <ul className="flex flex-wrap gap-2" aria-label="Filter by status">
          {[{ s: undefined, label: 'All', n: base.length }, ...CUSTOMER_STATUSES.map((s) => ({ s, label: CUSTOMER_STATUS_LABEL[s], n: count(s) }))].map(({ s, label, n }) => {
            const on = st === s;
            return (
              <li key={label}>
                <Link
                  href={href({ ...keep, status: s })}
                  aria-current={on ? 'true' : undefined}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm font-semibold transition-colors ${on ? 'border-haram bg-haram text-white' : 'border-edge bg-white text-haram hover:border-haram'}`}
                >
                  {label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${on ? 'bg-white/20' : 'bg-mist'}`}>{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {all.length === 0 && <p className={`${panel} text-sm text-muted`}>No customers yet. Add the first one above, or open an enquiry in the Inbox and press “Add as customer”.</p>}
      {all.length > 0 && rows.length === 0 && <p className={`${panel} text-sm text-muted`}>No customers match this search.</p>}

      {rows.length > 0 && (
        <section aria-label="Customers" className="grid gap-2.5">
          <div className={`hidden gap-x-4 px-6 text-xs font-semibold uppercase tracking-wide text-muted lg:grid ${COLS}`} aria-hidden>
            <span>Customer</span>
            <span>Package</span>
            <span>Group</span>
            <span>Pax</span>
            <span>Departure</span>
            <span>Paid</span>
            <span>Status</span>
          </div>
          {rows.map((c) => (
            <details key={c.id} className={`${panel} !p-0`}>
              <summary className={`grid cursor-pointer list-none items-center gap-x-4 gap-y-1.5 px-5 py-3.5 ${COLS}`}>
                <div className="min-w-0">
                  <Title>{c.name}</Title>
                  <p className="truncate text-sm text-muted">{c.phone}</p>
                </div>
                <p className="truncate text-sm text-haram">{c.packageName || <span className="text-muted">No package chosen</span>}</p>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold text-haram">{c.group.name}</p>
                  <span className={`${badge} bg-mist text-haram`}>{PACKAGE_KIND_LABEL[c.group.kind].en}</span>
                </div>
                <p className="text-sm text-haram">
                  <span className="text-muted lg:hidden">Travellers: </span>
                  {c.travellers}
                </p>
                <p className="text-sm text-haram">
                  {c.group.departureDate ? fmtDate(c.group.departureDate) : <span className="text-muted">Date not set</span>}
                  {passportRisk(c) && <AlertTriangle aria-label="Passport expires within 6 months of travel" className="ml-1.5 inline size-4 align-text-bottom text-red-600" />}
                </p>
                <PaymentCell c={c} />
                <span className={`${badge} w-fit ${STATUS_STYLE[c.status]}`}>{CUSTOMER_STATUS_LABEL[c.status]}</span>
              </summary>
              <div className="border-t border-line px-5 py-5">
                <Contact c={c} />
                <CustomerForm customer={c} packages={packages} groups={groups} />
                <ActionForm action={deleteCustomer} className="mt-3">
                  <Hidden name="id" value={c.id} />
                  <SubmitButton variant="danger" pendingLabel="Deleting…" confirm={`Delete ${c.name}? This cannot be undone.`}>
                    Delete customer
                  </SubmitButton>
                </ActionForm>
              </div>
            </details>
          ))}
        </section>
      )}
      <p className="text-center text-xs text-muted">
        Showing {rows.length} of {all.length} customers
      </p>
    </>
  );
}

// ---------- groups ----------

export function GroupForm({ group }: { group?: TravelGroup }) {
  return (
    <ActionForm action={saveGroup} className="grid gap-5">
      {group && <Hidden name="id" value={group.id} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field autoComplete="off" name="name" label="Group name *" hint="e.g. Umrah Ramadan 2027" required maxLength={80} defaultValue={group?.name} className="lg:col-span-2" />
        <Select name="kind" label="Type *" defaultValue={group?.kind ?? 'umrah'} options={KIND_OPTIONS} required />
        <Field autoComplete="off" name="departureDate" label="Departure date" type="date" defaultValue={group?.departureDate} />
        <Field autoComplete="off" name="returnDate" label="Return date" type="date" defaultValue={group?.returnDate} />
        <Field autoComplete="off" name="departureCity" label="Departing from" hint="e.g. Chennai" maxLength={60} defaultValue={group?.departureCity} />
        <Field autoComplete="off" name="capacity" label="Seats" hint="Optional. Leave blank if not limited." type="number" inputMode="numeric" defaultValue={group?.capacity} />
        <Area name="notes" label="Notes" rows={2} defaultValue={group?.notes} className="sm:col-span-2" />
      </div>
      <div>
        <SubmitButton pendingLabel={group ? 'Saving…' : 'Adding…'}>{group ? 'Save group' : 'Add group'}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export async function GroupsTab() {
  const [groups, customers] = await Promise.all([getGroups(), getCustomers()]);
  const members = (id: number) => customers.filter((c) => c.groupId === id);

  return (
    <>
      <Heading title="Groups" intro="Batches of customers travelling together. Create a group first, then every customer picks one." />

      <details className={`${panel} !py-3`} open={groups.length === 0}>
        <summary className="flex min-h-10 cursor-pointer items-center gap-2 font-display text-xl font-bold text-haram">
          <Plus aria-hidden className="size-5" /> Add a group
        </summary>
        <div className="mt-5 border-t border-line pt-5">
          <GroupForm />
        </div>
      </details>

      {groups.length === 0 && <p className={`${panel} text-sm text-muted`}>No groups yet. Add your first one above, for example “Umrah Ramadan 2027”.</p>}

      <section aria-label="Groups" className="grid gap-2.5">
        {groups.map((g) => {
          const m = members(g.id).filter((c) => c.status !== 'cancelled');
          const all = members(g.id);
          const pax = m.reduce((n, c) => n + c.travellers, 0);
          const paid = m.reduce((n, c) => n + c.paidAmount, 0);
          const total = m.reduce((n, c) => n + (c.totalAmount ?? 0), 0);
          const seatPct = g.capacity ? Math.min(100, Math.round((pax / g.capacity) * 100)) : null;
          return (
            <details key={g.id} className={`${panel} !p-0`}>
              <summary className="grid cursor-pointer list-none items-center gap-x-4 gap-y-2 px-5 py-3.5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <Title>{g.name}</Title>
                  <p className="mt-0.5">
                    <span className={`${badge} bg-mist text-haram`}>{PACKAGE_KIND_LABEL[g.kind].en}</span>
                  </p>
                </div>
                <p className="text-sm text-haram">
                  {g.departureDate ? (
                    <>
                      {fmtDate(g.departureDate)}
                      {g.returnDate && <span className="text-muted"> → {fmtDate(g.returnDate)}</span>}
                    </>
                  ) : (
                    <span className="text-muted">Dates not set</span>
                  )}
                  {g.departureCity && <span className="block text-muted">from {g.departureCity}</span>}
                </p>
                <div className="min-w-0 text-sm">
                  <p className="text-haram">
                    <strong>{pax}</strong> {pax === 1 ? 'traveller' : 'travellers'}
                    {g.capacity && <span className="text-muted"> / {g.capacity} seats</span>}
                  </p>
                  {seatPct !== null && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mist" role="img" aria-label={`${seatPct}% of seats filled`}>
                      <div className="h-full rounded-full bg-haram" style={{ width: `${seatPct}%` }} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-haram">
                  <strong>{all.length}</strong> {all.length === 1 ? 'customer' : 'customers'}
                </p>
                <p className="text-sm text-muted">
                  {total > 0 || paid > 0 ? (
                    <>
                      <strong className="text-haram">{formatInr(paid)}</strong>
                      {total > 0 && ` of ${formatInr(total)}`}
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </summary>
              <div className="border-t border-line px-5 py-5">
                <GroupForm group={g} />

                <h3 className="mb-2 mt-7 border-b border-line pb-2 text-xs font-semibold uppercase tracking-wide text-muted">Customers in this group</h3>
                {all.length === 0 ? (
                  <p className="text-sm text-muted">No customers yet.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {all.map((c) => (
                      <li key={c.id} className="grid gap-x-4 gap-y-1 py-2.5 text-sm sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_70px_minmax(0,1fr)_100px] sm:items-center">
                        <Link href={href({ q: c.name })} className="font-semibold text-haram hover:underline">
                          {c.name}
                        </Link>
                        <span className="truncate text-muted">{c.packageName || 'No package chosen'}</span>
                        <span className="text-muted">{c.travellers} pax</span>
                        <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="text-haram hover:underline">
                          {c.phone}
                        </a>
                        <span className={`${badge} w-fit ${STATUS_STYLE[c.status]}`}>{CUSTOMER_STATUS_LABEL[c.status]}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href={href({ group: String(g.id) })} className="text-sm font-semibold text-haram underline-offset-4 hover:underline">
                    Open in Customers →
                  </Link>
                </div>
                <ActionForm action={deleteGroup} className="mt-3">
                  <Hidden name="id" value={g.id} />
                  <SubmitButton variant="danger" pendingLabel="Deleting…" confirm={`Delete the group “${g.name}”? This cannot be undone.`}>
                    Delete group
                  </SubmitButton>
                </ActionForm>
              </div>
            </details>
          );
        })}
      </section>
    </>
  );
}
