import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../actions/UserActions';
import { fetchData, startQuestion } from '../actions/QuizActions';

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
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState)
      .addCase(fetchData.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      })
      .addCase(startQuestion.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      });
  },
});

export const { setQuestionIndex } = appSlice.actions;

export default appSlice.reducer;