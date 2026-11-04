import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { FormState } from './form';

export const ok = (message: string): FormState => ({ status: 'success', message });
export const fail = (message: string): FormState => ({ status: 'error', message });

/** Public pages are static; push admin edits to every locale. */
export function publish() {
  revalidatePath('/[lang]', 'layout');
  refreshAdmin();
}

/** Re-render the admin screen after a change that does not affect the public site (inbox actions). */
export function refreshAdmin() {
  revalidatePath('/admin');
}

export const idSchema = z.object({ id: z.coerce.number().int().positive() });

/** Run a mutation, turning database failures into a friendly message instead of a crashed page. */
export async function guarded(work: () => Promise<FormState>): Promise<FormState> {
  try {
    return await work();
  } catch (err) {
    console.error('[admin] action failed:', err instanceof Error ? err.message : err);
    return fail('Could not save. Check your connection and try again.');
  }
}
