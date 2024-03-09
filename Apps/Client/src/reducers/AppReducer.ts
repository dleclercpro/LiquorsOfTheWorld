import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../actions/UserActions';
import { fetchData, startQuestion } from '../actions/QuizActions';

interface AppState {
  version: string | null,
  questionIndex: number, // Current question index in the app
}

const initialState: AppState = {
  version: null,
  questionIndex: 0,
};



export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, (state) => ({
        ...initialState,
        version: state.version,
      }))
      .addCase(logout.rejected, (state) => ({
        ...initialState,
        version: state.version,
      }))
      .addCase(fetchData.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      })
      .addCase(startQuestion.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      });
  },
});

export const { setVersion, setQuestionIndex } = appSlice.actions;

export default appSlice.reducer;