import { createSlice } from '@reduxjs/toolkit'

export const receivedRequestSlice = createSlice({
  name: 'receivedRequest',
  initialState: {
    data: Array(),
  },
  reducers: {
    setReceivedRequests: (state, action) => {
      state.data = action.payload
    },
    updateReceivedRequestStatus: (state, action) => {
      const index = state.data.findIndex((request: any) => request.exchange_requests.id === action.payload.requestId)
      if(index === -1) return
      state.data[index].exchange_requests.status = action.payload.status
    },
    updateReceivedRequestDetails: (state, action) => {
      const index = state.data.findIndex((request: any) => request.exchange_requests.id === action.payload.requestId)
      if(index === -1) return
      state.data[index].exchange_requests.status = action.payload.status
      state.data[index].exchange_requests.location = action.payload.location
      state.data[index].exchange_requests.date = action.payload.date
      state.data[index].exchange_requests.time = action.payload.time
    },
  }
})

// Action creators are generated for each case reducer function

export const { setReceivedRequests, updateReceivedRequestStatus,updateReceivedRequestDetails } = receivedRequestSlice.actions

export default receivedRequestSlice.reducer