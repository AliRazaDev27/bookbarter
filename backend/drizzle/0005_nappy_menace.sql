ALTER TABLE "exchange_requests" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange_requests" ALTER COLUMN "time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange_requests" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."exchange_requests" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."exchange_request_status";--> statement-breakpoint
CREATE TYPE "public"."exchange_request_status" AS ENUM('pending', 'proposed', 'confirmed', 'rejected', 'cancelled', 'expired', 'completed');--> statement-breakpoint
ALTER TABLE "public"."exchange_requests" ALTER COLUMN "status" SET DATA TYPE "public"."exchange_request_status" USING "status"::"public"."exchange_request_status";