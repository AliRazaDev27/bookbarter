import { z } from "zod";

export const bookConditionEnum = z.enum(["new", "fine", "good", "acceptable", "poor"]);
export const bookStatusEnum = z.enum(["available", "pending", "exchanged","removed"]);
export const exchangeTypeEnum = z.enum(["pay", "barter", "free"]);
export const currencyEnum = z.enum(["USD","PKR"]);
export const bookCategoryEnum = z.enum([
  "fiction",
  "fantasy",
  "science_fiction",
  "mystery",
  "thriller",
  "romance",
  "historical_fiction",
  "literary_fiction",
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
  "art",
  "music",
  "film",
  "photography",
  "comics",
  "graphic_novel",
  "children",
  "middle_grade",
  "young_adult",
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
  "other"
]);

export const languageEnum = z.enum([
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

export const postZodSchema = z.object({
    title: z.string().min(1).max(255),
    author: z.string().min(1).max(255),
    language: languageEnum,
    description: z.string().min(1).max(512),
    category: bookCategoryEnum,
    bookCondition: bookConditionEnum,
    exchangeType: exchangeTypeEnum,
    exchangeCondition: z.string().min(1).max(512),
    isPublic: z.boolean().default(true),
    price: z.string()
    .min(1)
    .max(9)
    .regex(/^\d+(\.\d{1,2})?$/).default("0"),
    currency: currencyEnum,
    isNegotiable: z.boolean().default(false),
    locationApproximate: z.string().min(1).max(128),
    tags: z.string().array(),
    images: z.instanceof(FileList)
    .refine((list) => list.length > 0, "No files selected")
    .refine((list) => list.length <= 5, "Maximum 5 files allowed")
});
