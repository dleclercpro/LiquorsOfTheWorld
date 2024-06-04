import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CallGetPlayersResponseData, CallGetQuestionsResponseData, CallGetScoresResponseData, CallGetStatusResponseData, CallGetVotesResponseData, CallPingResponseData, CallStartQuestionResponseData, CallVoteResponseData, FetchedData, GroupedScoresData, GroupedVotesData, PlayersData, StatusData } from '../types/DataTypes';
import { getInitialFetchedData } from '../utils';
import { startQuizAction, startQuestionAction, voteAction } from '../actions/QuizActions';
import { logoutAction, pingAction } from '../actions/UserActions';
import { QuizJSON } from '../types/JSONTypes';
import { QuizName } from '../constants';
import { fetchStatusAction, fetchQuestionsAction, fetchPlayersAction, fetchVotesAction, fetchScoresAction, fetchTeamsAction } from '../actions/DataActions';

interface QuizState {
  id: string | null,
  name: QuizName | null,
  teams: FetchedData<string[]>,
  questions: FetchedData<QuizJSON>,
  status: FetchedData<StatusData>,
  votes: FetchedData<GroupedVotesData>,
  players: FetchedData<PlayersData>,
  scores: FetchedData<GroupedScoresData>,
}

const initialState: QuizState = {
  id: null,
  name: null,
  teams: getInitialFetchedData(),
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
    setQuizId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setQuizName: (state, action: PayloadAction<QuizName>) => {
      state.name = action.payload;
    },
  },
  // FIXME:
  // Decide on whether to handle server actions in the reducer, or dispatch
  // simpler actions within said server actions
  extraReducers: (builder) => {
    builder
      // Fetching actions
      .addCase(fetchStatusAction.pending, (state) => {
        state.status.status = 'loading';
        state.status.error = null;

        state.players.status = 'loading';
        state.players.error = null;
      })
      .addCase(fetchStatusAction.fulfilled, (state, action: PayloadAction<CallGetStatusResponseData>) => {
        state.status.status = 'succeeded';
        state.status.error = null;
        state.status.data = action.payload;
      })
      .addCase(fetchStatusAction.rejected, (state, action) => {
        state.status.status = 'failed';
        state.status.error = action.payload as string;
        state.status.data = null;
      })

      .addCase(fetchQuestionsAction.pending, (state) => {
        state.questions.status = 'loading';
        state.questions.error = null;
      })
      .addCase(fetchQuestionsAction.fulfilled, (state, action: PayloadAction<CallGetQuestionsResponseData>) => {
        state.questions.status = 'succeeded';
        state.questions.error = null;
        state.questions.data = action.payload;
      })
      .addCase(fetchQuestionsAction.rejected, (state, action) => {
        state.questions.status = 'failed';
        state.questions.error = action.payload as string;
        state.questions.data = null;
      })

      .addCase(fetchTeamsAction.pending, (state) => {
        state.teams.status = 'loading';
        state.teams.error = null;
      })
      .addCase(fetchTeamsAction.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.teams.status = 'succeeded';
        state.teams.error = null;
        state.teams.data = action.payload;
      })
      .addCase(fetchTeamsAction.rejected, (state, action) => {
        state.teams.status = 'failed';
        state.teams.error = action.payload as string;
        state.teams.data = null;
      })

      .addCase(fetchVotesAction.pending, (state) => {
        state.votes.status = 'loading';
        state.votes.error = null;
      })
      .addCase(fetchVotesAction.fulfilled, (state, action: PayloadAction<CallGetVotesResponseData>) => {
        state.votes.status = 'succeeded';
        state.votes.error = null;
        state.votes.data = action.payload;
      })
      .addCase(fetchVotesAction.rejected, (state, action) => {
        state.votes.status = 'failed';
        state.votes.error = action.payload as string;
        state.votes.data = null;
      })

      .addCase(fetchPlayersAction.pending, (state) => {
        state.players.status = 'loading';
        state.players.error = null;
      })
      .addCase(fetchPlayersAction.fulfilled, (state, action: PayloadAction<CallGetPlayersResponseData>) => {
        state.players.status = 'succeeded';
        state.players.error = null;
        state.players.data = action.payload;
      })
      .addCase(fetchPlayersAction.rejected, (state, action) => {
        state.players.status = 'failed';
        state.players.error = action.payload as string;
        state.players.data = null;
      })
      
      .addCase(fetchScoresAction.pending, (state) => {
        state.scores.status = 'loading';
        state.scores.error = null;
      })
      .addCase(fetchScoresAction.fulfilled, (state, action: PayloadAction<CallGetScoresResponseData>) => {
        state.scores.status = 'succeeded';
        state.scores.error = null;
        state.scores.data = action.payload;
      })
      .addCase(fetchScoresAction.rejected, (state, action) => {
        state.scores.status = 'failed';
        state.scores.error = action.payload as string;
        state.scores.data = null;
      })



      // Other actions
      .addCase(voteAction.fulfilled, (state, action: PayloadAction<CallVoteResponseData>) => {
        state.status.data = action.payload.status;
        state.votes.data = action.payload.votes;
      })
      .addCase(startQuizAction.fulfilled, (state) => {
        if (!state.status.data) return;

        state.status.data.isStarted = true;
      })
      .addCase(startQuestionAction.fulfilled, (state, action: PayloadAction<CallStartQuestionResponseData>) => {
        if (!state.status.data) return;

        state.status.data.questionIndex = action.payload;
      })

      // Auth actions
      .addCase(pingAction.fulfilled, (state, action: PayloadAction<CallPingResponseData>) => {
        state.id = action.payload.quizId;
      })

      // Reset state on logout, no matter if successful or not
      .addCase(logoutAction.fulfilled, (state) => {
        return {
          ...initialState,
          name: state.name,
        };
      })
      .addCase(logoutAction.rejected, (state) => {
        return {
          ...initialState,
          name: state.name,
        };
      });
;
  },
});

export const { setQuizId, setQuizName } = quizSlice.actions;

export default quizSlice.reducer;