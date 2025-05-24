import type { Request, Response } from 'express';
import { InsertPost, postSchema } from '../models/posts.ts';
import { favoriteSchema } from '../models/favorites.ts';
import { postZodSchema } from '../config/zodSchemas/postZodSchema.ts';
import { db } from '../config/db.ts';
import { and, eq, desc, asc, gte, lte, ilike, inArray, SQL, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import { cleanUpFiles, notificationGenerator } from '../utils/index.ts';
import { userSchema } from '../models/user.ts';

export async function createPost(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const images = req?.files as Express.Multer.File[];
    if (images) {
      for (const image of images) {
        const newName = `${Date.now()}-${image.originalname}`;
        await fs.rename(image.path, `uploads/posts/${newName}`);
        image.path = `uploads/posts/${newName}`; // Update the path in the file object
      }
    }
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
      const { title, author, language, description, category, bookCondition, exchangeType, exchangeCondition, price, currency, locationApproximate, images } = parseResult.data;
      if (!images || images.length === 0) throw new Error("Images are required", { cause: 400 });
      // check if a post exists with the same title and userId ()

      const existingPost = await db.select().from(postSchema).where(and(eq(postSchema.title, title), eq(postSchema.author, author)));
      if (existingPost.length > 0) {
        throw new Error("Post with the same title and author already exists", { cause: 409 });
      }
      const imagePaths = images.map((image) => image.path);
      const postData: InsertPost = {
        userId,
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
      notificationGenerator(newPost[0].id,newPost[0].title, newPost[0].author);
      res.status(201).json({ message: "Post created successfully!", data: newPost[0] });
    }
  } catch (error: any) {
    console.log(error);
    if (req?.files) {
      await cleanUpFiles(req.files as Express.Multer.File[]);
    }
    res.status(error?.cause || 500).json({ message: error.message || "Internal server error", data: null });
  }
}


export async function getPosts(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const searchParams = req.query;
    const {
      title,
      author,
      minPrice,
      maxPrice,
      currency,
      languages,
      categories,
      bookCondition,
      exchangeType,
      sortBy,
      page = '1',
      limit = '8', // Ensure page is a string initially for consistent parsing
    } = searchParams;

    let query = db.select({
      posts: postSchema,
      users: userSchema,
      isFav: !!userId ? sql<boolean>`COALESCE(
            (
      SELECT ${favoriteSchema.isFav}
    FROM ${favoriteSchema}
    WHERE ${favoriteSchema.userId} = ${userId}
    AND ${favoriteSchema.postId} = ${postSchema.id}
    LIMIT 1
      ),false
          )`.as('isFav')
        : sql<boolean>`false`.as('isFav'),
    }).from(postSchema);

    const conditions: SQL[] = [];
    conditions.push(eq(postSchema.isPublic, true));
    conditions.push(eq(postSchema.isDeleted, false));

    if (title && typeof title === 'string') {
      conditions.push(ilike(postSchema.title, `%${title}%`));
    }
    if (author && typeof author === 'string') {
      conditions.push(ilike(postSchema.author, `%${author}%`));
    }
    if (minPrice && (typeof minPrice === 'string' || typeof minPrice === 'number')) {
      conditions.push(gte(postSchema.price, String(minPrice)));
    }
    if (maxPrice && (typeof maxPrice === 'string' || typeof maxPrice === 'number')) {
      conditions.push(lte(postSchema.price, String(maxPrice)));
    }
    if (currency && typeof currency === 'string') {
      conditions.push(eq(postSchema.currency, currency as typeof postSchema.currency.enumValues[number]));
    }
    if (languages && typeof languages === 'string') {
      const langArray = languages.split(',').map(lang => lang.trim()).filter(lang => lang) as Array<typeof postSchema.language.enumValues[number]>;
      if (langArray.length > 0) {
        conditions.push(inArray(postSchema.language, langArray));
      }
    }
    if (categories && typeof categories === 'string') {
      const catArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat) as Array<typeof postSchema.category.enumValues[number]>;
      if (catArray.length > 0) {
        conditions.push(inArray(postSchema.category, catArray));
      }
    }
    if (bookCondition && typeof bookCondition === 'string') {
      conditions.push(eq(postSchema.bookCondition, bookCondition as typeof postSchema.bookCondition.enumValues[number]));
    }
    if (exchangeType && typeof exchangeType === 'string') {
      conditions.push(eq(postSchema.exchangeType, exchangeType as typeof postSchema.exchangeType.enumValues[number]));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    let orderByClause: SQL | SQL[] = desc(postSchema.createdAt); // Default
    if (sortBy && typeof sortBy === 'string') {
      if (sortBy === 'price_asc') orderByClause = asc(postSchema.price);
      else if (sortBy === 'price_desc') orderByClause = desc(postSchema.price);
      else if (sortBy === 'date_asc') orderByClause = asc(postSchema.createdAt);
      else if (sortBy === 'date_desc') orderByClause = desc(postSchema.createdAt);
    }
    // query = query.orderBy(orderByClause); // This was a mistake in my plan, query.orderBy doesn't take query as first arg
    // Correct way:
    query.orderBy(orderByClause);


    const pageSize = parseInt(limit as string);
    const pageNumber = parseInt(page as string);
    if (isNaN(pageNumber) || pageNumber < 1) {
      // res.status(400).json({ message: "Invalid page number", data: null }); // Or handle as you see fit, maybe default to 1
      // For now, let's assume if it's invalid, we don't paginate or default to page 1
      query.limit(pageSize).offset(0);
    } else {
      query.limit(pageSize).offset((pageNumber - 1) * pageSize);
    }

    // query.innerJoin(postSchema, eq(postSchema.userId, userSchema.id)); // Assuming you want to join with the user table

    const posts = await query.innerJoin(userSchema, eq(postSchema.userId, userSchema.id))
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const postsWithFullPictureUrl = posts.map(post => ({
      post: {
        ...post.posts,
        images: post.posts.images.map((image) => `${baseUrl}/${image}`), // Assuming images are stored in `/uploads/`
        isFav: post.isFav,
      },
      user: {
        id: post.users.id,
        username: post.users.username,
        picture: post.users.picture ? `${baseUrl}/${post.users.picture}` : null, // Assuming profile picture is stored in `/uploads/`
      },
    }));
    res.status(200).json({ message: "Posts fetched successfully!", data: postsWithFullPictureUrl })
  }
  catch (error: any) {
    res.status(500).json({ message: error?.message || "Internal server error", data: null })
  }
}

