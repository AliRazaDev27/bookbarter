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
    appendNotification: (state, action:PayloadAction<INotification>) => {
      if (state.data) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setNotificationData,appendNotification } = notificationSlice.actions

export default notificationSlice.reducer