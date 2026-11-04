CREATE TYPE "public"."enquiry_interest" AS ENUM('umrah', 'hajj', 'family_umrah', 'ziyarah', 'other');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "enquiries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"interest" "enquiry_interest" DEFAULT 'umrah' NOT NULL,
	"travellers" integer,
	"message" text DEFAULT '' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"ip_hash" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enquiries_travellers_range" CHECK ("enquiries"."travellers" is null or "enquiries"."travellers" between 1 and 500),
	CONSTRAINT "enquiries_locale" CHECK ("enquiries"."locale" in ('en', 'ta'))
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "faqs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"question_en" text NOT NULL,
	"question_ta" text DEFAULT '' NOT NULL,
	"answer_en" text NOT NULL,
	"answer_ta" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "founder" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name_en" text NOT NULL,
	"name_ta" text DEFAULT '' NOT NULL,
	"role_en" text DEFAULT '' NOT NULL,
	"role_ta" text DEFAULT '' NOT NULL,
	"bio_en" text DEFAULT '' NOT NULL,
	"bio_ta" text DEFAULT '' NOT NULL,
	"photo_url" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "founder_singleton" CHECK ("founder"."id" = 1),
	CONSTRAINT "founder_photo_https" CHECK ("founder"."photo_url" = '' or "founder"."photo_url" ~ '^https://')
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gallery_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"image_url" text NOT NULL,
	"caption_en" text NOT NULL,
	"caption_ta" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_items_image_https" CHECK ("gallery_items"."image_url" ~ '^https://')
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value" text NOT NULL,
	"label_en" text NOT NULL,
	"label_ta" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stats_value_not_blank" CHECK (length(btrim("stats"."value")) > 0)
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscribers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"ip_hash" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "subscribers_email_lowercase" CHECK ("subscribers"."email" = lower("subscribers"."email")),
	CONSTRAINT "subscribers_locale" CHECK ("subscribers"."locale" in ('en', 'ta'))
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "testimonials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"detail_en" text DEFAULT '' NOT NULL,
	"detail_ta" text DEFAULT '' NOT NULL,
	"quote_en" text NOT NULL,
	"quote_ta" text DEFAULT '' NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_rating_range" CHECK ("testimonials"."rating" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "longitude" double precision;--> statement-breakpoint
CREATE INDEX "enquiries_status_created_idx" ON "enquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "enquiries_ip_created_idx" ON "enquiries" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "faqs_active_sort_idx" ON "faqs" USING btree ("active","sort");--> statement-breakpoint
CREATE INDEX "gallery_items_active_sort_idx" ON "gallery_items" USING btree ("active","sort");--> statement-breakpoint
CREATE INDEX "stats_active_sort_idx" ON "stats" USING btree ("active","sort");--> statement-breakpoint
CREATE INDEX "subscribers_ip_created_idx" ON "subscribers" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "testimonials_active_sort_idx" ON "testimonials" USING btree ("active","sort");--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_latitude_range" CHECK ("site_settings"."latitude" is null or "site_settings"."latitude" between -90 and 90);--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_longitude_range" CHECK ("site_settings"."longitude" is null or "site_settings"."longitude" between -180 and 180);--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_coords_pair" CHECK (("site_settings"."latitude" is null) = ("site_settings"."longitude" is null));