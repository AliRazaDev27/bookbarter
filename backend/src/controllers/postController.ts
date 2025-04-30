import type { Request, Response } from 'express';
import { InsertPost, postSchema } from '../models/posts.ts';
import { postZodSchema } from '../config/zodSchemas/postZodSchema.ts';
import { db } from '../config/db.ts';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import fs from 'fs/promises';

export async function createPost(req: Request, res: Response) {
  try {
    console.log(req.body)
    const parseResult = postZodSchema.safeParse({
      ...req.body,
      tags: JSON.parse(req?.body?.tags),
      isPublic: Boolean(req.body.isPublic),
      isNegotiable: Boolean(req.body.isNegotiable),
      images: req?.files
    });
    if (!parseResult.success) {
      if (req?.files) {
        await cleanUpFiles(req.files as Express.Multer.File[]);
      }
      res.status(422).json({
        error: parseResult.error.flatten().fieldErrors
      });
    }
    else {
      const { title, author, language, description, category, bookCondition, exchangeType, exchangeCondition, isPublic, price, currency, isNegotiable, locationApproximate, tags, images } = parseResult.data;
      if (!images || images.length === 0) throw new Error("Images are required", { cause: 400 });
      if (!title || !author || !language || !description || !category || !bookCondition || !exchangeType || !exchangeCondition || !price || !currency || !locationApproximate || !tags || !isPublic || !isNegotiable) {
        throw new Error("All fields are required", { cause: 400 });
      }
      // check if a post exists with the same title and userId ()
      
      const existingPost = await db.select().from(postSchema).where(and(eq(postSchema.title, title), eq(postSchema.author, author)));
      if (existingPost.length > 0) {
        if (req?.files) {
          await cleanUpFiles(req.files as Express.Multer.File[]);
        }
        res.status(409).json({ error: "Post with the same title and author already exists" });
      }

      const imagePaths = images.map((image) => image.path);

      const postData:InsertPost = {
        userId: 1, // Assuming you have user ID in req.user
        title,
        author,
        language,
        description,
        category,
        bookCondition,
        exchangeType,
        exchangeCondition,
        price,
        currency,
        isNegotiable,
        locationApproximate,
        tags,
        status: "available",
        images: imagePaths,
      }
      // Insert the post into the database
      const newPost = await db.insert(postSchema).values(postData).returning();

      if (newPost.length === 0) {
        if (req?.files) {
          await cleanUpFiles(req.files as Express.Multer.File[]);
        }
        res.status(500).json({ error: "Failed to create post" });
      }

      res.status(201).json({ error: null, data: newPost[0] });
    }
  } catch (error: any) {
    if (req?.files) {
      await cleanUpFiles(req.files as Express.Multer.File[]);
    }
    console.error("Error creating post:", error);
    if (error instanceof z.ZodError) {
      res.status(422).json({
        error: error.flatten().fieldErrors
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

async function cleanUpFiles(files: Express.Multer.File | Express.Multer.File[]) {
  const filesArray = Array.isArray(files) ? files : [files];
  for (const file of filesArray) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}

export async function getPosts(req: Request, res: Response) {
  try{
    const posts = await db.select().from(postSchema).limit(10)
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const postsWithFullPictureUrl = posts.map(post => ({
      ...post,
      images: post.images.map((image) => `${baseUrl}/${image}`), // Assuming images are stored in `/uploads/`
    }));
    console.log(postsWithFullPictureUrl)
    res.status(200).json({error: null, data: postsWithFullPictureUrl})
  }
  catch(error:any){
    res.status(500).json({error: error?.message || "Internal server error"})
  }
}