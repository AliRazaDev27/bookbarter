import { createSlice } from '@reduxjs/toolkit'


export const userPostSlice = createSlice({
  name: 'userPosts',
  initialState: {
    data: Array<{post:any,user:any}>(0) // Initialize with an empty array,
  },
  reducers: {
    setUserPosts: (state, action) => {
      state.data = action.payload
    },
    appendUserPosts: (state, action) => {
      state.data.push(action.payload)
    },

    deleteUserPost: (state, action) => {
      state.data = state.data.filter((post: any) => post.post.id !== action.payload)
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUserPosts, deleteUserPost, appendUserPosts } = userPostSlice.actions

export default userPostSlice.reducer