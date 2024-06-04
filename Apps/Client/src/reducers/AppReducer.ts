import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutAction } from '../actions/UserActions';
import { startQuestionAction } from '../actions/QuizActions';
import { Language, NO_QUESTION_INDEX } from '../constants';
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
  questionIndex: NO_QUESTION_INDEX,
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
        state.questionIndex = NO_QUESTION_INDEX;
      })
      .addCase(logoutAction.rejected, (state) => {
        state.questionIndex = NO_QUESTION_INDEX;
      })
      .addCase(startQuestionAction.fulfilled, (state, action: PayloadAction<CallStartQuestionResponseData>) => {
        state.questionIndex = action.payload;
      });
  },
});

export const { setLanguage, setVersion, setQuestionIndex, setBackgroundUrl } = appSlice.actions;

export default appSlice.reducer;