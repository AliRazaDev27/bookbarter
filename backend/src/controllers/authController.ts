import type { Request, Response } from "express";
import { userSchema } from "../models/user.ts";
import { db } from "../config/db.ts";
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import userLoginZodSchema from "../config/zodSchemas/userLoginZodSchema.ts";
import userRegistrationZodSchema from "../config/zodSchemas/userRegistrationZodSchema.ts";
import { z } from "zod";
import fs from 'fs/promises';
import jwt from "jsonwebtoken";
import { getCurrentUserId } from "../utils/index.ts";

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
      throw new Error("Email and password are required", { cause: 400 });
    }
    const user = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (!user || user.length === 0) {
      throw new Error("User not found", { cause: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error("Invalid password", { cause: 401 });
    }
    const tokenData = {
      id: user[0].id,
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined", { cause: 500 });
    }
    const token =  jwt.sign(tokenData, secret);

    res.cookie('auth-token', token, {
      sameSite: "none",
      httpOnly: true,
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });


    res.status(200).json({ error:null });
  } catch (error: any) {
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
export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie('auth-token');
    res.status(200).end();
  }
  catch (error: any) {
    res.status(500).end();
  }
}
export async function session(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const [user] = await db.select({
      id: userSchema.id,
      firstName: userSchema.firstName,
      lastName: userSchema.lastName,
      username: userSchema.username,
      email: userSchema.email,
      mobileNo: userSchema.mobileNo,
      address: userSchema.address,
      picture: userSchema.picture,
      status: userSchema.status,
      role: userSchema.role,
      createdAt: userSchema.createdAt,
    }).from(userSchema).where(eq(userSchema.id, userId));
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    user.picture = `${baseUrl}/${user.picture}`
    res.status(200).json({ data: user });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ data: null });
  }
}
