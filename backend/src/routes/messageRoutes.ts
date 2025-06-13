import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { sendClientMessage, sendClientMessageStatus } from '../index.ts';
import { db } from '../config/db.ts';
import { messageSchema } from '../models/messages.ts';
import { userSchema } from '../models/user.ts';
import { eq, or, and, desc } from 'drizzle-orm';

const router = express.Router();

router.post('/', getUser, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const { contactId, message } = req.body;
        if (!contactId || !message) {
            throw new Error("Missing required fields", { cause: 400 });
        }

        const [result] = await db.insert(messageSchema).values({ senderId: userId, receiverId: contactId, message }).returning();
        sendClientMessage(contactId, userId, result);
        res.status(200).json({ success: true, message: "Message sent successfully!", data: result });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ success: false, message: error?.message || "Internal server error", data: null });
    }
});

router.get('/', getUser, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const messages = await db
            .select({
                message: messageSchema,
                otherUser: {
                    id: userSchema.id,
                    username: userSchema.username,
                    picture: userSchema.picture,
                },
            })
            .from(messageSchema)
            .innerJoin(
                userSchema,
                or(
                    and(
                        eq(messageSchema.senderId, userId),
                        eq(userSchema.id, messageSchema.receiverId)
                    ),
                    and(
                        eq(messageSchema.receiverId, userId),
                        eq(userSchema.id, messageSchema.senderId)
                    )
                )
            )
            .where(
                or(
                    eq(messageSchema.receiverId, userId),
                    eq(messageSchema.senderId, userId)
                )
            ).limit(20).orderBy(desc(messageSchema.createdAt));
            messages.reverse();
        const formattedMessages = new Map<number, {contact:{ id: number, username: string, picture: string },messages:Array<{ id: number, senderId: number, receiverId: number, message: string, isRead: boolean, createdAt: Date }>}>();
        messages.forEach((item) => {
            if (item.message.senderId !== userId) {
                const existingData = formattedMessages.get(item.message.senderId);
                if (existingData) {
                    existingData.messages.push(item.message);
                }
                else{
                    formattedMessages.set(item.message.senderId, {contact:{ id: item.otherUser.id, username: item.otherUser.username, picture: item.otherUser.picture },messages:[item.message]});
                }
            }
            else {
                const existingData = formattedMessages.get(item.message.receiverId);
                if (existingData) {
                    existingData.messages.push(item.message);
                }
                else{
                    formattedMessages.set(item.message.receiverId, {contact:{ id: item.otherUser.id, username: item.otherUser.username, picture: item.otherUser.picture },messages:[item.message]});
                }
            }
        })
        res.status(200).json({ message: "Messages fetched successfully!", data: Object.fromEntries(formattedMessages) });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error" });
    }
})

router.put('/:id', getUser, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const messageId = parseInt(req.params.id);
        if (!messageId) {
            throw new Error("Missing required fields", { cause: 400 });
        }
        const [result] = await db.update(messageSchema).set({ isRead: true }).where(and(eq(messageSchema.id, messageId), eq(messageSchema.receiverId, userId))).returning();
        sendClientMessageStatus(result.senderId, userId, result.id, true);

        res.status(200).json({ success: true });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ success: false});
    }
});

export default router;