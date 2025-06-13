import { pgTable,serial,integer,varchar,timestamp,boolean } from "drizzle-orm/pg-core";
import { userSchema } from "./user.ts";

export const messageSchema = pgTable('messages', {
    id: serial('id').primaryKey(),
    senderId: integer("sender_id").notNull().references(() => userSchema.id,{ onDelete: "set null" }),
    receiverId: integer("receiver_id").notNull().references(() => userSchema.id,{ onDelete: "set null" }),
    message: varchar('review', { length: 255 }).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Message = typeof messageSchema.$inferSelect;