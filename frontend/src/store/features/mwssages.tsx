import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    isRead: boolean;
    createdAt: number;
}

const initialState:{ [key: number]: {
    contactInfo: { id: number, picture: string, username: string };
    messages: IMessage[]
}} = {};


const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setFetchMessages: (state,action) => {
            const map = new Map(Object.entries(action.payload.data));
            map.forEach((value, key) => {
                state[Number(key)] = {
                    contactInfo: (value as any).contact,
                    messages: (value as any).messages
                }
            })
        },
        appendMessage(state,action:PayloadAction<{ contactId: number, message: IMessage }>) {
            state[action.payload.contactId].messages.push(action.payload.message);
        },
        setMessageRead(state,action:PayloadAction<{ contactId: number, messageId: number }>) {
            const message = state[action.payload.contactId].messages.find(msg => msg.id === action.payload.messageId)
            if(!!message){
            message.isRead = true;
            }

        },

    },
});

export const { setFetchMessages, appendMessage, setMessageRead } = messageSlice.actions

export default messageSlice.reducer;