import type { Request, Response } from "express";
import { userSchema } from "../models/user.ts";
import { db } from "../config/db.ts";
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import userLoginZodSchema from "../config/zodSchemas/userLoginZodSchema.ts";
import userRegistrationZodSchema from "../config/zodSchemas/userRegistrationZodSchema.ts";
import { z } from "zod";
import fs from 'fs/promises';

export async function register(req: Request, res: Response) {
  try {
    userRegistrationZodSchema.parse(
      {
        ...req.body,
        picture: req?.file
      }
    )
    const { firstName, lastName, username, email, password, mobileNo, address }: { firstName: string | undefined, lastName: string | undefined, username: string | undefined, email: string | undefined, password: string | undefined, mobileNo: string | undefined, address: string | undefined } = req.body;
    const picture = req?.file?.path;
    if (!picture) throw new Error("Picture is required", { cause: 400 });
    if (!firstName || !lastName || !username || !email || !password || !mobileNo || !address) {
      throw new Error("All fields are required", { cause: 400 });
    }
    const existingUserWithEmail = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (existingUserWithEmail.length > 0) {
      throw new Error("Email already exists", { cause: 409 });
    }
    const existingUserWithUsername = await db.select().from(userSchema).where(eq(userSchema.username, username));
    if (existingUserWithUsername.length > 0) {
      throw new Error("Username already exists", { cause: 409 });
    }

    const hashed_password = await bcrypt.hash(password!, 10);
    await db.insert(userSchema).values({
      firstName: firstName!,
      lastName: lastName!,
      username: username!,
      email: email!,
      password: hashed_password,
      mobileNo: mobileNo!,
      address: address!,
      picture: picture!,
      status: "unverified",
      role: "user",
    });
    res.status(201).json({ error: null });
  } catch (error: any) {
    // delete the uploaded file if it exists
    if (req?.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
    if (error instanceof z.ZodError) {
      res.status(422).json({
        error: error.flatten().fieldErrors
      });
    }
    else {
      if (error?.message) {
        res.status(error?.cause).json({ error: error?.message });
      }
      else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
export async function login(req: Request, res: Response) {
  try {
    userLoginZodSchema.parse(req.body); // Validate request body against the schema
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (!user || user.length === 0) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.cookie('test', "authIsEasy", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.json({ success: true, message: "User logged in successfully!", data: { ...user[0], picture: user[0].picture ? `${baseUrl}/${user[0].picture}` : null, } });
  } catch (error: any) {
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
export async function logout(req: Request, res: Response) {
  try {

  }
  catch (error: any) {

  }
}
export async function session(req: Request, res: Response) {
  try {

  }
  catch (error: any) {

  }
}
