import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { admins } from '@/db/schema';
import { requireDb } from './db';
import { SESSION_COOKIE, SESSION_MAX_AGE, signToken, verifyToken, type SessionClaims } from './token';

export async function createSession(claims: SessionClaims) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signToken(claims), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Valid session = signed cookie AND the admin row still exists with the same token_version.
 * Changing the password bumps token_version, which signs out every other device.
 */
export const getSession = cache(async () => {
  const claims = await verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const [row] = await requireDb()
    .select({ id: admins.id, username: admins.username, tokenVersion: admins.tokenVersion })
    .from(admins)
    .where(eq(admins.id, claims.uid))
    .limit(1);
  if (!row || row.tokenVersion !== claims.v) return null;
  return { uid: row.id, username: row.username, v: row.tokenVersion };
});

/** Call at the top of every admin page and server action. The proxy check is only optimistic. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
