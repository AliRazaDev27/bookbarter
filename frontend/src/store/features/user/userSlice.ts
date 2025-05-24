import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/types'



const initialState: { data: IUser|null } = {
  data: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action:PayloadAction<IUser>) => {
      state.data = {
        ...action.payload,
      }
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUserData } = userSlice.actions

export default userSlice.reducer