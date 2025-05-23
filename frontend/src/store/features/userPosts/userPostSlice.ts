import { createSlice } from '@reduxjs/toolkit'


export const userPostSlice = createSlice({
  name: 'userPosts',
  initialState: {
    data: [],
  },
  reducers: {
    setUserPosts: (state, action) => {
      state.data = action.payload
    },
    deleteUserPost: (state, action) => {
      state.data = state.data.filter((post: any) => post.post.id !== action.payload)
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUserPosts, deleteUserPost } = userPostSlice.actions

export default userPostSlice.reducer