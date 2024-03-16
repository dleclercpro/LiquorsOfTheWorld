import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusData, GroupedScoreData } from '../types/DataTypes';
import { CallGetQuestions } from '../calls/quiz/CallGetQuestions';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { QuizJSON } from '../types/JSONTypes';
import { RootState } from '../stores/store';
import { CallStartQuiz } from '../calls/quiz/CallStartQuiz';
import { CallStartQuestion } from '../calls/quiz/CallStartQuestion';
import { Language, QuizName } from '../constants';
import { CallDeleteQuiz } from '../calls/quiz/CallDeleteQuiz';
import { logout } from './UserActions';

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async ({ lang, quizName }: { lang: Language, quizName: QuizName }, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuestions(lang, quizName).execute();
      
      return data as QuizJSON;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch questions: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchStatus = createAsyncThunk(
  'quiz/fetchStatus',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetStatus(quizId).execute();
      
      return data as StatusData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz status: ${error}`);
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
      
      return data as GroupedScoreData;

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



export const fetchData = createAsyncThunk(
  'quiz/fetchData',
  async ({ quizId, quizName, lang }: { quizId: string, quizName: QuizName, lang: Language } , { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await Promise.all([
        dispatch(fetchQuestions({ lang, quizName })),
        dispatch(fetchVotes(quizId)),
        dispatch(fetchScores(quizId)),
        dispatch(fetchStatus(quizId)),
      ]);

      const someFetchActionFailed = result
        .map(({ type }) => type)
        .some(type => type.endsWith('/rejected'));

      if (someFetchActionFailed) {
        throw new Error('DATA_FETCH');
      }
      
      const { quiz } = getState() as RootState;
      const status = quiz.status.data as StatusData;
      const votes = quiz.votes.data as number[];

      // The current question index in the app corresponds to the first question
      // the user hasn't answered yet, unless the player has answered all the
      // questions already
      const questionIndex = status.questionIndex;
      const playerQuestionIndex = votes.length;
      
      if (playerQuestionIndex < questionIndex) {
        return playerQuestionIndex;
      }
      return questionIndex;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch initial data: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const startQuiz = createAsyncThunk(
  'quiz/startQuiz',
  async ({ quizId, isSupervised }: { quizId: string, isSupervised: boolean }, { rejectWithValue }) => {
    try {
      await new CallStartQuiz(quizId).execute({ isSupervised });

      return;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async (quizId: string, { dispatch, rejectWithValue }) => {
    try {
      await new CallDeleteQuiz(quizId).execute();

      dispatch(logout());

      return;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);

export const startQuestion = createAsyncThunk(
  'quiz/question/start',
  async ({ quizId, questionIndex }: { quizId: string, questionIndex: number }, { rejectWithValue }) => {
    try {
      await new CallStartQuestion(quizId, questionIndex).execute();

      return questionIndex;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);