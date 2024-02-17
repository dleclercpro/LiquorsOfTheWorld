import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CallLogIn } from '../calls/auth/CallLogIn';
import { RootState } from '../store';
import { LoginData, PingData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';

interface UserState {
  username: string | null,
  isAuthenticated: boolean,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: UserState = {
  username: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

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



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.username = action.payload.username;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      // Reset state on log out
      .addCase(logout.fulfilled, (state) => {
        state.username = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(ping.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(ping.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const selectAuthentication = (state: RootState) => state.user;

export default userSlice.reducer;