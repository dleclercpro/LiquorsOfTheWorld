import { createSlice } from '@reduxjs/toolkit';
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
      .addCase(fetchQuizNamesAction.fulfilled, (state, action) => {
        state.quizzes = action.payload as string[];
      });
  },
});

export default dataSlice.reducer;