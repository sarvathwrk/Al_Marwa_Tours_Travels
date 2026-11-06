import { ArrowRight, Banknote, CalendarClock, Inbox, Plane, Plus, Scale, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { CUSTOMER_STATUS_LABEL, CUSTOMER_STATUSES, ENQUIRY_INTEREST_LABEL, ENQUIRY_STATUS_LABEL, formatInr, PACKAGE_KIND_LABEL, PACKAGE_KINDS, type CustomerStatus } from '@/lib/constants';
import { countNewEnquiries, getCustomers, getEnquiries, getGroups } from '@/lib/data';
import { ColumnChart, MoneyBars } from './charts';
import { addMonths, daysUntil, dueAmount, fmtDate, istMonthKey, monthLabel, todayIST } from './customer-utils';
import { badge, panel, Title, when } from './tabs';

/** One hue (the brand teal) from light to dark follows the order of the pipeline; cancelled stays neutral grey. */
const STAGE_COLOR: Record<CustomerStatus, string> = {
  applied: '#a9cbbf',
  documents: '#63a08f',
  confirmed: '#2f7563',
  completed: '#0f3d33',
  cancelled: '#b9c0bc',
};

const delay = (i: number) => ({ '--d': `${i * 55}ms` }) as React.CSSProperties;

function Tile({ icon: Icon, label, value, sub, href, tone, i = 0 }: { icon: typeof Users; label: string; value: string; sub?: string; href?: string; tone?: 'alert'; i?: number }) {
  const body = (
    <>
      <span aria-hidden className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone === 'alert' ? 'bg-gold/25 text-gold-deep' : 'bg-sage text-haram'}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="truncate font-display text-2xl font-bold leading-tight text-haram">{value}</p>
        {sub && <p className="truncate text-xs text-muted">{sub}</p>}
      </div>
    </>
  );
  const cls = `${panel} rise !p-4 flex items-center gap-4`;
  return href ? (
    <Link href={href} style={delay(i)} className={`${cls} transition duration-200 hover:-translate-y-0.5 hover:border-haram/40 hover:shadow-md`}>
      {body}
    </Link>
  ) : (
    <div style={delay(i)} className={cls}>
      {body}
    </div>
  );
}

