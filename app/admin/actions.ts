'use server';

import { eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { admins, offers, packages, siteSettings } from '@/db/schema';
import { fail, guarded, idSchema, ok, publish } from '@/lib/admin-helpers';
import { requireDb } from '@/lib/db';
import { parseForm, type FormState } from '@/lib/form';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession, destroySession, requireAdmin } from '@/lib/session';
import { accountSchema, offerSchema, packageSchema, settingsSchema } from '@/lib/validation';

// ---------- packages ----------

export async function savePackage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(packageSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;

  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(packages).set(values).where(eq(packages.id, id));
    else await db.insert(packages).values(values);
    publish();
    return ok(id ? 'Package saved.' : 'Package added.');
  });
}

export async function deletePackage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(packages).where(eq(packages.id, parsed.data.id));
    publish();
    return ok('Package deleted.');
  });
}

// ---------- offers ----------

export async function saveOffer(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(offerSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;

  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(offers).set(values).where(eq(offers.id, id));
    else await db.insert(offers).values(values);
    publish();
    return ok(id ? 'Offer saved.' : 'Offer added.');
  });
}

export async function deleteOffer(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(offers).where(eq(offers.id, parsed.data.id));
    publish();
    return ok('Offer deleted.');
  });
}

// ---------- contact details ----------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(settingsSchema, formData);
  if (!parsed.ok) return parsed.state;

  return guarded(async () => {
    await requireDb()
      .insert(siteSettings)
      .values({ id: 1, ...parsed.data })
      .onConflictDoUpdate({ target: siteSettings.id, set: parsed.data });
    publish();
    return ok('Contact details saved.');
  });
}

// ---------- account ----------

export async function changeAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = parseForm(accountSchema, formData, { omit: ['currentPassword', 'newPassword', 'confirmPassword'] });
  if (!parsed.ok) return parsed.state;
  const { currentPassword, username, newPassword } = parsed.data;

  return guarded(async () => {
    const db = requireDb();
    const [me] = await db.select().from(admins).where(eq(admins.id, session.uid)).limit(1);
    if (!me || !verifyPassword(currentPassword, me.passwordHash)) {
      return {
        status: 'error',
        message: 'Your current password is not correct.',
        errors: { currentPassword: ['Current password is incorrect'] },
        fields: { username },
      };
    }

    if (username !== me.username) {
      const [taken] = await db.select({ id: admins.id }).from(admins).where(eq(admins.username, username)).limit(1);
      if (taken) {
        return { status: 'error', message: 'Choose a different username.', errors: { username: ['That username is already taken'] }, fields: { username } };
      }
    }

    const changingPassword = newPassword !== '';
    const [updated] = await db
      .update(admins)
      .set({
        username,
        ...(changingPassword ? { passwordHash: hashPassword(newPassword), tokenVersion: sql`${admins.tokenVersion} + 1` } : {}),
      })
      .where(eq(admins.id, me.id))
      .returning({ id: admins.id, username: admins.username, tokenVersion: admins.tokenVersion });
    if (!updated) return fail('Could not update your account.');

    // Re-issue this browser's session. Other devices are signed out when the password changed.
    await createSession({ uid: updated.id, username: updated.username, v: updated.tokenVersion });
    return ok(changingPassword ? 'Password and username updated. Other devices were signed out.' : 'Username updated.');
  });
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}
