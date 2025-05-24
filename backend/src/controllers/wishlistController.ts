import type { Request, Response } from "express";
import { db } from "../config/db.ts";
import { wishlistSchema } from "../models/wishlist.ts";
import { eq, sql, or } from "drizzle-orm";
export async function createWishlist(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const { title, author } = req.body;
        if (!title && !author) {
            throw new Error("Title or author is required", { cause: 400 });
        }
        const newWishlist = await db.transaction(async (tx) => {
            const [existingWishlist] = await tx.select({ count: sql<number>`count(*)` }).from(wishlistSchema).where(eq(wishlistSchema.userId, userId));
            if (existingWishlist.count >= 5) {
                throw new Error("You can only have up to 5 wishlists", { cause: 400 });
            }
            const [newWishlist] = await tx.insert(wishlistSchema).values({
                userId,
                title,
                author,
            }).returning();
            return newWishlist;
        })
        res.status(201).json({ message: "Wishlist created successfully", data: newWishlist });
    } catch (error: any) {
        console.error("Error creating wishlist:", error);
        res.status(error?.cause || 500).json({ message: error.message, data: null });
    }
}

export async function getWishlist(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const wishlists = await db.select().from(wishlistSchema).where(eq(wishlistSchema.userId, userId));
        res.status(200).json({ message: "Wishlists fetched successfully", data: wishlists });
    }
    catch (error: any) {
        console.log("createWishlist", error);
        res.status(error?.cause || 500).json({ message: error.message, data: [] });
    }
}

export async function deleteWishlist(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const id = Number(req.params.id);
        if (!id) {
            throw new Error("Wishlist ID is required", { cause: 400 });
        }
        const deletedWishlist = await db.delete(wishlistSchema).where(eq(wishlistSchema.id, id)).returning();
        if (deletedWishlist.length === 0) {
            throw new Error("Wishlist not found", { cause: 404 });
        }
        res.status(200).json({ message: "Wishlist deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting wishlist:", error);
        res.status(error?.cause || 500).json({ message: error.message });
    }
}

export async function getWishlistCount(req: Request, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const [count] = await db.select({ count: sql<number>`count(*)` }).from(wishlistSchema).where(eq(wishlistSchema.userId, userId));
        res.status(200).json({ message: "Wishlist count fetched successfully", data: count });
    } catch (error: any) {
        console.error("Error fetching wishlist count:", error);
        res.status(error?.cause || 500).json({ message: error.message, data: null });
    }
}

export async function getWishlistByTitleAndAuthor(title: string, author: string) {
    try {
        const wishlist = await db.select().from(wishlistSchema).where(
            or(
                eq(wishlistSchema.title, title),
                eq(wishlistSchema.author, author)
            )
        );
        return wishlist;
    } catch (error: any) {
        console.error("Error fetching wishlist by title and author:", error);
        return null;
    }
}