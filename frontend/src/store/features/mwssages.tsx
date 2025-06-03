import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    data: {
        receiverId: 0,
        timestamp: 0,
    }
}

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setReceiverId: (state, action:PayloadAction<{receiverId: number, timestamp: number}>) => {
            state.data.receiverId = action.payload.receiverId;
            state.data.timestamp = action.payload.timestamp
        }
    },
});

export const { setReceiverId } = messageSlice.actions

export default messageSlice.reducer;