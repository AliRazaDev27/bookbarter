import { z } from "zod";
const schema = z.object({
  username: z.string()
  .nonempty("Username cannot be empty")
  .min(3, "Username must be at least 3 characters long")
    .max(32, "Username must not exceed 32 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),
  password: z
    .string()
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});
export default schema;