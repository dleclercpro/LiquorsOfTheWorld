import { createSlice } from '@reduxjs/toolkit';
import { FetchedData, ScoreData, StatusData } from '../types/DataTypes';
import { getInitialFetchedData } from '../utils';
import { fetchQuestions, fetchStatus, fetchVotes, fetchScores, startQuiz } from '../actions/QuizActions';
import { login, logout, ping, vote } from '../actions/UserActions';
import { QuizJSON } from '../types/JSONTypes';
import { RootState } from '../stores/store';

interface QuizState {
  id: string | null,
  questions: FetchedData<QuizJSON>,
  status: FetchedData<StatusData>,
  votes: FetchedData<number[]>,
  scores: FetchedData<ScoreData>,
}

const initialState: QuizState = {
  id: null,
  questions: getInitialFetchedData(),
  status: getInitialFetchedData(),
  votes: getInitialFetchedData(),
  scores: getInitialFetchedData(),
};



export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.questions.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions.status = 'succeeded';
        state.questions.data = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.questions.status = 'failed';
        state.questions.error = action.payload as string;
      })
      .addCase(fetchStatus.pending, (state) => {
        state.status.status = 'loading';
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.status.status = 'succeeded';
        state.status.data = action.payload;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status.status = 'failed';
        state.status.error = action.payload as string;
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
        state.status.data = action.payload.status;
        state.votes.data = action.payload.votes;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      })
      // Reset state on log out
      .addCase(logout.fulfilled, (state, action) => {
        state.id = null;
        state.questions = getInitialFetchedData();
        state.status = getInitialFetchedData();
        state.votes = getInitialFetchedData();
        state.scores = getInitialFetchedData();
      })
      .addCase(startQuiz.fulfilled, (state) => {
        if (state.status.data === null) return;

        state.status.data.hasStarted = true;
      })
      .addCase(ping.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      });
  },
});

// export const { } = quizSlice.actions;

export const selectPlayers = (state: RootState) => {
  const quiz = state.quiz;

  const scores = quiz.scores.data;

  if (scores === null) {
    return null;
  }

  return Object.keys(scores);
}

export const selectRightAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (questions === null) {
    return null;
  }
  
  const question = questions[questionIndex];
  const answer = question.options[question.answer];

  return answer;
}

export const selectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (questions === null || votes === null) {
    return null;
  }
  
  const question = questions[questionIndex];
  const vote = votes[questionIndex];
  const answer = question.options[vote];

  return answer;
}

export const selectVote = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (questions === null || votes === null || votes.length < questionIndex + 1) {
    return {
      voteIndex: null,
      vote: null,
    };
  }
  
  const question = questions[questionIndex];
  const voteIndex = votes[questionIndex];
  const vote = question.options[voteIndex];

  return {
    voteIndex,
    vote,
  };
}

export const mustWaitForOthers = (state: RootState) => {
  const app = state.app;
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = selectPlayers(state);
  
  if (status === null || votes === null || players === null) {
    return false;
  }

  const { questionIndex } = app;
  const { isOver, votesCount } = status;

  return !isOver && votesCount[questionIndex] < players.length;
}

export default quizSlice.reducer;