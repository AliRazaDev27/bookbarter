import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    data: {
        contactId:0,
        timestamp:0
    }
}

const utilSlice = createSlice({
    name: "util",
    initialState,
    reducers: {
        setContactId: (state, action:PayloadAction<{contactId: number }>) => {
            state.data.contactId = action.payload.contactId;
        },
        setTimestamp: (state, action:PayloadAction<{timestamp: number }>) => {
            state.data.timestamp = action.payload.timestamp;
        },

    },
});

export const { setContactId, setTimestamp } = utilSlice.actions

export default utilSlice.reducer;