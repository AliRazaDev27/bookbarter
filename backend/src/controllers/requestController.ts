import type { Request, Response } from "express";
import { getCurrentUserId } from "../utils/index.ts";
import { db } from "../config/db.ts";
import { postSchema } from "../models/posts.ts";
import { aliasedTable, eq, and } from "drizzle-orm";
import { exchangeRequestSchema } from "../models/exchangeRequest.ts";
import { userSchema } from "../models/user.ts";
import { InferSelectModel } from "drizzle-orm";
import { sendClientRefetch, sendClientRefetchRequests, sendClientRequestProposalDetails, sendClientRequestStatus } from "../index.ts";

type SentRequest = {
    exchange_requests: InferSelectModel<typeof exchangeRequestSchema>,
    offered_post: InferSelectModel<typeof postSchema>,
    requested_post: InferSelectModel<typeof postSchema>,
    receiver: InferSelectModel<typeof userSchema>,
}

export async function createRequest(req: Request, res: Response) {
    try {
        const senderId = req.user?.id
        if (!senderId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const { postId, barterId, note } = req.body;
        if (!postId) {
            throw new Error("postId is required");
        }
        const [requestedBook] = await db.select({ status: postSchema.status, userId: postSchema.userId, type: postSchema.exchangeType }).from(postSchema).where(eq(postSchema.id, postId))
        if (!requestedBook) {
            throw new Error("Book not found");
        }
        const receiverId = requestedBook.userId;
        if (requestedBook.status !== "available") {
            throw new Error("Book not available");
        }
        if (requestedBook.type === "barter" && !barterId) {
            throw new Error("Book for barter not provided");
        }
        if (receiverId === senderId) {
            throw new Error("You can't request your own book");
        }

        const [newRequest] = await db.transaction(async (tx) => {
            const [requestedBook] = await db.select({ status: postSchema.status }).from(postSchema).where(eq(postSchema.id, postId))
            if (requestedBook.status !== "available") {
                tx.rollback();
            }
            if (!!barterId) {
                const [barteredBook] = await db.select({ status: postSchema.status }).from(postSchema).where(eq(postSchema.id, barterId))
                if (barteredBook && barteredBook.status !== "available") {
                    tx.rollback();
                }
            }
            const newRequest = await tx.insert(exchangeRequestSchema)
                .values({ senderId, receiverId, postId, barterId: Number(barterId) || undefined, note: String(note) || undefined })
                .returning()
            return newRequest
        })

        if(!!newRequest.senderId){
        sendClientRefetchRequests(newRequest.senderId, "sent");
        }
        if(!!newRequest.receiverId){
        sendClientRefetchRequests(newRequest.receiverId, "received");
        }
        res.status(200).json({ message: "Request created successfully!", data: newRequest });
    }
    catch (error: any) {
        console.log(error)
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: null });
    }
}


export async function sentRequests(req: Request, res: Response) {
    try {
        const id = req.user?.id
        if (!id) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const offeredPost = aliasedTable(postSchema, "offered_post");
        const requestedPost = aliasedTable(postSchema, "requested_post");
        const receiver = aliasedTable(userSchema, "receiver");
        const requests = await db.select()
            .from(exchangeRequestSchema)
            .where(and(eq(exchangeRequestSchema.senderId, id),eq(exchangeRequestSchema.hasSenderDeleted, false)))
            .leftJoin(offeredPost, eq(offeredPost.id, exchangeRequestSchema.barterId))
            .innerJoin(requestedPost, eq(requestedPost.id, exchangeRequestSchema.postId))
            .innerJoin(receiver, eq(receiver.id, exchangeRequestSchema.receiverId))
        const typedResults = requests as never as SentRequest[]
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        typedResults.forEach((request) => {
            request.requested_post.images = request.requested_post.images.map((image) => `${baseUrl}/${image}`);
            if (request.exchange_requests.barterId !== null) {
                request.offered_post.images = request.offered_post.images.map((image) => `${baseUrl}/${image}`);
            }
        })
        res.status(200).json({ message: "Requests fetched successfully!", data: typedResults });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] });
    }
}

export async function receivedRequests(req: Request, res: Response) {
    try {
        const id = req.user?.id
        if (!id) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const offeredPost = aliasedTable(postSchema, "offered_post");
        const requestedPost = aliasedTable(postSchema, "requested_post");
        const sender = aliasedTable(userSchema, "sender");
        const requests = await db.select()
            .from(exchangeRequestSchema)
            .where(and(eq(exchangeRequestSchema.receiverId, id),eq(exchangeRequestSchema.hasReceiverDeleted, false)))
            .leftJoin(offeredPost, eq(offeredPost.id, exchangeRequestSchema.barterId))
            .innerJoin(requestedPost, eq(requestedPost.id, exchangeRequestSchema.postId))
            .innerJoin(sender, eq(sender.id, exchangeRequestSchema.senderId))
        const typedResults = requests as never as SentRequest[]
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        typedResults.forEach((request) => {
            request.requested_post.images = request.requested_post.images.map((image) => `${baseUrl}/${image}`);
            if (request.exchange_requests.barterId !== null) {
                request.offered_post.images = request.offered_post.images.map((image) => `${baseUrl}/${image}`);
            }
        })
        res.status(200).json({ message: "Requests fetched successfully!", data: typedResults });
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: [] });
    }
}

