/** Grey placeholder blocks shown while a tab's data loads. */
const bar = 'animate-pulse rounded-lg bg-line/80';

export function TabSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="grid gap-5">
      <span className="sr-only">Loading…</span>
      <div className="grid gap-2.5">
        <div className={`${bar} h-8 w-56`} />
        <div className={`${bar} h-4 w-96 max-w-full`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-edge bg-white p-4 shadow-sm shadow-black/10">
            <div className={`${bar} size-11 !rounded-xl`} />
            <div className="grid flex-1 gap-2">
              <div className={`${bar} h-3 w-24`} />
              <div className={`${bar} h-6 w-20`} />
            </div>
          </div>
        ))}
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="grid gap-3 rounded-2xl border border-edge bg-white p-5 shadow-sm shadow-black/10">
          <div className={`${bar} h-5 w-40`} />
          <div className={`${bar} h-4 w-full`} />
          <div className={`${bar} h-4 w-4/5`} />
        </div>
      ))}
    </div>
  );
}
