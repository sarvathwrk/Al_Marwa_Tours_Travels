import { z } from 'zod';
import { PACKAGE_KINDS } from './constants';

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
