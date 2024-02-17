import { createSlice } from '@reduxjs/toolkit';

interface ModalsState {
  loading: {
    show: boolean,
  },
  answer: {
    show: boolean,
  },
}

const initialState: ModalsState = {
  loading: {
    show: false,
  },
  answer: {
    show: false,
  },
};



export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading.show = true;
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

export const { showLoading, hideLoading, showAnswer, hideAnswer } = modalsSlice.actions;

export default modalsSlice.reducer;