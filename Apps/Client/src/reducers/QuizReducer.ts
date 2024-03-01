import { createSlice } from '@reduxjs/toolkit';
import { FetchedData, ScoreData, StatusData } from '../types/DataTypes';
import { getInitialFetchedData } from '../utils';
import { fetchQuestions, fetchStatus, fetchVotes, fetchScores, startQuiz, startQuestion } from '../actions/QuizActions';
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
      // Fetching actions
      .addCase(fetchStatus.pending, (state) => {
        state.status.status = 'loading';
        state.status.error = null;
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.status.status = 'succeeded';
        state.status.error = null;
        state.status.data = action.payload;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status.status = 'failed';
        state.status.error = action.payload as string;
        state.status.data = null;
      })

      .addCase(fetchQuestions.pending, (state) => {
        state.questions.status = 'loading';
        state.questions.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions.status = 'succeeded';
        state.questions.error = null;
        state.questions.data = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.questions.status = 'failed';
        state.questions.error = action.payload as string;
        state.questions.data = null;
      })

      .addCase(fetchVotes.pending, (state) => {
        state.votes.status = 'loading';
        state.votes.error = null;
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.votes.status = 'succeeded';
        state.votes.error = null;
        state.votes.data = action.payload;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.votes.status = 'failed';
        state.votes.error = action.payload as string;
        state.votes.data = null;
      })
      
      .addCase(fetchScores.pending, (state) => {
        state.scores.status = 'loading';
        state.scores.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.scores.status = 'succeeded';
        state.scores.error = null;
        state.scores.data = action.payload;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.scores.status = 'failed';
        state.scores.error = action.payload as string;
        state.scores.data = null;
      })



      // Other actions
      .addCase(vote.fulfilled, (state, action) => {
        state.status.data = action.payload.status;
        state.votes.data = action.payload.votes;
      })
      .addCase(startQuiz.fulfilled, (state) => {
        if (state.status.data === null) return;

        state.status.data.isStarted = true;
      })
      .addCase(startQuestion.fulfilled, (state, action) => {
        if (state.status.data === null) return;

        state.status.data.questionIndex = action.payload;
      })

      // Auth actions
      .addCase(ping.fulfilled, (state, action) => {
        state.id = action.payload.quizId;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.id = action.payload.quizId
      })
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState);
;
  },
});

// export const { } = quizSlice.actions;

export const selectPlayers = (state: RootState) => {
  const status = state.quiz.status.data;

  if (status === null) {
    return [];
  }

  return status.players;
}

export const selectQuestion = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (questions === null || votes === null) {
    return null;
  }
  
  return questions[questionIndex];
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

export const selectCorrectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (questions === null) {
    return null;
  }
  
  const question = questions[questionIndex];
  const answer = question.options[question.answer];

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

export const haveAllPlayersAnswered = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = selectPlayers(state);
  
  if (status === null || votes === null || players === null) {
    return false;
  }

  const { votesCount } = status;

  return votesCount[questionIndex] === players.length;
}

export default quizSlice.reducer;