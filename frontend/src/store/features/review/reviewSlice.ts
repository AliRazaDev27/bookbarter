import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IReview } from '@/types'



const initialState: { data: IReview[]|null } = {
  data: null,
}

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviewData: (state, action:PayloadAction<IReview[]>) => {
      state.data = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setReviewData } = reviewSlice.actions

export default reviewSlice.reducer