import { createSlice } from '@reduxjs/toolkit';

interface ModalsState {
  loading: {
    show: boolean,
    text: string | null,
  },
  answer: {
    show: boolean,
  },
}

const initialState: ModalsState = {
  loading: {
    show: false,
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
      state.loading.text = action.payload;
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
});

export const { showLoading, hideLoading, showAnswer, hideAnswer } = overlaysSlice.actions;

export default overlaysSlice.reducer;