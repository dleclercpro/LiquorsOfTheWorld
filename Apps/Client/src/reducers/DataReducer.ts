import { createSlice } from '@reduxjs/toolkit';
import { fetchQuizNames } from '../actions/DataActions';
import { logout } from '../actions/UserActions';

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
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => ({
        ...initialState,
      }))
      .addCase(logout.rejected, () => ({
        ...initialState,
      }))
      .addCase(fetchQuizNames.fulfilled, (state, action) => {
        state.quizzes = action.payload as string[];
      });
  },
});

export default dataSlice.reducer;