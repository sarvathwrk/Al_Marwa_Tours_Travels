import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { PACKAGE_KINDS } from '../lib/constants';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const packageKind = pgEnum('package_kind', PACKAGE_KINDS);

/** Hajj / Umrah / Ziyarah packages shown on the site. English is required, Tamil falls back to English. */
export const packages = pgTable(
  'packages',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    kind: packageKind('kind').notNull(),
    nameEn: text('name_en').notNull(),
    nameTa: text('name_ta').notNull().default(''),
    taglineEn: text('tagline_en').notNull().default(''),
    taglineTa: text('tagline_ta').notNull().default(''),
    duration: text('duration').notNull().default(''),
    /** Whole rupees (INR). NULL means "Enquire for price". */
    priceInr: integer('price_inr'),
    featuresEn: text('features_en').array().notNull().default(sql`'{}'::text[]`),
    featuresTa: text('features_ta').array().notNull().default(sql`'{}'::text[]`),
    featured: boolean('featured').notNull().default(false),
    active: boolean('active').notNull().default(true),
    sort: integer('sort').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    check('packages_price_inr_non_negative', sql`${t.priceInr} is null or ${t.priceInr} >= 0`),
    check('packages_name_en_not_blank', sql`length(btrim(${t.nameEn})) > 0`),
    index('packages_active_sort_idx').on(t.active, t.sort),
  ],
);

/** Exactly one row (id = 1): contact details shown across the site. */
export const siteSettings = pgTable(
  'site_settings',
  {
    id: integer('id').primaryKey().default(1),
    phoneDisplay: text('phone_display').notNull(),
    /** Digits only, with country code, e.g. 919943515474. Used for wa.me links. */
    whatsapp: text('whatsapp').notNull(),
    email: text('email').notNull().default(''),
    addressEn: text('address_en').notNull().default(''),
    addressTa: text('address_ta').notNull().default(''),
    hoursEn: text('hours_en').notNull().default(''),
    hoursTa: text('hours_ta').notNull().default(''),
    instagram: text('instagram').notNull().default(''),
    facebook: text('facebook').notNull().default(''),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('site_settings_singleton', sql`${t.id} = 1`),
    check('site_settings_whatsapp_digits', sql`${t.whatsapp} ~ '^[0-9]{8,15}$'`),
  ],
);

/** Announcements shown in the "Latest offers & updates" popup. */
export const offers = pgTable(
  'offers',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    titleEn: text('title_en').notNull(),
    titleTa: text('title_ta').notNull().default(''),
    bodyEn: text('body_en').notNull().default(''),
    bodyTa: text('body_ta').notNull().default(''),
    active: boolean('active').notNull().default(true),
    sort: integer('sort').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    check('offers_title_en_not_blank', sql`length(btrim(${t.titleEn})) > 0`),
    index('offers_active_sort_idx').on(t.active, t.sort),
  ],
);

/** Admin accounts. Passwords are scrypt hashes ("salt:hash"), never plaintext. */
export const admins = pgTable(
  'admins',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    /** Bumped on password change; invalidates every existing session cookie. */
    tokenVersion: integer('token_version').notNull().default(0),
    failedAttempts: integer('failed_attempts').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check('admins_username_format', sql`${t.username} ~ '^[a-z0-9._-]{3,40}$'`)],
);

export type Pkg = typeof packages.$inferSelect;
export type NewPkg = typeof packages.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Admin = typeof admins.$inferSelect;
