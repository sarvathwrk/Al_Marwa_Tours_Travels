import { sql } from 'drizzle-orm';
import { boolean, check, date, doublePrecision, index, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { CUSTOMER_STATUSES, ENQUIRY_INTERESTS, ENQUIRY_STATUSES, PACKAGE_KINDS, VISA_STATUSES } from '../lib/constants';

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
    durationTa: text('duration_ta').notNull().default(''),
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
    nameTa: text('name_ta').notNull().default(''),
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

/**
 * A travel group / batch (e.g. "Umrah Ramadan 2027"): customers travelling together share its type and dates.
 * Every customer belongs to exactly one group.
 */
export const travelGroups = pgTable(
  'travel_groups',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
    kind: packageKind('kind').notNull().default('umrah'),
    departureDate: date('departure_date', { mode: 'string' }),
    returnDate: date('return_date', { mode: 'string' }),
    departureCity: text('departure_city').notNull().default(''),
    /** Seats available in the group. Blank = not limited. */
    capacity: integer('capacity'),
    notes: text('notes').notNull().default(''),
    ...timestamps,
  },
  (t) => [
    check('travel_groups_name_not_blank', sql`length(btrim(${t.name})) > 0`),
    check('travel_groups_capacity_positive', sql`${t.capacity} is null or ${t.capacity} between 1 and 5000`),
    check('travel_groups_dates_order', sql`${t.departureDate} is null or ${t.returnDate} is null or ${t.returnDate} >= ${t.departureDate}`),
    index('travel_groups_departure_idx').on(t.departureDate),
  ],
);

export const customerStatus = pgEnum('customer_status', CUSTOMER_STATUSES);
export const visaStatus = pgEnum('visa_status', VISA_STATUSES);

/**
 * People who applied for Hajj / Umrah / Ziyarah: personal details, travel details and payments.
 * No files are stored; `documentsUrl` is only a link (e.g. a shared folder).
 */
export const customers = pgTable(
  'customers',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    // personal
    name: text('name').notNull(),
    gender: text('gender').notNull().default(''),
    dateOfBirth: date('date_of_birth', { mode: 'string' }),
    phone: text('phone').notNull(),
    whatsapp: text('whatsapp').notNull().default(''),
    email: text('email').notNull().default(''),
    address: text('address').notNull().default(''),
    emergencyContact: text('emergency_contact').notNull().default(''),
    passportNumber: text('passport_number').notNull().default(''),
    passportExpiry: date('passport_expiry', { mode: 'string' }),
    // travel
    /** Required. A group cannot be deleted while customers belong to it. */
    groupId: integer('group_id')
      .notNull()
      .references(() => travelGroups.id, { onDelete: 'restrict' }),
    packageId: integer('package_id').references(() => packages.id, { onDelete: 'set null' }),
    /** Name of the package when it was chosen, so the record survives the package being deleted. */
    packageName: text('package_name').notNull().default(''),
    travellers: integer('travellers').notNull().default(1),
    visaStatus: visaStatus('visa_status').notNull().default('not_started'),
    documentsUrl: text('documents_url').notNull().default(''),
    // payments, whole rupees
    totalAmount: integer('total_amount'),
    paidAmount: integer('paid_amount').notNull().default(0),
    // pipeline
    status: customerStatus('status').notNull().default('applied'),
    notes: text('notes').notNull().default(''),
    /** Set when the customer was created from a website enquiry (one customer per enquiry). */
    enquiryId: integer('enquiry_id')
      .unique()
      .references(() => enquiries.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (t) => [
    check('customers_name_not_blank', sql`length(btrim(${t.name})) > 0`),
    check('customers_gender', sql`${t.gender} in ('', 'male', 'female')`),
    check('customers_travellers_range', sql`${t.travellers} between 1 and 500`),
    check('customers_amounts_non_negative', sql`${t.paidAmount} >= 0 and (${t.totalAmount} is null or ${t.totalAmount} >= 0)`),
    check('customers_documents_https', sql`${t.documentsUrl} = '' or ${t.documentsUrl} ~ '^https://'`),
    index('customers_status_idx').on(t.status),
    index('customers_group_idx').on(t.groupId),
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

export type TravelGroup = typeof travelGroups.$inferSelect;
export type NewTravelGroup = typeof travelGroups.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
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