export async function updateRequestStatus(req: Request, res: Response) {
    try {
        const userId = req.user?.id
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const id = Number(req.params.id)
        const { status, type } = req.body
        if (!id) {
            throw new Error("Request ID not provided")
        }
        if (!status) {
            throw new Error("Status not provided")
        }
        if (!type) {
            throw new Error("Type not provided")
        }
        if (status !== "cancelled" && status !== "confirmed" && status !== "rejected" && status !== "completed") {
            throw new Error("Invalid status provided")
        }
        if (type !== "sent" && type !== "received") {
            throw new Error("Invalid type provided")
        }
        console.log(userId, id, type, status);

        if (type === "sent") {
            if (status === "cancelled") {
                await db.transaction(async (tx) => {
                    const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.senderId, userId)))
                    if (request.status !== "pending" && request.status !== "proposed") {
                        tx.rollback();
                    }
                    await tx.update(exchangeRequestSchema).set({ status: "cancelled" }).where(eq(exchangeRequestSchema.id, id));
                    if(!!request.senderId){
                    sendClientRequestStatus(request.senderId, request.id, "cancelled");
                    }
                    if(!!request.receiverId){
                    sendClientRequestStatus(request.receiverId, request.id, "cancelled");
                    }
                })
            }
            else if (status === "confirmed") {
                await db.transaction(async (tx) => {
                    const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.senderId, userId)))
                    const [requestedPost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.postId));
                    if (request.status !== "proposed") {
                        tx.rollback();
                    }
                    if (requestedPost.status !== "available") {
                        tx.rollback();
                    }
                    if (request.barterId !== null) {
                        const [barterPost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.barterId));
                        if (barterPost.status !== "available") {
                            tx.rollback();
                        }
                    }
                    await tx.update(exchangeRequestSchema).set({ status: "confirmed" }).where(eq(exchangeRequestSchema.id, id));
                    await tx.update(postSchema).set({ status: "pending" }).where(eq(postSchema.id, request.postId));
                    if (request.barterId !== null) {
                        await tx.update(postSchema).set({ status: "pending" }).where(eq(postSchema.id, request.barterId));
                    }
                    if(!!request.senderId){
                    sendClientRequestStatus(request.senderId, request.id, "confirmed");
                    }
                    if(!!request.receiverId){
                    sendClientRequestStatus(request.receiverId, request.id, "confirmed");
                    }
                })

            }
            else {
                throw new Error("Unexpected state encountered")
            }
        }
        else if (type === "received") {
            if (status === "rejected") {
                await db.transaction(async (tx) => {
                    const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)))
                    if (request.status !== "pending") {
                        tx.rollback();
                    }
                    await tx.update(exchangeRequestSchema).set({ status: "rejected" }).where(eq(exchangeRequestSchema.id, id));
                    if(!!request.senderId){
                    sendClientRequestStatus(request.senderId, request.id, "rejected");
                    }
                    if(!!request.receiverId){
                    sendClientRequestStatus(request.receiverId, request.id, "rejected");
                    }
                })

            }
            else if (status === "cancelled") {
                await db.transaction(async (tx) => {
                    const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)))
                    if (request.status !== "proposed" && request.status !== "confirmed") {
                        tx.rollback();
                    }
                    if (request.status === "proposed") {
                        await tx.update(exchangeRequestSchema).set({ status: "cancelled" }).where(eq(exchangeRequestSchema.id, id));
                        if(!!request.senderId){
                        sendClientRequestStatus(request.senderId, request.id, "cancelled");
                        }
                        if(!!request.receiverId){
                        sendClientRequestStatus(request.receiverId, request.id, "cancelled");
                        }
                    }
                    else if (request.status === "confirmed") {
                        await tx.update(exchangeRequestSchema).set({ status: "cancelled" }).where(eq(exchangeRequestSchema.id, id));
                        await tx.update(postSchema).set({ status: "available" }).where(eq(postSchema.id, request.postId));
                        if (request.barterId !== null) {
                            await tx.update(postSchema).set({ status: "available" }).where(eq(postSchema.id, request.barterId));
                        }
                        if(!!request.senderId){
                        sendClientRequestStatus(request.senderId, request.id, "cancelled");
                        }
                        if(!!request.receiverId){
                        sendClientRequestStatus(request.receiverId, request.id, "cancelled");
                        }
                    }
                    else {
                        tx.rollback();
                    }
                })

            }
            else if (status === "completed") {
                await db.transaction(async (tx) => {
                    const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)))
                    const [requestedPost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.postId));
                    if (request.status !== "confirmed") {
                        tx.rollback();
                    }
                    if (requestedPost.status !== "pending") {
                        tx.rollback();
                    }
                    if (request.barterId !== null) {
                        const [barterPost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.barterId));
                        if (barterPost.status !== "pending") {
                            tx.rollback();
                        }
                    }
                    await tx.update(exchangeRequestSchema).set({ status: "completed" }).where(eq(exchangeRequestSchema.id, id));
                    await tx.update(postSchema).set({ status: "exchanged" }).where(eq(postSchema.id, request.postId));
                    if (request.barterId !== null) {
                        await tx.update(postSchema).set({ status: "exchanged" }).where(eq(postSchema.id, request.barterId));
                    }
                    if(!!request.senderId){
                    sendClientRequestStatus(request.senderId, request.id, "completed");
                    }
                    if(!!request.receiverId){
                    sendClientRequestStatus(request.receiverId, request.id, "completed");
                    }
                })
            }
            else {
                throw new Error("Unexpected state encountered")
            }
        }
        else {
            throw new Error("Unexpected state encountered")
        }
    }
    catch (error: any) {
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: null });
    }
}

