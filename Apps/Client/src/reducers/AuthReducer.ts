import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { pingAction } from '../actions/AuthActions';

interface PartialAuthState {
  username: string | null,
  isAdmin: boolean,
  isAuthenticated: boolean,
}

interface AuthState extends PartialAuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: AuthState = {
  username: null,
  isAdmin: false,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};



export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<PartialAuthState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Ping
      .addCase(pingAction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(pingAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(pingAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;

        state.username = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;