'use server';

import { count, eq } from 'drizzle-orm';
import { customers, enquiries, packages, travelGroups } from '@/db/schema';
import { guarded, idSchema, ok, fail, refreshAdmin } from '@/lib/admin-helpers';
import { requireDb } from '@/lib/db';
import { parseForm, type FormState } from '@/lib/form';
import { requireAdmin } from '@/lib/session';
import { customerSchema, groupSchema } from '@/lib/validation';

// ---------- customers ----------

export async function saveCustomer(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(customerSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, packageId, enquiryId, ...rest } = parsed.data;

  return guarded(async () => {
    const db = requireDb();

    const [group] = await db.select({ id: travelGroups.id }).from(travelGroups).where(eq(travelGroups.id, rest.groupId)).limit(1);
    if (!group) return fail('That group no longer exists. Pick another one.');

    let chosenId: number | null = null;
    let packageName: string | undefined;
    if (packageId) {
      const [pkg] = await db.select({ name: packages.nameEn }).from(packages).where(eq(packages.id, packageId)).limit(1);
      if (!pkg) return fail('That package no longer exists. Pick another one.');
      chosenId = packageId;
      packageName = pkg.name;
    }

    if (id) {
      const [current] = await db.select({ packageId: customers.packageId }).from(customers).where(eq(customers.id, id)).limit(1);
      if (!current) return fail('This customer was deleted. Refresh the page.');
      // Cleared a live package -> forget its name. A package that was already removed keeps its saved name.
      if (packageName === undefined && current.packageId !== null) packageName = '';
      await db
        .update(customers)
        .set({ ...rest, packageId: chosenId, ...(packageName !== undefined && { packageName }) })
        .where(eq(customers.id, id));
    } else {
      if (enquiryId) {
        const [taken] = await db.select({ id: customers.id }).from(customers).where(eq(customers.enquiryId, enquiryId)).limit(1);
        if (taken) return fail('This enquiry was already added as a customer.');
      }
      await db.insert(customers).values({ ...rest, packageId: chosenId, packageName: packageName ?? '', enquiryId: enquiryId ?? null });
      // Once someone is a customer their enquiry has been dealt with.
      if (enquiryId) await db.update(enquiries).set({ status: 'contacted' }).where(eq(enquiries.id, enquiryId));
    }
    refreshAdmin();
    return ok(id ? 'Customer saved.' : 'Customer added.');
  });
}

export async function deleteCustomer(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(customers).where(eq(customers.id, parsed.data.id));
    refreshAdmin();
    return ok('Customer deleted.');
  });
}

// ---------- groups ----------

export async function saveGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(groupSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;
  return guarded(async () => {
    const db = requireDb();
    const [dupe] = await db.select({ id: travelGroups.id, name: travelGroups.name }).from(travelGroups).where(eq(travelGroups.name, values.name)).limit(1);
    if (dupe && dupe.id !== id) {
      return { status: 'error', message: 'Fix the highlighted fields and save again.', errors: { name: ['A group with this name already exists'] }, fields: Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === 'string')) as Record<string, string> };
    }
    if (id) await db.update(travelGroups).set(values).where(eq(travelGroups.id, id));
    else await db.insert(travelGroups).values(values);
    refreshAdmin();
    return ok(id ? 'Group saved.' : 'Group added.');
  });
}

export async function deleteGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    const db = requireDb();
    const [row] = await db.select({ n: count() }).from(customers).where(eq(customers.groupId, parsed.data.id));
    const n = row?.n ?? 0;
    if (n > 0) return fail(`${n} ${n === 1 ? 'customer is' : 'customers are'} in this group. Move or delete them first.`);
    await db.delete(travelGroups).where(eq(travelGroups.id, parsed.data.id));
    refreshAdmin();
    return ok('Group deleted.');
  });
}
