import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./features/user/userSlice"
import  sentRequestSlice  from './features/request/sentRequestSlice'
import receivedRequestSlice from './features/request/receivedRequestSlice'
export default configureStore({
  reducer: {
    user: counterReducer,
    sentRequests: sentRequestSlice,
    receivedRequests: receivedRequestSlice,
  }
})