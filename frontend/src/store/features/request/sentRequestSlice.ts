import { createSlice } from '@reduxjs/toolkit'

export const sentRequestSlice = createSlice({
  name: 'sentRequest',
  initialState: {
    data: Array(),
  },
  reducers: {
    setSentRequests: (state, action) => {
      state.data = action.payload
    },
    updateSentRequestStatus: (state, action) => {
      const index = state.data.findIndex((request: any) => request.exchange_requests.id === action.payload.requestId)
      if(index === -1) return
      state.data[index].exchange_requests.status = action.payload.status
    },
    updateSentRequestDetails: (state, action) => {
      const index = state.data.findIndex((request: any) => request.exchange_requests.id === action.payload.requestId)
      if(index === -1) return
      state.data[index].exchange_requests.status = action.payload.status
      state.data[index].exchange_requests.location = action.payload.location
      state.data[index].exchange_requests.date = action.payload.date
      state.data[index].exchange_requests.time = action.payload.time
    },
    markAsReviewed: (state, action) => {
      const index = state.data.findIndex((request: any) => request.exchange_requests.id === action.payload.requestId)
      if(index === -1) return
      state.data[index].exchange_requests.isReviewed = true
    },
    removeSentRequest: (state, action) => {
      state.data = state.data.filter((request: any) => request.exchange_requests.id !== action.payload.requestId)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSentRequests,updateSentRequestStatus,updateSentRequestDetails,markAsReviewed,removeSentRequest } = sentRequestSlice.actions

export default sentRequestSlice.reducer