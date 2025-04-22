import { userSchema } from "./user.ts";
import { postSchema } from "./posts.ts";
import { pgTable,serial,integer,timestamp,index,uniqueIndex } from "drizzle-orm/pg-core";

export const favoriteSchema = pgTable('favorites', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  postId: integer('post_id')
    .notNull()
    .references(() => postSchema.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
},(table) => [
  index('favorites_user_id_index').on(table.userId),
  index('favorIndexites_post_id_index').on(table.postId),
  // Optional: Ensure a user can favorite a post only once
  uniqueIndex('favorites_unique_user_post').on(table.userId, table.postId)
]);