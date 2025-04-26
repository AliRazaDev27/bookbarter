import { userSchema } from "./user.ts";
import { pgTable,pgEnum,numeric,serial,index,varchar,boolean,timestamp,integer } from "drizzle-orm/pg-core";

export const bookConditionEnum = pgEnum("book_condition_enum", ["new", "fine", "good", "acceptable", "poor"]);
export const bookStatusEnum = pgEnum("book_status_enum", ["available", "pending", "exchanged","removed"]);
export const exchangeTypeEnum = pgEnum("exchange_type_enum", ["pay", "barter", "free"]);
export const currencyEnum = pgEnum("currency_enum", ["USD","PKR"]);
export const bookCategoryEnum = pgEnum("book_category", [
  // Fiction
  "fiction",
  "fantasy",
  "science_fiction",
  "mystery",
  "thriller",
  "romance",
  "historical_fiction",
  "literary_fiction",
  // Non-Fiction
  "non_fiction",
  "biography",
  "memoir",
  "self_help",
  "philosophy",
  "psychology",
  "science",
  "technology",
  "business",
  "economics",
  "politics",
  "history",
  "travel",
  "true_crime",
  "health",
  "spirituality",
  "education",
  // Arts & Media
  "art",
  "music",
  "film",
  "photography",
  "comics",
  "graphic_novel",
  // Children & Teens
  "children",
  "middle_grade",
  "young_adult",
  // Special Interest
  "cookbook",
  "hobby",
  "diy",
  "home_garden",
  "crafts",
  "religion",
  "animals",
  "sports",
  "games",
  "parenting",
  // Other
  "other"
]);

export const languageEnum = pgEnum("language_enum", [
  "english",
  "hindi",
  "urdu",
  "arabic",
  "russian",
  "chinese",
  "japanese",
  "korean",
  "turkish",
  "other"
]);

export const postSchema = pgTable('posts', {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull().references(() => userSchema.id,{ onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    language: languageEnum("language").notNull(),
    description: varchar("description", { length: 512 }).notNull(),
    category: bookCategoryEnum("category").notNull(),
    bookCondition: bookConditionEnum("book_condition").notNull(),
    exchangeType: exchangeTypeEnum("exchange_type").notNull(),
    exchangeCondition: varchar("exchange_condition", { length: 512 }).notNull(),
    isPublic: boolean("is_public").default(true).notNull(),
    status: bookStatusEnum("status").default("available").notNull(), 
    price: numeric("price",{precision:10,scale:2}).notNull(),
    currency: currencyEnum("currency").notNull(),
    isNegotiable: boolean("is_negotiable").default(false).notNull(),
    locationApproximate: varchar("location_approximate", { length: 128 }).notNull(),
    tags: varchar("tags", { length: 32 }).array().notNull(),
    images: varchar("images", { length: 255 }).array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(()=>new Date()),
    expiresAt: timestamp("expires_at", { withTimezone: true }).default(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
}, (post) => ([
    index("post_user_id_index").on(post.userId),
    index("post_language_index").on(post.language),
    index("post_category_index").on(post.category),
    index("post_book_condition_index").on(post.bookCondition),
    index("post_exchange_type_index").on(post.exchangeType),
    index("post_status_index").on(post.status),
]
));

export type Post = typeof postSchema.$inferSelect;
export type InsertPost = typeof postSchema.$inferInsert;