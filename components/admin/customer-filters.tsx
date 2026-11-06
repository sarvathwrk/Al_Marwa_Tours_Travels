'use client';

import { LoaderCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';

const control = 'rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold';

type Props = {
  q?: string;
  type?: string;
  group?: string;
  status?: string;
  types: { value: string; label: string }[];
  groups: { value: string; label: string }[];
};

/** Search + type + group filters. Dropdowns apply instantly; the search button shows a spinner while results load. */
export default function CustomerFilters({ q, type, group, status, types, groups }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  const filtered = !!(q || type || group || status);

  const apply = () => {
    const f = new FormData(ref.current as HTMLFormElement);
    const p = new URLSearchParams({ tab: 'customers' });
    for (const k of ['q', 'type', 'group'] as const) {
      const v = String(f.get(k) ?? '').trim();
      if (v) p.set(k, v);
    }
    if (status) p.set('status', status);
    startTransition(() => router.push(`/admin?${p.toString()}`));
  };

  return (
    <form
      ref={ref}
      role="search"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="flex flex-wrap items-end gap-3"
    >
      <label className="relative min-w-[200px] flex-1">
        <span className="sr-only">Search customers</span>
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input type="search" name="q" defaultValue={q} autoComplete="off" placeholder="Search name, phone, group, package…" className={`${control} w-full pl-10`} />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-muted">
        Type
        <select name="type" defaultValue={type ?? ''} onChange={apply} className={control}>
          <option value="">All types</option>
          {types.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-semibold text-muted">
        Group
        <select name="group" defaultValue={group ?? ''} onChange={apply} className={control}>
          <option value="">All groups</option>
          {groups.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-haram px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-haram-2 disabled:cursor-wait disabled:opacity-70">
        {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        {pending ? 'Searching…' : 'Search'}
      </button>
      {filtered && (
        <Link href="/admin?tab=customers" className="py-2.5 text-sm font-semibold text-haram underline-offset-4 hover:underline">
          Clear
        </Link>
      )}
    </form>
  );
}
