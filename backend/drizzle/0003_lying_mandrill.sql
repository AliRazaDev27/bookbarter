CREATE TYPE "public"."exchange_request_status" AS ENUM('rejected', 'accepted', 'pending', 'cancelled', 'unavailable', 'completed');--> statement-breakpoint
CREATE TABLE "exchange_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"barter_id" integer,
	"note" varchar(512),
	"location" varchar(255) NOT NULL,
	"time" time NOT NULL,
	"date" date NOT NULL,
	"status" "exchange_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_barter_id_posts_id_fk" FOREIGN KEY ("barter_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;