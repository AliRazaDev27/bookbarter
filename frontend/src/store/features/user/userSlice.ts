import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    token: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload
    },

    setUserToken: (state, action) => {
      state.token = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUserData,setUserToken } = counterSlice.actions

export default counterSlice.reducer