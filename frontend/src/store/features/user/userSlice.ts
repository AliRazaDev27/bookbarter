import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/types'

const initialUser: IUser = {
  id: 0,
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  mobileNo: '',
  address: '',
  picture: '',
  status: '',
  role: '',
  createdAt: '',
}

const initialState = {
  data: initialUser,
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