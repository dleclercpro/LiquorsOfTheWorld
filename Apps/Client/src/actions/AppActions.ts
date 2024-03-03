import { createAsyncThunk } from '@reduxjs/toolkit';
import { VersionData } from '../types/DataTypes';
import { CallGetVersion } from '../calls/quiz/CallGetVersion';
import { setVersion } from '../reducers/AppReducer';

export const fetchVersion = createAsyncThunk(
  'app/version',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await new CallGetVersion().execute();

      if (!data) {
        throw new Error('MISSING_DATA');
      }

      const { version } = data as VersionData;

      dispatch(setVersion(version));

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not get app version: ${error}`);
      return rejectWithValue(error);
    }
  }
);