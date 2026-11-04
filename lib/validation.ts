import { z } from 'zod';
import { ENQUIRY_INTERESTS, ENQUIRY_STATUSES, PACKAGE_KINDS } from './constants';
import { isLocale, tr, type Locale } from './i18n';

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`).default('');
const required = (max: number, label: string) =>
  z.string().trim().min(1, `Enter ${label}`).max(max, `Keep this under ${max} characters`);

const checkbox = z
  .string()
  .optional()
  .transform((v) => v === 'on');

const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);

/** One item per line -> string[]. */
const lines = (maxItems: number, maxLen: number) =>
  z
    .string()
    .default('')
    .transform((s) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(maxLen, `Keep each line under ${maxLen} characters`)).max(maxItems, `Use at most ${maxItems} lines`));

/** Whole rupees. Blank = "Enquire for price" (null). Accepts "1,25,000" and "₹ 125000". */
const priceInr = z
  .string()
  .default('')
  .transform((s) => s.replace(/[₹,\s]/g, ''))
  .refine((s) => s === '' || /^\d{1,9}$/.test(s), 'Enter whole rupees using digits only, or leave blank')
  .transform((s) => (s === '' ? null : Number(s)));

const optionalId = z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.coerce.number().int().positive().optional());

const optionalUrl = z
  .string()
  .trim()
  .default('')
  .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), 'Enter a full link starting with https://');

export const packageSchema = z.object({
  id: optionalId,
  kind: z.enum(PACKAGE_KINDS, 'Choose Hajj, Umrah or Ziyarah'),
  nameEn: required(80, 'the English name'),
  nameTa: text(120),
  taglineEn: text(200),
  taglineTa: text(300),
  duration: text(40),
  durationTa: text(60),
  priceInr,
  featuresEn: lines(10, 140),
  featuresTa: lines(10, 200),
  featured: checkbox,
  active: checkbox,
  sort: sortOrder,
});
export type PackageInput = z.infer<typeof packageSchema>;

export const offerSchema = z.object({
  id: optionalId,
  titleEn: required(100, 'the English title'),
  titleTa: text(160),
  bodyEn: text(300),
  bodyTa: text(500),
  active: checkbox,
  sort: sortOrder,
});
export type OfferInput = z.infer<typeof offerSchema>;

/** "11.0168" -> 11.0168, blank -> null. */
const coordinate = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .default('')
    .transform((v) => (v === '' ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= min && v <= max), `${label} must be a number between ${min} and ${max}`);

export const settingsSchema = z.object({
  phoneDisplay: required(30, 'a phone number').min(5, 'Enter a phone number'),
  whatsapp: z
    .string()
    .default('')
    .transform((s) => s.replace(/\D/g, ''))
    .refine((s) => /^\d{8,15}$/.test(s), 'Enter the number with country code, e.g. 91 99435 15474'),
  email: z
    .string()
    .trim()
    .max(120)
    .default('')
    .refine((v) => v === '' || z.email().safeParse(v).success, 'Enter a valid email address, or leave blank'),
  addressEn: text(200),
  addressTa: text(200),
  hoursEn: text(200),
  hoursTa: text(200),
  instagram: optionalUrl,
  facebook: optionalUrl,
  latitude: coordinate(-90, 90, 'Latitude'),
  longitude: coordinate(-180, 180, 'Longitude'),
}).refine((v) => (v.latitude === null) === (v.longitude === null), {
  path: ['longitude'],
  message: 'Enter both latitude and longitude, or leave both blank',
});
export type SettingsInput = z.infer<typeof settingsSchema>;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]{3,40}$/, 'Use 3–40 characters: letters, numbers, dot, dash or underscore');

export const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1, 'Enter your username').max(60),
  password: z.string().min(1, 'Enter your password').max(200),
});

export const accountSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password').max(200),
    username: usernameSchema,
    newPassword: z.string().max(200).default(''),
    confirmPassword: z.string().max(200).default(''),
  })
  .refine((v) => v.newPassword === '' || v.newPassword.length >= 10, {
    path: ['newPassword'],
    message: 'Use at least 10 characters',
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
export type AccountInput = z.infer<typeof accountSchema>;

// ---------- content sections ----------

const rating = z.coerce.number().int().min(1, 'Choose 1 to 5').max(5, 'Choose 1 to 5').default(5);
const httpsLink = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^https:\/\/\S+$/.test(v), 'Enter a full link starting with https://');
const optionalHttpsLink = z
  .string()
  .trim()
  .max(500)
  .default('')
  .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), 'Enter a full link starting with https://, or leave blank');

export const statSchema = z.object({
  id: optionalId,
  value: required(20, 'the number, e.g. 200+'),
  labelEn: required(80, 'the English label'),
  labelTa: text(120),
  sort: sortOrder,
  active: checkbox,
});

export const gallerySchema = z.object({
  id: optionalId,
  imageUrl: httpsLink,
  captionEn: required(100, 'the English caption'),
  captionTa: text(160),
  sort: sortOrder,
  active: checkbox,
});

export const testimonialSchema = z.object({
  id: optionalId,
  name: required(80, 'the traveller’s name'),
  nameTa: text(120),
  detailEn: text(100),
  detailTa: text(160),
  quoteEn: required(500, 'the review'),
  quoteTa: text(800),
  rating,
  sort: sortOrder,
  active: checkbox,
});

export const faqSchema = z.object({
  id: optionalId,
  questionEn: required(160, 'the English question'),
  questionTa: text(240),
  answerEn: required(800, 'the English answer'),
  answerTa: text(1200),
  sort: sortOrder,
  active: checkbox,
});

export const founderSchema = z.object({
  nameEn: required(80, 'the English name'),
  nameTa: text(120),
  roleEn: text(100),
  roleTa: text(160),
  bioEn: text(1500),
  bioTa: text(2500),
  photoUrl: optionalHttpsLink,
  active: checkbox,
});

export const enquiryStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(ENQUIRY_STATUSES),
});

// ---------- public forms (messages follow the visitor's language) ----------

const msg = (lang: Locale, en: string, ta: string) => tr(lang, en, ta);

export function localeFrom(fd: FormData): Locale {
  const v = fd.get('lang');
  return typeof v === 'string' && isLocale(v) ? v : 'en';
}

export const enquirySchema = (lang: Locale) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, msg(lang, 'Enter your name', 'உங்கள் பெயரை உள்ளிடவும்'))
      .max(80, msg(lang, 'Keep the name under 80 characters', 'பெயர் 80 எழுத்துகளுக்குள் இருக்கட்டும்')),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, msg(lang, 'Enter a valid mobile number, e.g. +91 99435 15474', 'சரியான கைபேசி எண்ணை உள்ளிடவும், எ.கா. +91 99435 15474')),
    email: z
      .string()
      .trim()
      .max(120)
      .default('')
      .refine((v) => v === '' || z.email().safeParse(v).success, msg(lang, 'Enter a valid email, or leave it blank', 'சரியான மின்னஞ்சலை உள்ளிடவும் அல்லது காலியாக விடவும்')),
    interest: z.enum(ENQUIRY_INTERESTS).default('umrah'),
    travellers: z
      .string()
      .trim()
      .default('')
      .refine((v) => v === '' || (/^\d{1,3}$/.test(v) && Number(v) >= 1 && Number(v) <= 500), msg(lang, 'Enter 1 to 500', '1 முதல் 500 வரை உள்ளிடவும்'))
      .transform((v) => (v === '' ? null : Number(v))),
    message: z.string().trim().max(600, msg(lang, 'Keep the message under 600 characters', 'செய்தி 600 எழுத்துகளுக்குள் இருக்கட்டும்')).default(''),
    /** Honeypot: real visitors never see or fill this. */
    website: z.string().default(''),
  });

export const subscribeSchema = (lang: Locale) =>
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(120)
      .refine((v) => z.email().safeParse(v).success, msg(lang, 'Enter a valid email address', 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்')),
    website: z.string().default(''),
  });
