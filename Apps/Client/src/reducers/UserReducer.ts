import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { loginAction, logoutAction, pingAction } from '../actions/UserActions';
import { UserData } from '../types/DataTypes';

type UserState = UserData & {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: UserState = {
  username: null,
  team: null,
  isAdmin: false,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<UserData>) => {
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

export const { setAuth } = userSlice.actions;

export default userSlice.reducer;