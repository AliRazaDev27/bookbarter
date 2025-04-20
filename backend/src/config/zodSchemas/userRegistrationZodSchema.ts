import { z } from "zod";
const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters long")
        .max(50, "First name must not exceed 50 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name must not exceed 50 characters"),
    username: z.string().min(3, "Username must be at least 3 characters long")
        .max(20, "Username must not exceed 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email format")
        .min(5, "Email must be at least 5 characters long")
        .max(50, "Email must not exceed 100 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password must not exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
    mobileNo: z
        .string()
        .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits long"),
    address: z.string().min(5, "Address must be at least 5 characters long")
        .max(100, "Address must not exceed 100 characters"),
    picture: z.object({
    path: z.string(),
    mimetype: z.string(),
    originalname: z.string()
  }),    
});
export default schema;