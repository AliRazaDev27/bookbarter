import type { Request, Response } from 'express';
import { db } from '../config/db.ts';
import { postSchema } from '../models/posts.ts';
import { eq, and } from 'drizzle-orm';
import { reviewsSchema } from '../models/reviews.ts';
import { z } from 'zod';
import { exchangeRequestSchema } from '../models/exchangeRequest.ts';
export async function createReview(req: Request, res: Response) {
    try {
        const senderId = req.user?.id;
        if (!senderId) {
            throw new Error('User not authenticated', { cause: 401 });
        }
        const { id, rating, review } = req.body;
        if (!id || !rating || !review) {
            throw new Error('Missing required fields', { cause: 400 });
        }
        const requestId = parseInt(id);
        if (isNaN(requestId)) {
            throw new Error('Invalid request ID', { cause: 400 });
        }
        const [{ postId, receiverId }] = await db.select({ postId: exchangeRequestSchema.postId, receiverId: exchangeRequestSchema.receiverId }).from(exchangeRequestSchema).where(eq(exchangeRequestSchema.id, requestId));
        if (!postId || !receiverId) {
            throw new Error('Request not found', { cause: 404 });
        }
        const createReviewZodSchema = z.object({
            rating: z.number().int().positive().min(0).max(10),
            review: z.string().min(1).max(512),
        });
        const result = createReviewZodSchema.safeParse({ rating, review });
        if (!result.success) {
            const errorMessage = result.error.errors.map(err => err.message).join(', ');
            throw new Error(`Validation error: ${errorMessage}`, { cause: 400 });
        }
        await db.transaction(async (tx) => {
            const [existingReview] = await db.select().from(reviewsSchema).where(and(eq(reviewsSchema.postId, postId), eq(reviewsSchema.senderId, senderId)));
            if (existingReview) {
                throw new Error('You have already reviewed this post', { cause: 400 });
            }
            await db.insert(reviewsSchema).values({
                senderId,
                receiverId,
                postId,
                rating,
                review
            });
            await db.update(exchangeRequestSchema).set({ isReviewed: true }).where(eq(exchangeRequestSchema.id, requestId));
        })
        res.status(200).json({ message: 'Review created successfully!' });
    }
    catch (error: any) {
        console.error('Error creating review:', error);
        res.status(error.cause || 500).json({ message: error.message || 'Internal Server Error' });
    }
}