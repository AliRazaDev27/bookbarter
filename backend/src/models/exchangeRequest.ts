import { pgTable,pgEnum,serial,integer,timestamp,varchar,time,date } from "drizzle-orm/pg-core";
import { userSchema } from "./user.ts";
import { postSchema } from "./posts.ts";

export const exchangeRequestStatusEnum = pgEnum("exchange_request_status", [
    "pending",
    "proposed",
    "confirmed",
    "rejected",
    "cancelled",
    "expired",
    "completed"
]);

export const exchangeRequestSchema = pgTable('exchange_requests', {
    id: serial('id').primaryKey(),
    senderId: integer('sender_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'set null' }),
    receiverId: integer('receiver_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'set null' }),
    postId: integer('post_id')
    .notNull()
    .references(() => postSchema.id, { onDelete: 'set null' }),
    barterId: integer('barter_id')
    .references(() => postSchema.id, { onDelete: 'set null' }),
    note: varchar('note', { length: 512 }),
    location: varchar('location', { length: 255 }),
    time: time('time', { withTimezone: false }),
    date: date('date', { mode: 'date'}),
    status: exchangeRequestStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ExchangeRequest = typeof exchangeRequestSchema.$inferSelect;
export type InsertExchangeRequest = typeof exchangeRequestSchema.$inferInsert;