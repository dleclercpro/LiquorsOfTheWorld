import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchQuizNamesAction } from '../actions/DataActions';
import { QuizData } from '../types/DataTypes';

interface DataState {
  quizzes: QuizData[],
}

const initialState: DataState = {
  quizzes: [],
};



export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizNamesAction.fulfilled, (state, action: PayloadAction<QuizData[]>) => {
        state.quizzes = action.payload;
      });
  },
});

export default dataSlice.reducer;