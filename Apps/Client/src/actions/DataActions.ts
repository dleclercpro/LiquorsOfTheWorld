import { CallGetQuizList } from '../calls/data/CallGetQuizList';
import { CallGetPlayers } from '../calls/quiz/CallGetPlayers';
import { CallGetQuestions } from '../calls/quiz/CallGetQuestions';
import { CallGetTeams } from '../calls/quiz/CallGetTeams';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { Language, QuizName } from '../constants';
import { CallGetPlayersResponseData, CallGetQuestionsResponseData, CallGetQuizListResponseData, CallGetTeamsResponseData, CallGetScoresResponseData, CallGetStatusResponseData, CallGetVotesResponseData } from '../types/DataTypes';
import { createServerAction } from './ServerActions';
import { logoutAction, pingAction } from './AuthActions';
import { updateVersionAction } from './AppActions';
import AppStore from '../stores/AppStore';

export const fetchQuizNamesAction = createServerAction<void, CallGetQuizListResponseData>(
  'data/quiz-names',
  async () => {
    const { data } = await new CallGetQuizList().execute();
      
    return data!;
  },
);

export const fetchTeamsAction = createServerAction<string, CallGetTeamsResponseData>(
  'data/teams',
  async (quizId: string) => {
    const { data } = await new CallGetTeams(quizId).execute();
      
    return data!;
  },
);

type FetchQuestionDataActionArgs = { language: Language, quizId: string };
export const fetchQuestionDataAction = createServerAction<FetchQuestionDataActionArgs, CallGetQuestionsResponseData>(
  'data/questions',
  async ({ language, quizId }) => {
    const { data } = await new CallGetQuestions(language, quizId).execute();
      
    return data!;
  },
);

export const fetchStatusAction = createServerAction<string, CallGetStatusResponseData>(
  'data/status',
  async (quizId) => {
    const { data } = await new CallGetStatus(quizId).execute();
      
    return data!;
  },
);

export const fetchPlayersAction = createServerAction<string, CallGetPlayersResponseData>(
  'data/players',
  async (quizId) => {
    const { data } = await new CallGetPlayers(quizId).execute();

    return data!;
  },
);

export const fetchVotesAction = createServerAction<string, CallGetVotesResponseData>(
  'data/votes',
  async (quizId) => {
    const { data } = await new CallGetVotes(quizId).execute();
      
    return data!;
  },
);

export const fetchScoresAction = createServerAction<string, CallGetScoresResponseData>(
  'data/scores',
  async (quizId) => {
    const { data } = await new CallGetScores(quizId).execute();
      
    return data!;
  },
);



export const fetchInitialDataAction = createServerAction<void, void>(
  'data/fetch-initial',
  async (_, { dispatch }) => {
    const result = await Promise.all([
      dispatch(pingAction()),
      dispatch(updateVersionAction()),
      dispatch(fetchQuizNamesAction()),
    ]);

    const someFetchActionFailed = result
      .map(({ type }) => type)
      .some(type => type.endsWith('/rejected'));

    if (someFetchActionFailed) {
      AppStore.reset();
      
      throw new Error('FETCH_INITIAL_DATA_ACTION');
    }
  },
);



type FetchAllDataActionArgs = { quizId: string, quizName: QuizName, language: Language };
export const fetchAllDataAction = createServerAction<FetchAllDataActionArgs, void>(
  'data/fetch-all',
  async ({ quizId, language }, { dispatch }) => {
    const result = await Promise.all([
      dispatch(fetchQuestionDataAction({ language, quizId })), // Must only be fetched once: questions do not change
      dispatch(fetchTeamsAction(quizId)),                      // Must only be fetched once: teams do not change

      dispatch(fetchStatusAction(quizId)),
      dispatch(fetchPlayersAction(quizId)),
      dispatch(fetchVotesAction(quizId)),
      dispatch(fetchScoresAction(quizId)),
    ]);

    const someFetchActionFailed = result
      .map(({ type }) => type)
      .some(type => type.endsWith('/rejected'));

    if (someFetchActionFailed) {
      throw new Error('FETCH_ALL_DATA_ACTION');
    }
  },
);



type RefreshDataActionArgs = { quizId: string };
export const refreshDataAction = createServerAction<RefreshDataActionArgs, void>(
  'data/refresh',
  async ({ quizId }, { dispatch }) => {
    const result = await Promise.all([
      dispatch(fetchStatusAction(quizId)),
      dispatch(fetchPlayersAction(quizId)),
      dispatch(fetchVotesAction(quizId)),
      dispatch(fetchScoresAction(quizId)),
    ]);

    const someFetchActionFailed = result
      .map(({ type }) => type)
      .some(type => type.endsWith('/rejected'));

    if (someFetchActionFailed) {
      await dispatch(logoutAction());
      
      throw new Error('REFRESH_DATA_ACTION');
    }
  },
);