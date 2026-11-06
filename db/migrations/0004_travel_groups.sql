CREATE TABLE "travel_groups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "travel_groups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"kind" "package_kind" DEFAULT 'umrah' NOT NULL,
	"departure_date" date,
	"return_date" date,
	"departure_city" text DEFAULT '' NOT NULL,
	"capacity" integer,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "travel_groups_name_unique" UNIQUE("name"),
	CONSTRAINT "travel_groups_name_not_blank" CHECK (length(btrim("travel_groups"."name")) > 0),
	CONSTRAINT "travel_groups_capacity_positive" CHECK ("travel_groups"."capacity" is null or "travel_groups"."capacity" between 1 and 5000),
	CONSTRAINT "travel_groups_dates_order" CHECK ("travel_groups"."departure_date" is null or "travel_groups"."return_date" is null or "travel_groups"."return_date" >= "travel_groups"."departure_date")
);
--> statement-breakpoint
DROP INDEX "customers_group_idx";--> statement-breakpoint
DROP INDEX "customers_departure_idx";--> statement-breakpoint
CREATE INDEX "travel_groups_departure_idx" ON "travel_groups" USING btree ("departure_date");--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "kind";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "group_name";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "departure_date";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "return_date";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "departure_city";