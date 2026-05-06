import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

// Define a type for the slice state
interface UserState {
  user: string
}

// Define the initial state using that type
const initialState: UserState = {
  user: "",
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    
  },
})

export const {  } = counterSlice.actions

export default counterSlice.reducer