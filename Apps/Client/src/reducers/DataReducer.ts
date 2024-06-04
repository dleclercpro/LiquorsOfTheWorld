import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchQuizNamesAction } from '../actions/DataActions';

interface DataState {
  quizzes: string[],
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
      .addCase(fetchQuizNamesAction.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.quizzes = action.payload;
      });
  },
});

export default dataSlice.reducer;