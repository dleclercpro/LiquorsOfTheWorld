import { CallGetQuizNames } from '../calls/data/CallGetQuizNames';
import { CallGetPlayers } from '../calls/quiz/CallGetPlayers';
import { CallGetQuestions } from '../calls/quiz/CallGetQuestions';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { Language, QuizName } from '../constants';
import { CallGetPlayersResponseData, CallGetQuestionsResponseData, CallGetQuizNamesResponseData, CallGetScoresResponseData, CallGetStatusResponseData, CallGetVotesResponseData } from '../types/DataTypes';
import { createServerAction } from './ServerActions';

export const fetchQuizNamesAction = createServerAction<void, CallGetQuizNamesResponseData>(
  'data/quiz-names',
  async () => {
    const { data } = await new CallGetQuizNames().execute();
      
    return data!;
  },
);

type FetchQuestionsActionArgs = { language: Language, quizName: QuizName };
export const fetchQuestionsAction = createServerAction<FetchQuestionsActionArgs, CallGetQuestionsResponseData>(
  'data/questions',
  async ({ language, quizName }) => {
    const { data } = await new CallGetQuestions(language, quizName).execute();
      
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



type FetchAllDataActionArgs = { quizId: string, quizName: QuizName, language: Language };
export const fetchAllDataAction = createServerAction<FetchAllDataActionArgs, void>(
  'data/fetch-all',
  async ({ quizId, quizName, language }, { dispatch }) => {
    const result = await Promise.all([
      dispatch(fetchQuestionsAction({ language, quizName })), // Must only be fetched once: questions do not change
      dispatch(fetchVotesAction(quizId)), // Must only be fetched on login: is then updated every time user votes

      dispatch(fetchStatusAction(quizId)),
      dispatch(fetchPlayersAction(quizId)),
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
      await dispatch(fetchStatusAction(quizId)),
      await dispatch(fetchPlayersAction(quizId)),
      await dispatch(fetchScoresAction(quizId)),
    ]);

    const someFetchActionFailed = result
      .map(({ type }) => type)
      .some(type => type.endsWith('/rejected'));

    if (someFetchActionFailed) {
      throw new Error('REFRESH_DATA_ACTION');
    }
  },
);