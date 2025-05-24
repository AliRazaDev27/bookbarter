import { z } from "zod";

export const createNotificationZodSchema = z.object({
  postId: z.number().int().positive(),
  notification: z.string().min(1).max(255),
});
