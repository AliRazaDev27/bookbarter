import type { Request, Response } from "express";
import { userSchema } from "../models/user.ts";
import { db } from "../config/db.ts";
import { eq } from "drizzle-orm"

export async function getAllUsers(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if(!userId) throw new Error("Unauthorized", { cause: 401 });
    const [user] = await db.select().from(userSchema).where(eq(userSchema.id, userId));
    if(!user || user.role !== "admin") throw new Error("Unauthorized", { cause: 401 });
    const users = await db.select().from(userSchema);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const usersWithFullPictureUrl = users.map(user => ({
      ...user,
      picture: user.picture ? `${baseUrl}/${user.picture}` : null, // Assuming images are stored in `/uploads/`
    }));
    res.json({ success: true, message: "Users fetched successfully!", data: usersWithFullPictureUrl });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
}

type UserStatus = "unverified" | "active" | "blocked";

export async function updateStatus(req: Request, res: Response) {
  try {
    const { userId, status }: { userId: string | undefined, status: string | undefined } = req.body;
    if (!userId || !status) {
      throw new Error("User ID and status are required");
    }
    const user = await db.select().from(userSchema).where(eq(userSchema.id, parseInt(userId!)));
    if (!user || user.length === 0) {
      throw new Error("User not found");
    }
    await db.update(userSchema).set({ status: status! as UserStatus }).where(eq(userSchema.id, parseInt(userId!)));
    res.json({ success: true, message: "User status updated successfully!", data: { ...user[0], status } });
  } catch (error: any) {
    console.error("Error updating user status:", error);
    res.json({ success: false, message: error.message || "Internal server error" });
  }
}