import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../actions/AuthActions';
import { startQuestion } from '../actions/QuizActions';
import { Language } from '../constants';
import { INIT_LANGUAGE } from '../i18n';
import { fetchQuizData } from '../actions/DataActions';

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
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, (state) => ({
        ...initialState,
        language: state.language,
        version: state.version,
      }))
      .addCase(logout.rejected, (state) => ({
        ...initialState,
        language: state.language,
        version: state.version,
      }))
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      })
      .addCase(startQuestion.fulfilled, (state, action) => {
        state.questionIndex = action.payload as number;
      });
  },
});

export const { setLanguage, setVersion, setQuestionIndex, setBackgroundUrl } = appSlice.actions;

export default appSlice.reducer;