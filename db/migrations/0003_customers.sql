CREATE TYPE "public"."customer_status" AS ENUM('applied', 'documents', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."visa_status" AS ENUM('not_started', 'applied', 'approved');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "customers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"gender" text DEFAULT '' NOT NULL,
	"date_of_birth" date,
	"phone" text NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"emergency_contact" text DEFAULT '' NOT NULL,
	"passport_number" text DEFAULT '' NOT NULL,
	"passport_expiry" date,
	"kind" "package_kind" DEFAULT 'umrah' NOT NULL,
	"package_id" integer,
	"package_name" text DEFAULT '' NOT NULL,
	"group_name" text DEFAULT '' NOT NULL,
	"travellers" integer DEFAULT 1 NOT NULL,
	"departure_date" date,
	"return_date" date,
	"departure_city" text DEFAULT '' NOT NULL,
	"visa_status" "visa_status" DEFAULT 'not_started' NOT NULL,
	"documents_url" text DEFAULT '' NOT NULL,
	"total_amount" integer,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"status" "customer_status" DEFAULT 'applied' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"enquiry_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_enquiry_id_unique" UNIQUE("enquiry_id"),
	CONSTRAINT "customers_name_not_blank" CHECK (length(btrim("customers"."name")) > 0),
	CONSTRAINT "customers_gender" CHECK ("customers"."gender" in ('', 'male', 'female')),
	CONSTRAINT "customers_travellers_range" CHECK ("customers"."travellers" between 1 and 500),
	CONSTRAINT "customers_amounts_non_negative" CHECK ("customers"."paid_amount" >= 0 and ("customers"."total_amount" is null or "customers"."total_amount" >= 0)),
	CONSTRAINT "customers_documents_https" CHECK ("customers"."documents_url" = '' or "customers"."documents_url" ~ '^https://')
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customers_status_idx" ON "customers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customers_group_idx" ON "customers" USING btree ("group_name");--> statement-breakpoint
CREATE INDEX "customers_departure_idx" ON "customers" USING btree ("departure_date");