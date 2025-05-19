ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_sender_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_receiver_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "exchange_requests" DROP CONSTRAINT "exchange_requests_barter_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_barter_id_posts_id_fk" FOREIGN KEY ("barter_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;