import type { ZodType } from 'zod';
import { z } from 'zod';

/** Shape returned by every admin server action (used with useActionState). */
export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** field name -> messages */
  errors?: Record<string, string[]>;
  /** submitted values, so the form can keep what the admin typed after an error */
  fields?: Record<string, string>;
};

export const idleState: FormState = { status: 'idle' };

export function rawFields(fd: FormData, omit: readonly string[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string' && !omit.includes(k)) out[k] = v;
  return out;
}

export type Parsed<T> = { ok: true; data: T } | { ok: false; state: FormState };

/** Validate FormData with a Zod schema. Never trusts the browser. */
export function parseForm<T>(schema: ZodType<T>, fd: FormData, opts: { omit?: readonly string[] } = {}): Parsed<T> {
  // `omit` keeps secrets (passwords) out of the state echoed back to the browser.
  const fields = rawFields(fd, opts.omit);
  const result = schema.safeParse(rawFields(fd));
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    state: {
      status: 'error',
      message: 'Fix the highlighted fields and save again.',
      errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
      fields,
    },
  };
}
