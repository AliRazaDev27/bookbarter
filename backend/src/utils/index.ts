import fs from "fs/promises";
import type { Request } from "express";
import jwt from "jsonwebtoken";
export async function cleanUpFiles(files: Express.Multer.File | Express.Multer.File[]) {
  const filesArray = Array.isArray(files) ? files : [files];
  for (const file of filesArray) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}
export async function getCurrentUserId(req:Request){
  try{
    const token = req.cookies["auth-token"];
    if (!token) {
      return null;
    }
    else{
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    const id = (user as { id: number }).id;
    return id
    }
  }
  catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}