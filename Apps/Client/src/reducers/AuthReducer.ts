import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CallLogIn } from '../calls/auth/CallLogIn';
import { RootState } from '../store';

interface LoginData {
  username: string,
  password: string,
}

interface AuthState {
  username: string | null,
  isAuthenticated: boolean,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: AuthState = {
  username: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: LoginData, { rejectWithValue }) => {
    try {
      await new CallLogIn(username, password).execute();
      
      return username;

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

export const authSlice = createSlice({
  name: 'auth',
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
        state.username = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // Assuming payload is an error message
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;