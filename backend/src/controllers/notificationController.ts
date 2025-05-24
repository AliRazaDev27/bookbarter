import type { Request, Response } from 'express';
import { db } from '../config/db.ts';
import { notificationSchema } from '../models/notifications.ts';
import { eq, and, sql } from 'drizzle-orm';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated', { cause: 401 });
    }

    const notifications = await db.select({
      id: notificationSchema.id,
      postId: notificationSchema.postId,
      notification: notificationSchema.notification,
      createdAt: notificationSchema.createdAt,
      isRead: notificationSchema.isRead,
      image: sql<string>`(SELECT images[1] FROM posts WHERE id = ${notificationSchema.postId})`.as('image'),
    })
      .from(notificationSchema)
      .where(eq(notificationSchema.userId, userId));
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    notifications.forEach(notification => {
      if (notification.image) {
        notification.image = `${baseUrl}/${notification.image}`;
      }
    });
    res.status(200).json({ message: 'Notifications fetched successfully', data: notifications });
  } catch (error: any) {
    console.error('Error getting notifications:', error);
    res.status(error?.cause || 500).json({ message: error?.message || 'Internal server error', data: null });
  }
};

export const markNotification = async(req: Request, res: Response) => {
  // Skeleton function for updating a notification
  try{
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated', { cause: 401 });
    }
    const { id } = req.params;
    const notificationId = parseInt(id);
    if (isNaN(notificationId)) {
      throw new Error('Invalid notification ID', { cause: 400 });
    }
    const [updatedNotification] = await db.update(notificationSchema)
      .set({ isRead: true })
      .where(and(eq(notificationSchema.id, notificationId), eq(notificationSchema.userId, userId)))
      .returning();
    if (!updatedNotification) {
      throw new Error('Notification not found.', { cause: 404 });
    }
    res.status(200).json({ message: 'Notification marked as read successfully' });
  }
  catch (error: any) {
    console.error('Error marking notification:', error);
    res.status(error?.cause || 500).json({ message: error?.message || 'Internal server error' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated', { cause: 401 });
    }
    const { id } = req.params;
    const notificationId = parseInt(id);

    if (isNaN(notificationId)) {
      throw new Error('Invalid notification ID', { cause: 400 });
    }

    const deletedNotifications = await db.delete(notificationSchema)
      .where(and(eq(notificationSchema.id, notificationId), eq(notificationSchema.userId, userId)))
      .returning();

    if (deletedNotifications.length === 0) {
      throw new Error('Notification not found.', { cause: 404 });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(error?.cause || 500).json({ message: error?.message || 'Internal server error' });
  }
};

export async function createNotification(userId: number, postId: number, notification: string) {
  try {
    console.log('createNotification:', userId, postId, notification);
    if (!userId || !postId || !notification) return null;
    await db.insert(notificationSchema).values({
      userId,
      postId,
      notification,
    })

    return null;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}
