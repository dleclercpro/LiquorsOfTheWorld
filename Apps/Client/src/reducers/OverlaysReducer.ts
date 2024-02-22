import { createSlice } from '@reduxjs/toolkit';
import { logout } from '../actions/UserActions';

interface OverlaysState {
  loading: {
    show: boolean,
    opaque: boolean,
    text: string | null,
  },
  answer: {
    show: boolean,
  },
}

const initialState: OverlaysState = {
  loading: {
    show: false,
    opaque: false,
    text: null,
  },
  answer: {
    show: false,
  },
};



export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.loading.show = true;
      state.loading.opaque = action.payload.opaque;
      state.loading.text = action.payload.text;
    },
    hideLoading: (state) => {
      state.loading.show = false;
    },
    showAnswer: (state) => {
      state.answer.show = true;
    },
    hideAnswer: (state) => {
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

export const { showLoading, hideLoading, showAnswer, hideAnswer } = overlaysSlice.actions;

export default overlaysSlice.reducer;