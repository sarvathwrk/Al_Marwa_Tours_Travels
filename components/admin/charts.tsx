import { formatInr } from '@/lib/constants';

/** Round a maximum up to a tidy axis top (4, 5, 10, 20, 50 …) so gridlines fall on whole numbers. */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

/**
 * Simple column chart: one hue, bars start on the baseline with rounded tops, light gridlines,
 * the value printed above each bar. Plain markup so it renders on the server with no chart library.
 */
export function ColumnChart({ data, label, unit }: { data: { label: string; value: number }[]; label: string; unit: string }) {
  const top = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const ticks = [top, top / 2, 0];
  return (
    <figure aria-label={label} className="m-0">
      <div className="flex h-44 gap-2">
        <div aria-hidden className="flex flex-col justify-between pb-6 pt-1 text-right text-[11px] leading-none text-muted">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div aria-hidden className="absolute inset-x-0 bottom-6 top-1 flex flex-col justify-between">
            {ticks.map((t) => (
              <span key={t} className="block border-t border-line" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 top-1 flex gap-1.5">
            {data.map((d) => {
              const pct = (d.value / top) * 100;
              return (
                <div key={d.label} title={`${d.label}: ${d.value} ${unit}`} className="group flex min-w-0 flex-1 flex-col">
                  <div className="relative flex-1">
                    {d.value > 0 && (
                      <>
                        <span
                          className="absolute inset-x-0 text-center text-xs font-semibold text-haram"
                          style={{ bottom: `calc(${pct}% + 4px)` }}
                        >
                          {d.value}
                        </span>
                        <span
                          className="grow-y absolute bottom-0 inset-x-0 mx-auto w-[58%] max-w-12 rounded-t-md bg-haram transition-[filter] group-hover:brightness-125"
                          style={{ height: `${pct}%` }}
                        />
                      </>
                    )}
                  </div>
                  <span className="h-6 pt-1.5 text-center text-xs text-muted">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th>Period</th>
            <th>{unit}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export const RECEIVED_COLOR = '#0f3d33';
export const PENDING_COLOR = '#a9cbbf';

/** Horizontal bars split into money received and money still to come; lengths share one scale so rows compare. */
export function MoneyBars({ rows, label }: { rows: { label: string; received: number; total: number }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.total, r.received)));
  return (
    <figure aria-label={label} className="m-0">
      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-hidden>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: RECEIVED_COLOR }} /> Received
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: PENDING_COLOR }} /> Still to receive
        </li>
      </ul>
      <ul className="grid gap-3.5">
        {rows.map((r) => {
          const pending = Math.max(0, r.total - r.received);
          return (
            <li key={r.label} title={`${r.label}: ${formatInr(r.received)} received, ${formatInr(pending)} to receive`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-haram">{r.label}</span>
                <span className="shrink-0 text-xs text-muted">
                  <strong className="text-haram">{formatInr(r.received)}</strong> / {formatInr(r.total)}
                </span>
              </div>
              <div className="mt-1.5 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
                {r.received > 0 && <span className="grow-x" style={{ flex: r.received / max, background: RECEIVED_COLOR }} />}
                {pending > 0 && <span className="grow-x" style={{ flex: pending / max, background: PENDING_COLOR }} />}
                <span style={{ flex: Math.max(0, 1 - Math.max(r.total, r.received) / max) }} />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
