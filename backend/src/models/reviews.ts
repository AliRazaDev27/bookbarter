import { pgTable,serial,integer,varchar,timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "./user.ts";
import { postSchema } from "./posts.ts";

export const reviewsSchema = pgTable('reviews', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull().references(() => userSchema.id,{ onDelete: "set null" }),
    postId: integer("post_id").notNull().references(() => postSchema.id,{ onDelete: "set null" }),
    rating: integer('rating').notNull(),
    review: varchar('review', { length: 512 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});