import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

// Define a type for the slice state
interface UserState {
  user: string,
  email : string
}

// Define the initial state using that type
const initialState: UserState = {
  user: "",
  email: "",
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleEmail : (state,action) => {
      state.email = action.payload
    },
     getUserData : (state,action) => {
      state.user = action.payload
    }
  },
})

export const { getUserData, handleEmail } = counterSlice.actions

export default counterSlice.reducer