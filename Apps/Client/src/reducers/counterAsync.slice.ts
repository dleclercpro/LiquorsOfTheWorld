import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { sleep } from '../utils/time';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const incrementAsync = createAsyncThunk(
  'counterAsync/fetchCount',
  async (amount: number) => {
    await sleep(1_000);

    return amount;
  }
)

export const counterAsyncSlice = createSlice({
  name: 'counterAsync',
  initialState,
  reducers: {},
  // React to anything that isn't directly related to the slice: async or other slices' actions
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default counterAsyncSlice.reducer;