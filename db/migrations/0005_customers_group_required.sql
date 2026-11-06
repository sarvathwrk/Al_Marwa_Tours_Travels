ALTER TABLE "customers" ADD COLUMN "group_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_group_id_travel_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."travel_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customers_group_idx" ON "customers" USING btree ("group_id");