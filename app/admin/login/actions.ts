'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { admins } from '@/db/schema';
import { requireDb } from '@/lib/db';
import { parseForm, type FormState } from '@/lib/form';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/session';
import { loginSchema } from '@/lib/validation';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

// Verified against when the username does not exist, so response time does not reveal valid usernames.
const DUMMY_HASH = hashPassword('not-a-real-password');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(loginSchema, formData, { omit: ['password'] });
  if (!parsed.ok) return parsed.state;
  const { username, password } = parsed.data;

  let userId: number;
  let tokenVersion: number;
  let name: string;

  try {
    const db = requireDb();
    const [row] = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    const now = new Date();

    if (row?.lockedUntil && row.lockedUntil > now) {
      return { status: 'error', message: 'Too many failed attempts. Try again in 15 minutes.', fields: { username } };
    }

    const passwordOk = verifyPassword(password, row?.passwordHash ?? DUMMY_HASH);
    if (!row || !passwordOk) {
      if (row) {
        const attempts = row.failedAttempts + 1;
        const lock = attempts >= MAX_FAILED_ATTEMPTS;
        await db
          .update(admins)
          .set({ failedAttempts: lock ? 0 : attempts, lockedUntil: lock ? new Date(now.getTime() + LOCK_MS) : row.lockedUntil })
          .where(eq(admins.id, row.id));
      }
      await sleep(400);
      return { status: 'error', message: 'Username or password is incorrect.', fields: { username } };
    }

    await db.update(admins).set({ failedAttempts: 0, lockedUntil: null, lastLoginAt: now }).where(eq(admins.id, row.id));
    userId = row.id;
    tokenVersion = row.tokenVersion;
    name = row.username;
  } catch (err) {
    console.error('[login] failed:', err instanceof Error ? err.message : err);
    return { status: 'error', message: 'Could not reach the database. Try again in a moment.', fields: { username } };
  }

  await createSession({ uid: userId, username: name, v: tokenVersion });
  redirect('/admin');
}
