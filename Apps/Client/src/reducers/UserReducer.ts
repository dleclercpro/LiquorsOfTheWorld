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
      .addCase(ping.fulfilled, (state, action) => {
        state.username = action.payload.username;
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = true;
      })
      .addCase(ping.rejected, (state) => {
        state.username = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
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

        // Login failed: delete all user-related data
        state.username = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
  },
});

export const selectAuthentication = (state: RootState) => state.user;

export default userSlice.reducer;