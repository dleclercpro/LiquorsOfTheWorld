import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuestionData, QuizData } from '../types/QuizTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { RootState } from '../store';
import { login } from './UserReducer';

interface QuizState {
  id: string | null,
  questions: QuestionData[],
  questionIndex: number,
  shouldShowAnswer: boolean,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: QuizState = {
  id: null,
  questions: [],
  questionIndex: 0,
  shouldShowAnswer: false,
  status: 'idle',
  error: null,
};

export const fetchQuizData = createAsyncThunk(
  'quiz/fetchQuizData',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuiz(quizId).execute();
      
      return data as QuizData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz data: ${error}`);
      return rejectWithValue(error);
    }
  }
)

export const authSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    incrementQuestionIndex: (state) => {
      state.questionIndex += 1;
    },
    showAnswer: (state) => {
      state.shouldShowAnswer = true;
    },
    hideAnswer: (state) => {
      state.shouldShowAnswer = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload.questions;
        state.questionIndex = action.payload.questionIndex;
      })
      .addCase(fetchQuizData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      });
  },
});

export const { setQuestionIndex, incrementQuestionIndex, showAnswer, hideAnswer } = authSlice.actions;

export const selectQuestionAnswer = (state: RootState) => {
  const { questions, questionIndex } = state.quiz;

  if (questions.length === 0) {
    return null;
  }
  
  const question = questions[questionIndex];
  const answer = question.options[question.answer];

  return answer;
}

export default authSlice.reducer;