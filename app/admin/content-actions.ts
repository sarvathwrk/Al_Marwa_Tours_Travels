'use server';

import { eq } from 'drizzle-orm';
import { enquiries, faqs, founder, galleryItems, stats, subscribers, testimonials } from '@/db/schema';
import { guarded, idSchema, ok, publish, refreshAdmin } from '@/lib/admin-helpers';
import { requireDb } from '@/lib/db';
import { parseForm, type FormState } from '@/lib/form';
import { requireAdmin } from '@/lib/session';
import {
  enquiryStatusSchema,
  faqSchema,
  founderSchema,
  gallerySchema,
  statSchema,
  testimonialSchema,
} from '@/lib/validation';

// ---------- stats ----------

export async function saveStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(statSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;
  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(stats).set(values).where(eq(stats.id, id));
    else await db.insert(stats).values(values);
    publish();
    return ok(id ? 'Number saved.' : 'Number added.');
  });
}

export async function deleteStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(stats).where(eq(stats.id, parsed.data.id));
    publish();
    return ok('Number deleted.');
  });
}

// ---------- gallery ----------

export async function saveGalleryItem(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(gallerySchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;
  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(galleryItems).set(values).where(eq(galleryItems.id, id));
    else await db.insert(galleryItems).values(values);
    publish();
    return ok(id ? 'Photo saved.' : 'Photo added.');
  });
}

export async function deleteGalleryItem(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(galleryItems).where(eq(galleryItems.id, parsed.data.id));
    publish();
    return ok('Photo deleted.');
  });
}

// ---------- testimonials ----------

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(testimonialSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;
  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));
    else await db.insert(testimonials).values(values);
    publish();
    return ok(id ? 'Review saved.' : 'Review added.');
  });
}

export async function deleteTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(testimonials).where(eq(testimonials.id, parsed.data.id));
    publish();
    return ok('Review deleted.');
  });
}

// ---------- FAQ ----------

export async function saveFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(faqSchema, formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...values } = parsed.data;
  return guarded(async () => {
    const db = requireDb();
    if (id) await db.update(faqs).set(values).where(eq(faqs.id, id));
    else await db.insert(faqs).values(values);
    publish();
    return ok(id ? 'Question saved.' : 'Question added.');
  });
}

export async function deleteFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(faqs).where(eq(faqs.id, parsed.data.id));
    publish();
    return ok('Question deleted.');
  });
}

// ---------- founder (single row) ----------

export async function saveFounder(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(founderSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb()
      .insert(founder)
      .values({ id: 1, ...parsed.data })
      .onConflictDoUpdate({ target: founder.id, set: parsed.data });
    publish();
    return ok('Founder details saved.');
  });
}

export async function deleteFounder(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  void formData;
  return guarded(async () => {
    await requireDb().delete(founder).where(eq(founder.id, 1));
    publish();
    return ok('Founder section removed.');
  });
}

// ---------- inbox ----------

export async function setEnquiryStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(enquiryStatusSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().update(enquiries).set({ status: parsed.data.status }).where(eq(enquiries.id, parsed.data.id));
    refreshAdmin();
    return ok('Status updated.');
  });
}

export async function deleteEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(enquiries).where(eq(enquiries.id, parsed.data.id));
    refreshAdmin();
    return ok('Enquiry deleted.');
  });
}

export async function deleteSubscriber(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(idSchema, formData);
  if (!parsed.ok) return parsed.state;
  return guarded(async () => {
    await requireDb().delete(subscribers).where(eq(subscribers.id, parsed.data.id));
    refreshAdmin();
    return ok('Subscriber removed.');
  });
}
