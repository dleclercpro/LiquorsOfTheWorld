import { CallGetQuizNames } from '../calls/data/CallGetQuizNames';
import { CallGetPlayers } from '../calls/quiz/CallGetPlayers';
import { CallGetQuestions } from '../calls/quiz/CallGetQuestions';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { Language, QuizName } from '../constants';
import { RootState } from '../stores/store';
import { CallGetPlayersResponseData, CallGetQuestionsResponseData, CallGetQuizNamesResponseData, CallGetScoresResponseData, CallGetStatusResponseData, CallGetVotesResponseData, StatusData } from '../types/DataTypes';
import { ThunkAPI, createServerAction } from './ServerActions';

export const fetchQuizNames = createServerAction<void, CallGetQuizNamesResponseData>(
  'data/quiz-names',
  async () => {
    const { data } = await new CallGetQuizNames().execute();
      
    return data!;
  },
);

type FetchQuestionsActionArgs = { lang: Language, quizName: QuizName };
export const fetchQuestions = createServerAction<FetchQuestionsActionArgs, CallGetQuestionsResponseData>(
  'data/questions',
  async ({ lang, quizName }: FetchQuestionsActionArgs) => {
    const { data } = await new CallGetQuestions(lang, quizName).execute();
      
    return data!;
  },
);

export const fetchStatus = createServerAction<string, CallGetStatusResponseData>(
  'data/status',
  async (quizId: string) => {
    const { data } = await new CallGetStatus(quizId).execute();
      
    return data!;
  },
);

export const fetchPlayers = createServerAction<string, CallGetPlayersResponseData>(
  'data/players',
  async (quizId: string) => {
    const { data } = await new CallGetPlayers(quizId).execute();
      
    return data!;
  },
);

export const fetchVotes = createServerAction<string, CallGetVotesResponseData>(
  'data/votes',
  async (quizId: string) => {
    const { data } = await new CallGetVotes(quizId).execute();
      
    return data!;
  },
);

export const fetchScores = createServerAction<string, CallGetScoresResponseData>(
  'data/scores',
  async (quizId: string) => {
    const { data } = await new CallGetScores(quizId).execute();
      
    return data!;
  },
);



type FetchQuizDataActionArgs = { quizId: string, quizName: QuizName, lang: Language };
export const fetchQuizData = createServerAction<FetchQuizDataActionArgs, number>(
  'data/quiz',
  async ({ quizId, quizName, lang }: FetchQuizDataActionArgs, { dispatch, getState }: ThunkAPI) => {
    const result = await Promise.all([
      dispatch(fetchQuestions({ lang, quizName })),
      dispatch(fetchPlayers(quizId)),
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
  },
);