import fs from "fs/promises";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getWishlistByTitleAndAuthor } from "../controllers/wishlistController.ts";
import { createNotification } from "../controllers/notificationController.ts";

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

export function getUserIdByToken(token: string) {
  try {
    if (!token) {
      return null;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    const id = (user as { id: number }).id;
    return id;
  } catch (error) {
    console.error("Error getting user ID by token:", error);
    return null;
  }
}

export async function notificationGenerator(postId: number,title: string, author:string){
  try{
    const wishlist = await getWishlistByTitleAndAuthor(title, author);
    if(!!wishlist && wishlist.length > 0){
      wishlist.forEach(async (item) => {
        await createNotification(item.userId, postId, `${title} by ${author}`);
      });
    }
    return null;
  }
  catch(error:any){
    console.log("notificationGenerator:",error);
    return null;
  }
}