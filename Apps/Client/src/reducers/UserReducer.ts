import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../stores/store';
import { login, logout, ping } from '../actions/UserActions';

interface UserState {
  username: string | null,
  isAdmin: boolean,
  isAuthenticated: boolean,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: UserState = {
  username: null,
  isAdmin: false,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};



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
        state.error = null;

        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;

        state.username = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      // Reset state on log out
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;

        state.username = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(ping.fulfilled, (state, action) => {
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = true;
      })
      .addCase(ping.rejected, (state) => {
        state.isAdmin = false;
        state.isAuthenticated = false;
      });
  },
});

export const selectAuthentication = (state: RootState) => state.user;

export default userSlice.reducer;