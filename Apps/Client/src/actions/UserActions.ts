import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallLogIn } from '../calls/auth/CallLogIn';
import { LoginData, PingData, VotesData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { CallVote } from '../calls/quiz/CallVote';

export const login = createAsyncThunk(
  'user/login',
  async ({ quizId, username, password }: LoginData, { rejectWithValue }) => {
    try {
      await new CallLogIn().execute({ quizId, username, password });

      return { quizId, username };

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not log user in: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await new CallLogOut().execute();

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not log user out: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const ping = createAsyncThunk(
  'user/ping',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await new CallPing().execute();
      console.log(`User is already authenticated.`);

      return data as PingData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`User is not authenticated yet: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const vote = createAsyncThunk(
  'user/vote',
  async ({ quizId, questionIndex, vote }: { quizId: string, questionIndex: number, vote: number }, { rejectWithValue }) => {
    try {
      const { data } = await new CallVote(quizId, questionIndex).execute({ vote });

      return data as VotesData;

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