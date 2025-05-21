import { pgTable,serial,integer,varchar,timestamp,boolean } from "drizzle-orm/pg-core";
import { userSchema } from "./user.ts";

export const notificationSchema = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull().references(() => userSchema.id,{ onDelete: "set null" }),
    notification: varchar('review', { length: 255 }).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});