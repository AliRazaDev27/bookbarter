import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./features/user/userSlice"
export default configureStore({
  reducer: {
    user: counterReducer,
  }
})