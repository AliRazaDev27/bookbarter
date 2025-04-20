import { pgTable, serial, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";


export const userStatusEnum = pgEnum("user_status", ["unverified", "active", "blocked"]);

export const userSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  mobileNo: varchar("mobile_no", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  picture: varchar("picture", { length: 255 }).notNull(),
  status: userStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
        
export type SelectUser = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;