const Card = ({ title, note, action, children, className = '', i = 0 }: { title: string; note?: string; action?: { href: string; label: string }; children: React.ReactNode; className?: string; i?: number }) => (
  <section style={delay(i)} className={`${panel} rise transition-shadow duration-200 hover:shadow-md ${className}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-bold leading-tight text-haram">{title}</h2>
        {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-haram underline-offset-4 hover:underline">
          {action.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

export async function DashboardTab({ username }: { username: string }) {
  const [customers, groups, newEnquiries, enquiries] = await Promise.all([getCustomers(), getGroups(), countNewEnquiries(), getEnquiries()]);
  const today = todayIST();
  const thisMonth = istMonthKey(new Date());

  const live = customers.filter((c) => c.status !== 'cancelled');
  const upcomingCustomers = customers.filter((c) => c.status === 'applied' || c.status === 'documents' || c.status === 'confirmed');
  const confirmed = customers.filter((c) => c.status === 'confirmed');
  const confirmedPax = confirmed.reduce((n, c) => n + c.travellers, 0);
  const booked = live.reduce((n, c) => n + (c.totalAmount ?? 0), 0);
  const collected = live.reduce((n, c) => n + c.paidAmount, 0);
  const due = live.reduce((n, c) => n + dueAmount(c), 0);
  const collectedPct = booked > 0 ? Math.min(100, Math.round((collected / booked) * 100)) : null;

  // charts
  const joinMonths = Array.from({ length: 6 }, (_, i) => addMonths(thisMonth, i - 5));
  const joined = joinMonths.map((m) => ({ label: monthLabel(m), value: customers.filter((c) => istMonthKey(c.createdAt) === m).length }));
  const departMonths = Array.from({ length: 8 }, (_, i) => addMonths(thisMonth, i));
  const departing = departMonths.map((m) => ({
    label: monthLabel(m),
    value: upcomingCustomers.filter((c) => c.group.departureDate?.slice(0, 7) === m).reduce((n, c) => n + c.travellers, 0),
  }));
  const stages = CUSTOMER_STATUSES.map((s) => ({ s, n: customers.filter((c) => c.status === s).length }));
  const kinds = PACKAGE_KINDS.map((k) => {
    const rows = live.filter((c) => c.group.kind === k);
    return { k, customers: rows.length, pax: rows.reduce((n, c) => n + c.travellers, 0), paid: rows.reduce((n, c) => n + c.paidAmount, 0) };
  });
  const maxKind = Math.max(1, ...kinds.map((x) => x.customers));
  const money = groups
    .map((g) => {
      const rows = live.filter((c) => c.groupId === g.id);
      return { label: g.name, received: rows.reduce((n, c) => n + c.paidAmount, 0), total: rows.reduce((n, c) => n + (c.totalAmount ?? 0), 0) };
    })
    .filter((r) => r.total > 0 || r.received > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const upcomingGroups = groups
    .filter((g) => g.departureDate && g.departureDate >= today)
    .slice(0, 5)
    .map((g) => {
      const rows = live.filter((c) => c.groupId === g.id);
      return { g, pax: rows.reduce((n, c) => n + c.travellers, 0), customers: rows.length };
    });
  const seats = groups
    .filter((g) => g.capacity && (!g.departureDate || g.departureDate >= today))
    .slice(0, 6)
    .map((g) => {
      const pax = live.filter((c) => c.groupId === g.id).reduce((n, c) => n + c.travellers, 0);
      return { g, pax, cap: g.capacity as number };
    });
  const recent = enquiries.slice(0, 5);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight text-haram">Welcome back, {username}</h1>
          <p className="mt-1 text-sm text-muted">{fmtDate(today)} · here is where your Hajj and Umrah customers stand.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin?tab=customers" className="inline-flex items-center gap-2 rounded-full bg-haram px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-haram-2">
            <Plus aria-hidden className="size-4" /> Add customer
          </Link>
          <Link href="/admin?tab=enquiries&status=new" className="inline-flex items-center gap-2 rounded-full border border-edge bg-white px-5 py-2 text-sm font-semibold text-haram transition-colors hover:border-haram">
            <Inbox aria-hidden className="size-4" /> New enquiries
          </Link>
        </div>
      </header>

      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2">
        <Tile i={0} icon={Users} label="Customers" value={String(customers.length)} sub={`${upcomingCustomers.length} in progress`} href="/admin?tab=customers" />
        <Tile i={1} icon={Plane} label="Confirmed travellers" value={String(confirmedPax)} sub={`${confirmed.length} confirmed ${confirmed.length === 1 ? 'booking' : 'bookings'}`} href="/admin?tab=customers&status=confirmed" />
        <Tile i={2} icon={Inbox} label="New enquiries" value={String(newEnquiries)} sub={newEnquiries > 0 ? 'Waiting for a reply' : 'All caught up'} href="/admin?tab=enquiries&status=new" tone={newEnquiries > 0 ? 'alert' : undefined} />
        <Tile i={3} icon={Banknote} label="Booked value" value={formatInr(booked)} sub="All active bookings" />
        <Tile i={4} icon={Wallet} label="Received" value={formatInr(collected)} sub={collectedPct === null ? 'No totals entered yet' : `${collectedPct}% of booked value`} />
        <Tile i={5} icon={Scale} label="Balance to collect" value={formatInr(due)} sub={due > 0 ? 'Still to receive' : 'Nothing pending'} tone={due > 0 ? 'alert' : undefined} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card i={6} title="New customers" note="Added each month, last 6 months">
          <ColumnChart data={joined} label="New customers per month" unit="customers" />
        </Card>
        <Card i={7} title="Travellers by departure month" note="Applied, documents and confirmed bookings">
          <ColumnChart data={departing} label="Travellers by departure month" unit="travellers" />
        </Card>

        <Card i={8} title="Customer pipeline" action={{ href: '/admin?tab=customers', label: 'All' }}>
          {customers.length === 0 ? (
            <p className="text-sm text-muted">No customers yet.</p>
          ) : (
            <>
              <div role="img" aria-label={stages.map((x) => `${CUSTOMER_STATUS_LABEL[x.s]} ${x.n}`).join(', ')} className="flex h-3 gap-0.5 overflow-hidden rounded-full">
                {stages
                  .filter((x) => x.n > 0)
                  .map((x) => (
                    <span key={x.s} className="grow-x" style={{ flex: x.n, background: STAGE_COLOR[x.s] }} />
                  ))}
              </div>
              <ul className="mt-4 grid gap-0.5">
                {stages.map(({ s, n }) => (
                  <li key={s}>
                    <Link href={`/admin?tab=customers&status=${s}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-mist">
                      <span aria-hidden className="size-3 shrink-0 rounded-sm" style={{ background: STAGE_COLOR[s] }} />
                      <span className="flex-1 text-haram">{CUSTOMER_STATUS_LABEL[s]}</span>
                      <span className="font-semibold text-haram">{n}</span>
                      <span className="w-10 text-right text-muted">{Math.round((n / customers.length) * 100)}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card i={9} title="Hajj, Umrah, Ziyarah" note="Active customers by group type">
          <ul className="grid gap-4">
            {kinds.map(({ k, customers: n, pax, paid }) => (
              <li key={k}>
                <Link href={`/admin?tab=customers&type=${k}`} className="group block">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-semibold text-haram">{PACKAGE_KIND_LABEL[k].en}</span>
                    <span className="text-xs text-muted">
                      <strong className="text-sm text-haram">{n}</strong> {n === 1 ? 'customer' : 'customers'} · {pax} {pax === 1 ? 'traveller' : 'travellers'}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-mist" aria-hidden>
                    <div className="grow-x h-full rounded-full bg-haram transition-[filter] duration-200 group-hover:brightness-125" style={{ width: `${(n / maxKind) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{formatInr(paid)} received</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card i={10} title="Payments by group" note="Top groups by booked value" action={{ href: '/admin?tab=groups', label: 'Groups' }}>
          {money.length === 0 ? <p className="text-sm text-muted">Enter package costs on customers to see payments here.</p> : <MoneyBars rows={money} label="Payments by group" />}
        </Card>

        <Card i={11} title="Seats filled" note="Travellers against seats, by group" action={{ href: '/admin?tab=groups', label: 'Groups' }}>
          {seats.length === 0 ? (
            <p className="text-sm text-muted">Set the number of seats on a group to track how full it is.</p>
          ) : (
            <ul className="grid gap-3.5">
              {seats.map(({ g, pax, cap }) => {
                const pct = Math.min(100, Math.round((pax / cap) * 100));
                return (
                  <li key={g.id}>
                    <Link href={`/admin?tab=customers&group=${g.id}`} className="group block" title={`${g.name}: ${pax} of ${cap} seats`}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate font-semibold text-haram">{g.name}</span>
                        <span className="shrink-0 text-xs text-muted">
                          <strong className="text-sm text-haram">{pax}</strong> / {cap} seats · {pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-mist" role="img" aria-label={`${pct}% of seats filled`}>
                        <div className="grow-x h-full rounded-full bg-haram transition-[filter] duration-200 group-hover:brightness-125" style={{ width: `${pct}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card i={12} title="Upcoming departures" action={{ href: '/admin?tab=groups', label: 'All groups' }}>
          {upcomingGroups.length === 0 ? (
            <p className="text-sm text-muted">No upcoming departures. Set a departure date on a group and it will show here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {upcomingGroups.map(({ g, pax, customers: n }) => {
                const d = daysUntil(g.departureDate as string);
                return (
                  <li key={g.id}>
                    <Link href={`/admin?tab=customers&group=${g.id}`} className="flex items-center gap-4 py-2.5 transition-colors duration-200 hover:bg-mist/60">
                      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/20 text-gold-deep">
                        <CalendarClock className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <Title>{g.name}</Title>
                        <p className="truncate text-sm text-muted">
                          {PACKAGE_KIND_LABEL[g.kind].en} · {n} {n === 1 ? 'booking' : 'bookings'} · {pax} {pax === 1 ? 'traveller' : 'travellers'}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-haram">{fmtDate(g.departureDate)}</p>
                        <p className="text-muted">{d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `in ${d} days`}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card i={13} title="Latest enquiries" action={{ href: '/admin?tab=enquiries', label: 'Open inbox' }}>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                  <Title>{e.name}</Title>
                  <span className={`${badge} bg-mist text-haram`}>{ENQUIRY_INTEREST_LABEL[e.interest].en}</span>
                  <span className={`${badge} ${e.status === 'new' ? 'bg-gold/25 text-gold-deep' : e.status === 'contacted' ? 'bg-sage text-haram' : 'bg-mist text-muted'}`}>{ENQUIRY_STATUS_LABEL[e.status]}</span>
                  <time dateTime={e.createdAt.toISOString()} className="ml-auto text-xs text-muted">
                    {when.format(e.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
