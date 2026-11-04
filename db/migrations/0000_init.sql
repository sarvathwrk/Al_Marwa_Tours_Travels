CREATE TYPE "public"."package_kind" AS ENUM('hajj', 'umrah', 'ziyarah');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"token_version" integer DEFAULT 0 NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username"),
	CONSTRAINT "admins_username_format" CHECK ("admins"."username" ~ '^[a-z0-9._-]{3,40}$')
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title_en" text NOT NULL,
	"title_ta" text DEFAULT '' NOT NULL,
	"body_en" text DEFAULT '' NOT NULL,
	"body_ta" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offers_title_en_not_blank" CHECK (length(btrim("offers"."title_en")) > 0)
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "packages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"kind" "package_kind" NOT NULL,
	"name_en" text NOT NULL,
	"name_ta" text DEFAULT '' NOT NULL,
	"tagline_en" text DEFAULT '' NOT NULL,
	"tagline_ta" text DEFAULT '' NOT NULL,
	"duration" text DEFAULT '' NOT NULL,
	"price_inr" integer,
	"features_en" text[] DEFAULT '{}'::text[] NOT NULL,
	"features_ta" text[] DEFAULT '{}'::text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "packages_price_inr_non_negative" CHECK ("packages"."price_inr" is null or "packages"."price_inr" >= 0),
	CONSTRAINT "packages_name_en_not_blank" CHECK (length(btrim("packages"."name_en")) > 0)
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"phone_display" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"address_en" text DEFAULT '' NOT NULL,
	"address_ta" text DEFAULT '' NOT NULL,
	"hours_en" text DEFAULT '' NOT NULL,
	"hours_ta" text DEFAULT '' NOT NULL,
	"instagram" text DEFAULT '' NOT NULL,
	"facebook" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton" CHECK ("site_settings"."id" = 1),
	CONSTRAINT "site_settings_whatsapp_digits" CHECK ("site_settings"."whatsapp" ~ '^[0-9]{8,15}$')
);
--> statement-breakpoint
CREATE INDEX "offers_active_sort_idx" ON "offers" USING btree ("active","sort");--> statement-breakpoint
CREATE INDEX "packages_active_sort_idx" ON "packages" USING btree ("active","sort");