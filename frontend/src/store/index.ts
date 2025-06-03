import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./features/user/userSlice"
import  sentRequestSlice  from './features/request/sentRequestSlice'
import receivedRequestSlice from './features/request/receivedRequestSlice'
import  userPostSlice  from './features/userPosts/userPostSlice'
import notificationSlice from './features/notifications/notificationSlice'
import  reviewSlice  from './features/review/reviewSlice'
import messageSlice from './features/mwssages'
const store = configureStore({
  reducer: {
    user: counterReducer,
    sentRequests: sentRequestSlice,
    receivedRequests: receivedRequestSlice,
    userPosts: userPostSlice,
    notifications: notificationSlice,
    reviews: reviewSlice,
    messages: messageSlice,
  }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch