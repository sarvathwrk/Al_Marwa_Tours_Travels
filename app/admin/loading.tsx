import { LoaderCircle } from 'lucide-react';

/** Shown while the admin (or the sign-in page) is first loading. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-svh place-items-center">
      <div className="flex flex-col items-center gap-3 text-haram">
        <LoaderCircle aria-hidden className="size-8 animate-spin" />
        <p className="text-sm font-semibold">Loading…</p>
      </div>
    </div>
  );
}
