import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { login, logout, ping } from '../actions/UserActions';

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