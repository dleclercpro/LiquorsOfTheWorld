import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuestionData, QuestionIndexData, QuizData, VoteData } from '../types/DataTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { RootState } from '../store';
import { login } from './UserReducer';
import { CallGetQuestionIndex } from '../calls/quiz/CallGetQuestionIndex';
import { CallVote } from '../calls/quiz/CallVote';

interface QuizState {
  id: string | null,
  questions: {
    data: QuestionData[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
  questionIndex: {
    data: number | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
}

const initialState: QuizState = {
  id: null,
  questions: {
    data: [],
    status: 'idle',
    error: null,
  },
  questionIndex: {
    data: null,
    status: 'idle',
    error: null,
  },
};

export const fetchQuizData = createAsyncThunk(
  'quiz/fetchQuizData',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuiz().execute();
      
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
);

export const fetchQuestionIndexData = createAsyncThunk(
  'quiz/fetchQuestionIndexData',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuestionIndex(quizId).execute();
      
      return data as QuestionIndexData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz ${quizId} question index data: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const vote = createAsyncThunk(
  'user/vote',
  async ({ vote }: VoteData, { getState, rejectWithValue }) => {
    try {
      const { quiz } = getState() as RootState;
      const quizId = quiz.id;
      const questionIndex = quiz.questionIndex.data;

      if (quizId === null || questionIndex === null) {
        return;
      }

      await new CallVote(quizId, questionIndex).execute({ vote });

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      return rejectWithValue(error);
    }
  }
);



export const authSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex.data = action.payload;
    },
    incrementQuestionIndex: (state) => {
      if (state.questionIndex.data === null) {
        throw new Error('CANNOT_INCREMENT_QUESTION_INDEX');
      }
      state.questionIndex.data += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizData.pending, (state) => {
        state.questions.status = 'loading';
      })
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        state.questions.status = 'succeeded';
        state.questions.data = action.payload.questions;
      })
      .addCase(fetchQuizData.rejected, (state, action) => {
        state.questions.status = 'failed';
        state.questions.error = action.payload as string;
      })
      .addCase(fetchQuestionIndexData.pending, (state) => {
        state.questionIndex.status = 'loading';
      })
      .addCase(fetchQuestionIndexData.fulfilled, (state, action) => {
        state.questionIndex.status = 'succeeded';
        state.questionIndex.data = action.payload.questionIndex;
      })
      .addCase(fetchQuestionIndexData.rejected, (state, action) => {
        state.questionIndex.status = 'failed';
        state.questionIndex.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      });
  },
});

export const { setQuestionIndex, incrementQuestionIndex } = authSlice.actions;

export const selectQuestionAnswer = (state: RootState) => {
  const quiz = state.quiz;
  const questions = quiz.questions.data;
  const questionIndex = quiz.questionIndex.data;

  if (questionIndex === null || questions.length === 0) {
    return null;
  }
  
  const question = questions[questionIndex];
  const answer = question.options[question.answer];

  return answer;
}

export default authSlice.reducer;