import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../actions/AuthActions';

interface OverlaysState {
  loading: {
    open: boolean,
  },
  answer: {
    open: boolean,
  },
}

const initialState: OverlaysState = {
  loading: {
    open: false,
  },
  answer: {
    open: false,
  },
};



export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    closeAllOverlays: () => initialState,
    openLoadingOverlay: (state) => {
      state.loading.open = true;
    },
    closeLoadingOverlay: (state) => {
      state.loading.open = false;
    },
    openAnswerOverlay: (state) => {
      state.answer.open = true;
    },
    closeAnswerOverlay: (state) => {
      state.answer.open = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
    },
});

export const { closeAllOverlays, openLoadingOverlay, closeLoadingOverlay, openAnswerOverlay, closeAnswerOverlay } = overlaysSlice.actions;

export default overlaysSlice.reducer;