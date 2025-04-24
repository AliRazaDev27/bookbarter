import { z } from "zod";
const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters long")
        .max(20, "First name must not exceed 20 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters long")
        .max(20, "Last name must not exceed 20 characters"),
    username: z.string().min(6, "Username must be at least 6 characters long")
        .max(30, "Username must not exceed 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email format")
        .min(6, "Email must be at least 6 characters long")
        .max(254, "Email must not exceed 254 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
    mobileNo: z
        .string()
        .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits long"),
    address: z.string().min(5, "Address must be at least 5 characters long")
        .max(255, "Address must not exceed 255 characters"),
    picture: z.object({
    path: z.string(),
    mimetype: z.string(),
    originalname: z.string()
  }), 
});
export default schema;