export async function sendProposal(req: Request, res: Response) {
    try {
        const userId = req.user?.id
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const id = Number(req.params.id);
        if (!id) {
            throw new Error("Request id is required");
        }
        const { location, date, time } = req.body
        if (!location || !date || !time) {
            throw new Error("Location, date and time are required");
        }
        const givenDate = new Date(`${date}:${time}:00.000Z`);
        const currentDate = new Date();
        currentDate.setTime(currentDate.getTime() + (24 * 60 * 60 * 1000));
        if (givenDate <= currentDate) {
            throw new Error("Date and time should be atleast 1 day in the future.");
        }
        const [request] = await db.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)));
        if (!request) {
            throw new Error("Request not found");
        }
        const newRequest = await db.transaction(async (tx) => {
            const [request] = await tx.select().from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)));
            if (!request) {
                tx.rollback();
            }
            const [requestedpost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.postId));
            if (!requestedpost || requestedpost.status !== "available") {
                tx.rollback();
            }
            if (!!request.barterId) {
                const [offeredPost] = await tx.select().from(postSchema).where(eq(postSchema.id, request.barterId));
                if (!offeredPost || offeredPost.status !== "available") {
                    tx.rollback();
                }
            }
            if (request.status !== "pending") {
                tx.rollback();
            }
            const [newRequest] = await tx.update(exchangeRequestSchema)
                .set({ status: "proposed", location, date: new Date(date), time })
                .where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId))).returning();
            const details = {
                location: newRequest.location,
                date: newRequest.date,
                time: newRequest.time,
                status: newRequest.status
            }
            if(!!request.senderId){
            sendClientRequestProposalDetails(request.senderId, request.id,details);
            }
            if(!!request.receiverId){
            sendClientRequestProposalDetails(request.receiverId, request.id, details);
            }
            return newRequest
        })
        res.status(200).json({ message: "Proposal sent successfully!", data: newRequest })
    }
    catch (error: any) {
        console.log(error)
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error", data: null });
    }
}

export async function deleteRequest(req: Request, res: Response) {
    try {
        const userId = req.user?.id
        if (!userId) {
            throw new Error("Unauthorized", { cause: 401 });
        }
        const id = Number(req.params.id);
        const type = req.params.type;
        if (!id || !type) {
            throw new Error("Request id and type is required");
        }
        if(type === "sent"){
            await db.transaction(async (tx) => {
                const [{status}] = await tx.select({status:exchangeRequestSchema.status}).from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.senderId, userId)));
                if(!status){
                    tx.rollback();
                }
                if(status === "cancelled" || status === "rejected" || status === "completed"){
                    await tx.update(exchangeRequestSchema).set({hasSenderDeleted: true}).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.senderId, userId)));
                }  
            })
        }

        if(type === "received"){
            await db.transaction(async (tx) => {
                const [{status}] = await tx.select({status:exchangeRequestSchema.status}).from(exchangeRequestSchema).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)));
                if(!status){
                    tx.rollback();
                }
                if(status === "cancelled" || status === "rejected" || status === "completed"){
                    await tx.update(exchangeRequestSchema).set({hasReceiverDeleted: true}).where(and(eq(exchangeRequestSchema.id, id), eq(exchangeRequestSchema.receiverId, userId)));
                }  
            })
        }
        res.status(200).json({ message: "Request deleted successfully!"});
    }
    catch (error: any) {
        console.log(error)
        res.status(error?.cause || 500).json({ message: error?.message || "Internal server error" });
    }
}