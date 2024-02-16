import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CallLogIn } from '../calls/auth/CallLogIn';
import { RootState } from '../store';
import { LoginData } from '../types';

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
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state = initialState;
    },
  },
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
        state.error = action.payload as string; // Assuming payload is an error message
      });
  },
});

export const { logout } = userSlice.actions;

export const selectAuthentication = (state: RootState) => state.user;

export default userSlice.reducer;