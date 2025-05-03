ALTER TABLE "posts" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "exchange_condition" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'available';--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "price" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "currency" SET DEFAULT 'PKR';--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "is_negotiable";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "expires_at";