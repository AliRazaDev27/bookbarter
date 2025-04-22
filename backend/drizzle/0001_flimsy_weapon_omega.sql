CREATE TYPE "public"."book_category" AS ENUM('fiction', 'fantasy', 'science_fiction', 'mystery', 'thriller', 'romance', 'historical_fiction', 'literary_fiction', 'non_fiction', 'biography', 'memoir', 'self_help', 'philosophy', 'psychology', 'science', 'technology', 'business', 'economics', 'politics', 'history', 'travel', 'true_crime', 'health', 'spirituality', 'education', 'art', 'music', 'film', 'photography', 'comics', 'graphic_novel', 'children', 'middle_grade', 'young_adult', 'cookbook', 'hobby', 'diy', 'home_garden', 'crafts', 'religion', 'animals', 'sports', 'games', 'parenting', 'other');--> statement-breakpoint
CREATE TYPE "public"."book_condition_enum" AS ENUM('new', 'fine', 'good', 'acceptable', 'poor');--> statement-breakpoint
CREATE TYPE "public"."book_status_enum" AS ENUM('available', 'pending', 'exchanged', 'removed');--> statement-breakpoint
CREATE TYPE "public"."currency_enum" AS ENUM('USD', 'PKR');--> statement-breakpoint
CREATE TYPE "public"."exchange_type_enum" AS ENUM('pay', 'barter', 'free');--> statement-breakpoint
CREATE TYPE "public"."language_enum" AS ENUM('english', 'hindi', 'urdu', 'arabic', 'russian', 'chinese', 'japanese', 'korean', 'turkish', 'other');--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"language" "language_enum" NOT NULL,
	"description" varchar(512) NOT NULL,
	"category" "book_category" NOT NULL,
	"book_condition" "book_condition_enum" NOT NULL,
	"exchange_type" "exchange_type_enum" NOT NULL,
	"exchange_condition" varchar(512) NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"status" "book_status_enum" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" "currency_enum" NOT NULL,
	"is_negotiable" boolean DEFAULT false NOT NULL,
	"location_approximate" varchar(128) NOT NULL,
	"tags" varchar(32)[] NOT NULL,
	"images" varchar(255)[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT '2025-05-22T13:38:15.219Z' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favorites_user_id_index" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favorIndexites_post_id_index" ON "favorites" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_unique_user_post" ON "favorites" USING btree ("user_id","post_id");--> statement-breakpoint
CREATE INDEX "post_user_id_index" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_language_index" ON "posts" USING btree ("language");--> statement-breakpoint
CREATE INDEX "post_category_index" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "post_book_condition_index" ON "posts" USING btree ("book_condition");--> statement-breakpoint
CREATE INDEX "post_exchange_type_index" ON "posts" USING btree ("exchange_type");--> statement-breakpoint
CREATE INDEX "post_status_index" ON "posts" USING btree ("status");