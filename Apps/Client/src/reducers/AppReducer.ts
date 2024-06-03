import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutAction } from '../actions/AuthActions';
import { startQuestionAction } from '../actions/QuizActions';
import { Language } from '../constants';
import { INIT_LANGUAGE } from '../i18n';
import { CallStartQuestionResponseData } from '../types/DataTypes';

interface AppState {
  language: Language,
  version: string | null,
  questionIndex: number, // Current question index in the app
  styles: {
    bg: string | null,
  },
}

const initialState: AppState = {
  language: INIT_LANGUAGE,
  version: null,
  questionIndex: 0,
  styles: {
    bg: null,
  },
};



export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    setBackgroundUrl: (state, action: PayloadAction<string>) => {
      state.styles.bg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAction.fulfilled, (state) => {
        state.questionIndex = 0; // Only reset question index on log out
      })
      .addCase(logoutAction.rejected, (state) => {
        state.questionIndex = 0; // Only reset question index on log out
      })
      .addCase(startQuestionAction.fulfilled, (state, action: PayloadAction<CallStartQuestionResponseData>) => {
        state.questionIndex = action.payload;
      });
  },
});

export const { setLanguage, setVersion, setQuestionIndex, setBackgroundUrl } = appSlice.actions;

export default appSlice.reducer;