import { sql } from 'drizzle-orm';
import { boolean, check, doublePrecision, index, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { ENQUIRY_INTERESTS, ENQUIRY_STATUSES, PACKAGE_KINDS } from '../lib/constants';

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
    /** Office location for the contact map. Both set, or both NULL (map hidden). */
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('site_settings_singleton', sql`${t.id} = 1`),
    check('site_settings_whatsapp_digits', sql`${t.whatsapp} ~ '^[0-9]{8,15}$'`),
    check('site_settings_latitude_range', sql`${t.latitude} is null or ${t.latitude} between -90 and 90`),
    check('site_settings_longitude_range', sql`${t.longitude} is null or ${t.longitude} between -180 and 180`),
    check('site_settings_coords_pair', sql`(${t.latitude} is null) = (${t.longitude} is null)`),
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

export const enquiryInterest = pgEnum('enquiry_interest', ENQUIRY_INTERESTS);
export const enquiryStatus = pgEnum('enquiry_status', ENQUIRY_STATUSES);

const sortActive = {
  sort: integer('sort').notNull().default(0),
  active: boolean('active').notNull().default(true),
};

/** Headline numbers on the About section (e.g. "200+" / "Pilgrims guided"). Section hides when empty. */
export const stats = pgTable(
  'stats',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    value: text('value').notNull(),
    labelEn: text('label_en').notNull(),
    labelTa: text('label_ta').notNull().default(''),
    ...sortActive,
    ...timestamps,
  },
  (t) => [
    check('stats_value_not_blank', sql`length(btrim(${t.value})) > 0`),
    index('stats_active_sort_idx').on(t.active, t.sort),
  ],
);

/** Photo carousel. Images are https URLs. */
export const galleryItems = pgTable(
  'gallery_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: text('image_url').notNull(),
    captionEn: text('caption_en').notNull(),
    captionTa: text('caption_ta').notNull().default(''),
    ...sortActive,
    ...timestamps,
  },
  (t) => [
    check('gallery_items_image_https', sql`${t.imageUrl} ~ '^https://'`),
    index('gallery_items_active_sort_idx').on(t.active, t.sort),
  ],
);

export const testimonials = pgTable(
  'testimonials',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    detailEn: text('detail_en').notNull().default(''),
    detailTa: text('detail_ta').notNull().default(''),
    quoteEn: text('quote_en').notNull(),
    quoteTa: text('quote_ta').notNull().default(''),
    rating: integer('rating').notNull().default(5),
    ...sortActive,
    ...timestamps,
  },
  (t) => [
    check('testimonials_rating_range', sql`${t.rating} between 1 and 5`),
    index('testimonials_active_sort_idx').on(t.active, t.sort),
  ],
);

export const faqs = pgTable(
  'faqs',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    questionEn: text('question_en').notNull(),
    questionTa: text('question_ta').notNull().default(''),
    answerEn: text('answer_en').notNull(),
    answerTa: text('answer_ta').notNull().default(''),
    ...sortActive,
    ...timestamps,
  },
  (t) => [index('faqs_active_sort_idx').on(t.active, t.sort)],
);

/** Exactly one row (id = 1): the "Meet our founder" block. Hidden when missing or inactive. */
export const founder = pgTable(
  'founder',
  {
    id: integer('id').primaryKey().default(1),
    nameEn: text('name_en').notNull(),
    nameTa: text('name_ta').notNull().default(''),
    roleEn: text('role_en').notNull().default(''),
    roleTa: text('role_ta').notNull().default(''),
    bioEn: text('bio_en').notNull().default(''),
    bioTa: text('bio_ta').notNull().default(''),
    photoUrl: text('photo_url').notNull().default(''),
    active: boolean('active').notNull().default(true),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('founder_singleton', sql`${t.id} = 1`),
    check('founder_photo_https', sql`${t.photoUrl} = '' or ${t.photoUrl} ~ '^https://'`),
  ],
);

/** Enquiries submitted from the website contact form. */
export const enquiries = pgTable(
  'enquiries',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email').notNull().default(''),
    interest: enquiryInterest('interest').notNull().default('umrah'),
    travellers: integer('travellers'),
    message: text('message').notNull().default(''),
    locale: text('locale').notNull().default('en'),
    status: enquiryStatus('status').notNull().default('new'),
    /** sha256(ip + secret). Used only for rate limiting, never the raw address. */
    ipHash: text('ip_hash').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('enquiries_travellers_range', sql`${t.travellers} is null or ${t.travellers} between 1 and 500`),
    check('enquiries_locale', sql`${t.locale} in ('en', 'ta')`),
    index('enquiries_status_created_idx').on(t.status, t.createdAt),
    index('enquiries_ip_created_idx').on(t.ipHash, t.createdAt),
  ],
);

/** Newsletter signups from the footer. */
export const subscribers = pgTable(
  'subscribers',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    email: text('email').notNull().unique(),
    locale: text('locale').notNull().default('en'),
    ipHash: text('ip_hash').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('subscribers_email_lowercase', sql`${t.email} = lower(${t.email})`),
    check('subscribers_locale', sql`${t.locale} in ('en', 'ta')`),
    index('subscribers_ip_created_idx').on(t.ipHash, t.createdAt),
  ],
);

export type Pkg = typeof packages.$inferSelect;
export type NewPkg = typeof packages.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Founder = typeof founder.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