export async function getPostsByUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const posts = await db.select({
      posts: postSchema,
      users: userSchema,
      isFav: userId ? sql<boolean>`COALESCE(
            (
      SELECT ${favoriteSchema.isFav}
    FROM ${favoriteSchema}
    WHERE ${favoriteSchema.userId} = ${userId}
    AND ${favoriteSchema.postId} = ${postSchema.id}
    LIMIT 1
      ),false
          )`.as('isFav')
        : sql<boolean>`false`.as('isFav'),
    }).from(postSchema).where(eq(postSchema.userId, userId)).innerJoin(userSchema, eq(postSchema.userId, userSchema.id))
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const postsWithFullPictureUrl = posts.map(post => ({
      post: {
        ...post.posts,
        images: post.posts.images.map((image) => `${baseUrl}/${image}`), // Assuming images are stored in `/uploads/`
        isFav: post.isFav,
      },
      user: {
        id: post.users.id,
        username: post.users.username,
        picture: post.users.picture ? `${baseUrl}/${post.users.picture}` : null, // Assuming profile picture is stored in `/uploads/`
      },
    }));
    
    res.status(200).json({ message: "Posts fetched successfully!", data: postsWithFullPictureUrl });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] })

  }
}

export async function getNumberOfPostsByUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const [count] = await db.select({ count: sql<number>`count(*)` }).from(postSchema).where(eq(postSchema.userId, userId));
    res.status(200).json({ count: count.count });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] })

  }
}

export async function getPostListByUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const posts = await db.select({ id: postSchema.id, title: postSchema.title }).from(postSchema).where(eq(postSchema.userId, userId));
    res.status(200).json({ message: "Posts fetched successfully!", data: posts });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] })

  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized", { cause: 401 });
    }
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      throw new Error("Invalid post ID", { cause: 400 });
    }
    const post = await db.select().from(postSchema).where(and(eq(postSchema.id, postId), eq(postSchema.userId, userId)));
    if (post.length === 0) {
      throw new Error("Post not found", { cause: 404 });
    }
    await db.delete(postSchema).where(and(eq(postSchema.id, postId), eq(postSchema.userId, userId)));
    res.status(200).json({ message: "Post deleted successfully!" });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ message: error?.message || "Internal server error" })
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const userId = req.user?.id; // Optional: to check if the current user has favorited the post
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      throw new Error("Invalid post ID", { cause: 400 });
    }

    const post = await db.select({
      posts: postSchema,
      users: userSchema,
      isFav: userId ? sql<boolean>`COALESCE(
            (
      SELECT ${favoriteSchema.isFav}
    FROM ${favoriteSchema}
    WHERE ${favoriteSchema.userId} = ${userId}
    AND ${favoriteSchema.postId} = ${postSchema.id}
    LIMIT 1
      ),false
          )`.as('isFav')
        : sql<boolean>`false`.as('isFav'),
    }).from(postSchema).where(eq(postSchema.id, postId)).innerJoin(userSchema, eq(postSchema.userId, userSchema.id));

    if (post.length === 0) {
      throw new Error("Post not found", { cause: 404 });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const postWithFullPictureUrl = {
      post: {
        ...post[0].posts,
        images: post[0].posts.images.map((image) => `${baseUrl}/${image}`),
        isFav: post[0].isFav,
      },
      user: {
        id: post[0].users.id,
        username: post[0].users.username,
        picture: post[0].users.picture ? `${baseUrl}/${post[0].users.picture}` : null,
      },
    };

    res.status(200).json({ message: "Post fetched successfully!", data: postWithFullPictureUrl });
  }
  catch (error: any) {
    res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] })
  }
}
