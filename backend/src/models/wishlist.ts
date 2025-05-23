import { pgTable,serial,integer,varchar,timestamp} from "drizzle-orm/pg-core";
import { userSchema } from "./user.ts";

export const wishlistSchema = pgTable('wishlist', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull().references(() => userSchema.id,{ onDelete: "set null" }),
    title: varchar('title', { length: 255 }),
    author: varchar('author', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});