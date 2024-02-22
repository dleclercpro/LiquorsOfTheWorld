import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../actions/UserActions';

interface OverlaysState {
  loading: {
    show: boolean,
  },
  welcome: {
    show: boolean,
  },
  answer: {
    show: boolean,
  },
}

const initialState: OverlaysState = {
  loading: {
    show: false,
  },
  welcome: {
    show: false,
  },
  answer: {
    show: false,
  },
};



export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    showLoadingOverlay: (state) => {
      state.loading.show = true;
    },
    hideLoadingOverlay: (state) => {
      state.loading.show = false;
    },
    showWelcomeOverlay: (state) => {
      state.welcome.show = true;
    },
    hideWelcomeOverlay: (state) => {
      state.welcome.show = false;
    },
    showAnswerOverlay: (state) => {
      state.answer.show = true;
    },
    hideAnswerOverlay: (state) => {
      state.answer.show = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
    },
});

export const { showLoadingOverlay, hideLoadingOverlay, showWelcomeOverlay, hideWelcomeOverlay, showAnswerOverlay, hideAnswerOverlay } = overlaysSlice.actions;

export default overlaysSlice.reducer;