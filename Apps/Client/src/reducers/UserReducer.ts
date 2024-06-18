import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { loginAction, logoutAction, pingAction } from '../actions/AuthActions';
import { CallPingResponseData, UserData } from '../types/DataTypes';

export type UserState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,

  username: string | null,
  teamId: string | null,
  isAdmin: boolean,
  isAuthenticated: boolean,
};

const initialState: UserState = {
  status: 'idle',
  error: null,

  username: null,
  teamId: null,
  isAdmin: false,
  isAuthenticated: false,
};



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: () => initialState,
    setUser: (state, action: PayloadAction<UserData>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })


      // Logout
      .addCase(logoutAction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })


      // Ping
      .addCase(pingAction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(pingAction.fulfilled, (state, action: PayloadAction<CallPingResponseData>) => {
        state.status = 'succeeded';
        state.error = null;

        // Data might not be present (e.g. user is not authenticated)
        if (!action.payload.user) {
          return {
            ...state,
            username: null,
            teamId: null,
            isAdmin: false,
            isAuthenticated: false,
          };
        }

        state.username = action.payload.user.username;
        state.isAdmin = action.payload.user.isAdmin;
        state.isAuthenticated = action.payload.user.isAuthenticated;
      })
      .addCase(pingAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;

        state.username = null;
        state.teamId = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;