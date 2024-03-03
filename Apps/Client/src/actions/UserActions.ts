import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallLogIn } from '../calls/auth/CallLogIn';
import { LoginData, PingData, UserData, VotesData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { CallVote } from '../calls/quiz/CallVote';

export const login = createAsyncThunk(
  'user/login',
  async ({ quizId, username, password }: LoginData, { rejectWithValue }) => {
    try {
      const { data } = await new CallLogIn().execute({ quizId, username, password });

      if (!data) {
        throw new Error('MISSING_DATA');
      }
      
      const user = data as UserData;

      return {
        username: user.username,
        isAdmin: user.isAdmin,
        quizId,
      };

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

      if (!data) {
        throw new Error('MISSING_DATA');
      }

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

      if (!data) {
        throw new Error('MISSING_DATA');
      }

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