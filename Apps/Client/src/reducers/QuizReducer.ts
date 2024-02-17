import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuestionData, QuestionIndexData, QuizData, ScoresData, VoteData, VotesData } from '../types/DataTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { RootState } from '../store';
import { login, ping } from './UserReducer';
import { CallGetQuestionIndex } from '../calls/quiz/CallGetQuestionIndex';
import { CallVote } from '../calls/quiz/CallVote';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';

interface QuizState {
  id: string | null,
  questions: {
    data: QuestionData[] | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
  questionIndex: {
    data: number | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
  votes: {
    data: VotesData | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
  scores: {
    data: ScoresData | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
  },
}

const initialState: QuizState = {
  id: null,
  questions: {
    data: null,
    status: 'idle',
    error: null,
  },
  questionIndex: {
    data: null,
    status: 'idle',
    error: null,
  },
  votes: {
    data: null,
    status: 'idle',
    error: null,
  },
  scores: {
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

      console.error(`Could not fetch question index: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchVotes = createAsyncThunk(
  'quiz/fetchVotes',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetVotes(quizId).execute();
      
      return data as VotesData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch user's votes: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchScores = createAsyncThunk(
  'quiz/fetchScores',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetScores(quizId).execute();
      
      return data as ScoresData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch scores: ${error}`);
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
      .addCase(fetchVotes.pending, (state) => {
        state.votes.status = 'loading';
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.votes.status = 'succeeded';
        state.votes.data = action.payload;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.votes.status = 'failed';
        state.votes.error = action.payload as string;
      })
      .addCase(fetchScores.pending, (state) => {
        state.scores.status = 'loading';
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.scores.status = 'succeeded';
        state.scores.data = action.payload;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.scores.status = 'failed';
        state.scores.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      })
      .addCase(ping.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      });
  },
});

export const { setQuestionIndex, incrementQuestionIndex } = authSlice.actions;

export const selectQuestionAnswer = (state: RootState) => {
  const quiz = state.quiz;
  const questions = quiz.questions.data;
  const questionIndex = quiz.questionIndex.data;

  if (questionIndex === null || questions === null) {
    return null;
  }
  
  const question = questions[questionIndex];
  const answer = question.options[question.answer];

  return answer;
}

export default authSlice.reducer;