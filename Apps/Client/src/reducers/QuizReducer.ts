import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CallGetPlayersResponseData, CallGetQuestionsResponseData, CallGetScoresResponseData, CallGetStatusResponseData, CallGetVotesResponseData, CallStartQuestionResponseData, CallVoteResponseData, FetchedData, GroupedScoresData, PlayersData, StatusData, VotesData } from '../types/DataTypes';
import { getInitialFetchedData } from '../utils';
import { startQuiz, startQuestion, vote } from '../actions/QuizActions';
import { logout, ping } from '../actions/AuthActions';
import { QuizJSON } from '../types/JSONTypes';
import { QuizName } from '../constants';
import { fetchStatus, fetchQuestions, fetchPlayers, fetchVotes, fetchScores } from '../actions/DataActions';

interface QuizState {
  id: string | null,
  name: QuizName | null,
  questions: FetchedData<QuizJSON>,
  status: FetchedData<StatusData>,
  votes: FetchedData<VotesData>,
  players: FetchedData<PlayersData>,
  scores: FetchedData<GroupedScoresData>,
}

const initialState: QuizState = {
  id: null,
  name: null,
  questions: getInitialFetchedData(),
  status: getInitialFetchedData(),
  votes: getInitialFetchedData(),
  players: getInitialFetchedData(),
  scores: getInitialFetchedData(),
};



export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizName: (state, action: PayloadAction<QuizName>) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching actions
      .addCase(fetchStatus.pending, (state) => {
        state.status.status = 'loading';
        state.status.error = null;

        state.players.status = 'loading';
        state.players.error = null;
      })
      .addCase(fetchStatus.fulfilled, (state, action: PayloadAction<CallGetStatusResponseData>) => {
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
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<CallGetQuestionsResponseData>) => {
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
      .addCase(fetchVotes.fulfilled, (state, action: PayloadAction<CallGetVotesResponseData>) => {
        state.votes.status = 'succeeded';
        state.votes.error = null;
        state.votes.data = action.payload;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.votes.status = 'failed';
        state.votes.error = action.payload as string;
        state.votes.data = null;
      })

      .addCase(fetchPlayers.pending, (state) => {
        state.players.status = 'loading';
        state.players.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<CallGetPlayersResponseData>) => {
        state.players.status = 'succeeded';
        state.players.error = null;
        state.players.data = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.players.status = 'failed';
        state.players.error = action.payload as string;
        state.players.data = null;
      })
      
      .addCase(fetchScores.pending, (state) => {
        state.scores.status = 'loading';
        state.scores.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action: PayloadAction<CallGetScoresResponseData>) => {
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
      .addCase(vote.fulfilled, (state, action: PayloadAction<CallVoteResponseData>) => {
        state.status.data = action.payload.status;
        state.votes.data = action.payload.votes;
      })
      .addCase(startQuiz.fulfilled, (state) => {
        if (!state.status.data) return;

        state.status.data.isStarted = true;
      })
      .addCase(startQuestion.fulfilled, (state, action: PayloadAction<CallStartQuestionResponseData>) => {
        if (!state.status.data) return;

        state.status.data.questionIndex = action.payload;
      })

      // Auth actions
      .addCase(ping.fulfilled, (state, action) => {
        state.id = action.payload.quizId as string | null;
      })
      // Reset state on logout, no matter if successful or not
      .addCase(logout.fulfilled, (state) => {
        return {
          ...initialState,
          name: state.name,
        };
      })
      .addCase(logout.rejected, (state) => {
        return {
          ...initialState,
          name: state.name,
        };
      });
;
  },
});

export const { setQuizName } = quizSlice.actions;

export default quizSlice.reducer;