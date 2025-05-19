import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUserData } = counterSlice.actions

export default counterSlice.reducer