import type { Request, Response } from 'express';
import { InsertPost, postSchema } from '../models/posts.ts';
import { postZodSchema } from '../config/zodSchemas/postZodSchema.ts';
import { db } from '../config/db.ts';
import { and, eq, desc } from 'drizzle-orm';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { cleanUpFiles } from '../utils/index.ts';

export async function createPost(req: Request, res: Response) {
  try {
    const images = req?.files as Express.Multer.File[];
    if (images) {
      for (const image of images) {
        const newName = `${Date.now()}-${image.originalname}`;
        await fs.rename(image.path, `uploads/posts/${newName}`);
        image.path = `uploads/posts/${newName}`; // Update the path in the file object
      }
    }
    const token = req.cookies["auth-token"];
    if (!token) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    const id = (user as { id: number }).id; 
    const parseResult = postZodSchema.safeParse({
      ...req.body,
      isPublic: Boolean(req.body.isPublic),
      images: req?.files
    });
    if (!parseResult.success) {
      if (req?.files) {
        await cleanUpFiles(req.files as Express.Multer.File[]);
      }
      res.status(422).json({
        message: "Schema validation failed",
        data: parseResult.error.flatten().fieldErrors
      });
    }
    else {
      const { title, author, language, description, category, bookCondition, exchangeType, exchangeCondition , price, currency , locationApproximate , images } = parseResult.data;
      if (!images || images.length === 0) throw new Error("Images are required", { cause: 400 });
      // check if a post exists with the same title and userId ()
      
      const existingPost = await db.select().from(postSchema).where(and(eq(postSchema.title, title), eq(postSchema.author, author)));
      if (existingPost.length > 0) {
        throw new Error("Post with the same title and author already exists", { cause: 409 });
      }
      const imagePaths = images.map((image) => image.path);
      const postData:InsertPost = {
        userId: id, // Assuming you have user ID in req.user
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
        locationApproximate,
        images: imagePaths,
      }
      // Insert the post into the database
      const newPost = await db.insert(postSchema).values(postData).returning();

      if (newPost.length === 0) {
        throw new Error("Failed to create post", { cause: 500 });
      }
      res.status(201).json({ message: "Post created successfully!", data: newPost[0] });
    }
  } catch (error: any) {
    console.log(error);
    if (req?.files) {
      await cleanUpFiles(req.files as Express.Multer.File[]);
    }
    res.status(error?.cause || 500).json({ message:  error.message || "Internal server error", data: null });
  }
}


export async function getPosts(req: Request, res: Response) {
  try{
    const searchParams = req.query;
    const { title, author,minPrice, maxPrice, currency,languages, categories, bookCondition, exchangeType, sortBy, page=1 } = searchParams;
    console.log(title, author,minPrice, maxPrice, currency,languages, categories, bookCondition, exchangeType, sortBy);
    
    
    res.end();
    const posts = await db.select().from(postSchema).where(and(eq(postSchema.isPublic, true), eq(postSchema.isDeleted, false))).orderBy(desc(postSchema.createdAt));
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const postsWithFullPictureUrl = posts.map(post => ({
      ...post,
      images: post.images.map((image) => `${baseUrl}/${image}`), // Assuming images are stored in `/uploads/`
    }));
    res.status(200).json({message: "Posts fetched successfully!", data: postsWithFullPictureUrl})
  }
  catch(error:any){
    res.status(500).json({message: error?.message || "Internal server error", data: null})
  }
}