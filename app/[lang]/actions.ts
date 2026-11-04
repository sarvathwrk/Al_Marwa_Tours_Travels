'use server';

import { createHash } from 'node:crypto';
import { and, count, eq, gte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { enquiries, subscribers } from '@/db/schema';
import { requireDb } from '@/lib/db';
import { parseForm, type FormState } from '@/lib/form';
import { tr } from '@/lib/i18n';
import { enquirySchema, localeFrom, subscribeSchema } from '@/lib/validation';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Hash of the caller's IP, only used to rate-limit. The raw address is never stored. */
async function callerHash() {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(`${ip}|${process.env.AUTH_SECRET ?? ''}`).digest('hex');
}

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = localeFrom(formData);
  const parsed = parseForm(enquirySchema(lang), formData);
  if (!parsed.ok) {
    return {
      ...parsed.state,
      message: tr(lang, 'Please check the highlighted fields.', 'குறிக்கப்பட்ட புலங்களைச் சரிபார்க்கவும்.'),
    };
  }
  const { website, ...data } = parsed.data;
  const fields = { name: data.name, phone: data.phone, interest: data.interest, travellers: String(data.travellers ?? ''), message: data.message };

  // Bots fill the hidden field. Pretend it worked and store nothing.
  if (website) return { status: 'success', fields };

  try {
    const db = requireDb();
    const ipHash = await callerHash();
    const since = new Date(Date.now() - WINDOW_MS);
    const [recent] = await db
      .select({ n: count() })
      .from(enquiries)
      .where(and(eq(enquiries.ipHash, ipHash), gte(enquiries.createdAt, since)));
    if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
      return {
        status: 'error',
        message: tr(lang, 'Too many enquiries from this device. Please message us on WhatsApp instead.', 'இந்த சாதனத்திலிருந்து அதிக விசாரணைகள் வந்துள்ளன. தயவுசெய்து வாட்ஸ்அப்பில் தொடர்புகொள்ளுங்கள்.'),
        fields,
      };
    }
    await db.insert(enquiries).values({ ...data, locale: lang, ipHash });
  } catch (err) {
    console.error('[enquiry] save failed:', err instanceof Error ? err.message : err);
    return {
      status: 'error',
      message: tr(lang, 'We could not save your enquiry. Please message us on WhatsApp.', 'உங்கள் விசாரணையைச் சேமிக்க முடியவில்லை. தயவுசெய்து வாட்ஸ்அப்பில் தொடர்புகொள்ளுங்கள்.'),
    };
  }

  return {
    status: 'success',
    message: tr(lang, 'Thank you. We have received your enquiry and will contact you soon.', 'நன்றி. உங்கள் விசாரணை எங்களுக்குக் கிடைத்தது; விரைவில் தொடர்புகொள்வோம்.'),
    fields,
  };
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = localeFrom(formData);
  const parsed = parseForm(subscribeSchema(lang), formData);
  if (!parsed.ok) return { ...parsed.state, message: undefined };
  const { website, email } = parsed.data;
  const thanks = tr(lang, 'Thank you. You are subscribed.', 'நன்றி. நீங்கள் சந்தாதாரராகிவிட்டீர்கள்.');
  if (website) return { status: 'success', message: thanks };

  try {
    const db = requireDb();
    const ipHash = await callerHash();
    const since = new Date(Date.now() - WINDOW_MS);
    const [recent] = await db
      .select({ n: count() })
      .from(subscribers)
      .where(and(eq(subscribers.ipHash, ipHash), gte(subscribers.createdAt, since)));
    if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
      return { status: 'error', message: tr(lang, 'Too many attempts. Please try again later.', 'அதிக முயற்சிகள். பின்னர் முயற்சிக்கவும்.') };
    }
    // Duplicates succeed silently so the form never reveals who is already subscribed.
    await db.insert(subscribers).values({ email, locale: lang, ipHash }).onConflictDoNothing({ target: subscribers.email });
  } catch (err) {
    console.error('[subscribe] failed:', err instanceof Error ? err.message : err);
    return { status: 'error', message: tr(lang, 'Could not subscribe right now. Please try again.', 'இப்போது சந்தா சேர்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.') };
  }
  return { status: 'success', message: thanks };
}
