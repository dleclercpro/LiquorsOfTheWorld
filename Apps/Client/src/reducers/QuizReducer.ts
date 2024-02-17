import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchedData, QuestionData, QuestionIndexData, QuizData, ScoresData, VoteData, VotesData } from '../types/DataTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { RootState } from '../store';
import { login, logout, ping } from './UserReducer';
import { CallGetQuestionIndex } from '../calls/quiz/CallGetQuestionIndex';
import { CallVote } from '../calls/quiz/CallVote';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { getInitialFetchedData } from '../utils';

interface QuizState {
  id: string | null,
  questions: FetchedData<QuestionData[]>,
  questionIndex: FetchedData<number>,
  votes: FetchedData<number[]>,
  scores: FetchedData<ScoresData>,
}

const initialState: QuizState = {
  id: null,
  questions: getInitialFetchedData(),
  questionIndex: getInitialFetchedData(),
  votes: getInitialFetchedData(),
  scores: getInitialFetchedData(),
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
      
      return data as number[];

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
  async ({ quizId, questionIndex, vote }: VoteData, { rejectWithValue }) => {
    try {
      const { data } = await new CallVote(quizId, questionIndex).execute({ vote });

      return data as VotesData;

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
      .addCase(vote.fulfilled, (state, action) => {
        state.questionIndex.data = action.payload.questionIndex;
        state.votes.data = action.payload.votes;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      })
      // Reset state on log out
      .addCase(logout.fulfilled, (state, action) => {
        state.id = null;
        state.questions = getInitialFetchedData();
        state.questionIndex = getInitialFetchedData();
        state.votes = getInitialFetchedData();
        state.scores = getInitialFetchedData();
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