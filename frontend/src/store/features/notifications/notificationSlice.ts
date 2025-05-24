import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INotification } from '@/types'



const initialState: { data: INotification[]|null } = {
  data: null,
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationData: (state, action:PayloadAction<INotification[]>) => {
      state.data = action.payload;
    },
  }
})

// Action creators are generated for each case reducer function
export const { setNotificationData } = notificationSlice.actions

export default notificationSlice.reducer