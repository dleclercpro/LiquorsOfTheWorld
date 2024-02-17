import { createAsyncThunk } from '@reduxjs/toolkit';
import { QuestionIndexData, QuizData, ScoresData, VoteData, VotesData } from '../types/DataTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { CallGetQuestionIndex } from '../calls/quiz/CallGetQuestionIndex';
import { CallVote } from '../calls/quiz/CallVote';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';

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