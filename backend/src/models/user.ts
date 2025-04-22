import { pgTable, serial, char, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";


export const userStatusEnum = pgEnum("user_status", ["unverified", "active", "blocked","deleted"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const userSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar("first_name", { length: 20 }).notNull(),
  lastName: varchar("last_name", { length: 20 }).notNull(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: char("password", { length: 60 }).notNull(),
  mobileNo: varchar("mobile_no", { length: 15 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  picture: varchar("picture", { length: 255 }).notNull(),
  status: userStatusEnum("status").notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(()=>new Date()),
});
        
export type SelectUser = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;