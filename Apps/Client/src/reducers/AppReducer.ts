import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../actions/UserActions';

interface AppState {
  questionIndex: number, // Current question index in the app
}

const initialState: AppState = {
  questionIndex: 0,
};



export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state on log out
      .addCase(logout.fulfilled, (state, action) => {
        state.questionIndex = 0;
      })
  },
});

export const { setQuestionIndex } = appSlice.actions;

export default appSlice.reducer;