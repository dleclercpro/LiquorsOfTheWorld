import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from './UserActions';
import { CallDeleteDatabase } from '../calls/quiz/CallDeleteDatabase';

export const deleteDatabase = createAsyncThunk(
  'database/delete',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await new CallDeleteDatabase().execute();

      dispatch(logout());

      return;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);