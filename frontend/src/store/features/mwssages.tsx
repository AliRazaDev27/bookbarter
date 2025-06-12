import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMessage {
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
            console.log(action.payload.data)
            const map = new Map(Object.entries(action.payload.data));
            console.log(map);
            map.forEach((value, key) => {
                state[Number(key)] = {
                    contactInfo: (value as any).contact,
                    messages: (value as any).messages
                }
            })
        },
        appendMessage(state,action:PayloadAction<{ contactId: number, message: IMessage }>) {
            state[action.payload.contactId].messages.push(action.payload.message);
        }

    },
});

export const { setFetchMessages, appendMessage } = messageSlice.actions

export default messageSlice.reducer;