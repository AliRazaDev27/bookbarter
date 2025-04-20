import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/index.ts';
import adminLoginZodSchema from '../config/zodSchemas/adminLoginZodSchema.ts'
import { z } from 'zod';
export async function adminLogin(req: Request, res: Response) {
    try {
        adminLoginZodSchema.parse(req.body); // Validate request body against the schema
        const { username, password } = req.body;
        const admin_username = process.env.ADMIN_USERNAME;
        const admin_password = process.env.ADMIN_PASSWORD_HASH;
        if (!admin_username || !admin_password) {
            console.log("Admin credentials not set in environment variables.");
            throw new Error("Internal server error");
        }
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        if (username !== admin_username) {
            throw new Error("Invalid username");
        }
        const isPasswordValid = await bcrypt.compare(password, admin_password!);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = generateToken();
        res.cookie('admin-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000, // 1 hour
        });
        res.json({ success: true, message: "Admin logged in successfully!" });
    }
    catch (error: any) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.errors.map(e => {
                // Customize the "required" error
                if (e.code === 'invalid_type' && e.message === 'Required') {
                    return {
                        path: e.path.join('.'),
                        message: `${e.path.join('.')} is required`,
                    };
                }

                return {
                    path: e.path.join('.'),
                    message: e.message,
                };
            });

            res.json({
                success: false,
                errors: formattedErrors,
            });
        }
        else {
            res.json({ success: false, message: error.message || "Internal server error" });
        }
    }
}
