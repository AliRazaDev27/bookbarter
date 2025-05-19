import type { Request, Response } from "express";
import { getCurrentUserId } from "../utils/index.ts";
import { postSchema } from "../models/posts.ts";
import { favoriteSchema } from "../models/favorites.ts";
import { and, eq } from "drizzle-orm";
import { db } from '../config/db.ts';
export async function toggleFavorite(req: Request, res: Response) {
    try {
        const userId = await getCurrentUserId(req)
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const id = Number(req.params.id);
        if (!id) {
            throw new Error("Book id is required");
        }
        const [post] = await db.select().from(postSchema).where(eq(postSchema.id, id));
        if (!post) throw new Error("Book not found");
        const isFav = await db.transaction(async (tx) => {
            const [favorite] = await tx.select().from(favoriteSchema).where(and(eq(favoriteSchema.userId, userId), eq(favoriteSchema.postId, id)));
            if (favorite) {
                const [updatedFavorite] = await tx.update(favoriteSchema).set({ isFav: !favorite.isFav }).where(eq(favoriteSchema.id, favorite.id)).returning();
                const [post] = await db.select().from(postSchema).where(eq(postSchema.id, id));
                if(updatedFavorite.isFav){
                    await tx.update(postSchema).set({ favCount: post.favCount + 1 }).where(eq(postSchema.id, id));
                }
                else{
                    await tx.update(postSchema).set({ favCount: post.favCount - 1 }).where(eq(postSchema.id, id));
                }
                return updatedFavorite.isFav;
            } else {
                const [createdFavorite] = await tx.insert(favoriteSchema).values({ userId, postId: id, isFav: true }).returning();
                const [post] = await db.select().from(postSchema).where(eq(postSchema.id, id));
                await tx.update(postSchema).set({ favCount: post.favCount + 1 }).where(eq(postSchema.id, id));
                return createdFavorite.isFav;
            }
        })
        res.status(200).json({ message: "Favorite toggled successfully!", data: isFav });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: null })
    }
}