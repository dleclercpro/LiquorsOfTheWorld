import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallGetQuizNames } from '../calls/data/CallGetQuizNames';

export const fetchQuizNames = createAsyncThunk(
  'quiz/fetchQuizNames',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuizNames().execute();
      
      return data as string[];

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz names: ${error}`);
      return rejectWithValue(error);
    }
  }
);