'use client';

import { TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';

/** Last-resort screen if an admin page crashes (for example the database cannot be reached). */
export default function AdminError({ error, retry, reset }: { error: unknown; retry?: () => void; reset?: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const again = retry ?? reset;
  return (
    <div role="alert" className="grid min-h-svh place-items-center px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-haram/5 ring-1 ring-line">
        <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-700">
          <TriangleAlert className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-haram">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">This page could not load. Check your connection and try again. Your data has not been changed.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {again && (
            <button type="button" onClick={() => again()} className="rounded-full bg-haram px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-haram-2">
              Try again
            </button>
          )}
          <a href="/admin" className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-haram transition-colors hover:border-haram">
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
