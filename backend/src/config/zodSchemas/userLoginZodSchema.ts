import { z } from "zod";
const schema = z.object({
  email: z.string()
  .nonempty("Email cannot be empty")
  .min(6, "Email must be at least 6 characters long")
  .max(254, "Email must not exceed 254 characters")
  .email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});
export default schema;