CREATE TYPE "public"."listing_status" AS ENUM('active', 'sold', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('battery', 'repair', 'cell');--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "listing_type" NOT NULL,
	"model_slug" text NOT NULL,
	"price" integer NOT NULL,
	"location" text NOT NULL,
	"warranty_months" integer,
	"phone" text,
	"status" "listing_status" DEFAULT 'active' NOT NULL,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "listings_price_nonneg" CHECK ("listings"."price" >= 0),
	CONSTRAINT "listings_warranty_nonneg" CHECK ("listings"."warranty_months" >= 0)
);
--> statement-breakpoint
ALTER TABLE "listings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "listings_active_created_idx" ON "listings" USING btree ("created_at" DESC NULLS LAST) WHERE "listings"."status" = 'active';--> statement-breakpoint
CREATE INDEX "listings_active_model_created_idx" ON "listings" USING btree ("model_slug","created_at" DESC NULLS LAST) WHERE "listings"."status" = 'active';