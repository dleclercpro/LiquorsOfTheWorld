import { CallGetQuizNames } from '../calls/data/CallGetQuizNames';
import { CallGetQuestions } from '../calls/quiz/CallGetQuestions';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { Language, QuizName } from '../constants';
import { RootState } from '../stores/store';
import { StatusData, GroupedScoreData } from '../types/DataTypes';
import { QuizJSON } from '../types/JSONTypes';
import { ThunkAPI, createServerAction } from './ServerActions';

export const fetchQuizNames = createServerAction<void, string[]>(
  'data/fetchQuizNames',
  async () => {
    const { data } = await new CallGetQuizNames().execute();
      
    return data as string[];
  },
);

type FetchQuestionsActionArgs = { lang: Language, quizName: QuizName };
export const fetchQuestions = createServerAction<FetchQuestionsActionArgs, QuizJSON>(
  'data/fetchQuestions',
  async ({ lang, quizName }: FetchQuestionsActionArgs) => {
    const { data } = await new CallGetQuestions(lang, quizName).execute();
      
    return data as QuizJSON;
  },
);

export const fetchStatus = createServerAction<string, StatusData>(
  'data/fetchStatus',
  async (quizId: string) => {
    const { data } = await new CallGetStatus(quizId).execute();
      
    return data as StatusData;
  },
);

export const fetchVotes = createServerAction<string, number[]>(
  'data/fetchVotes',
  async (quizId: string) => {
    const { data } = await new CallGetVotes(quizId).execute();
      
    return data as number[];
  },
);

export const fetchScores = createServerAction<string, GroupedScoreData>(
  'data/fetchScores',
  async (quizId: string) => {
    const { data } = await new CallGetScores(quizId).execute();
      
    return data as GroupedScoreData;
  },
);



type FetchQuizDataActionArgs = { quizId: string, quizName: QuizName, lang: Language };
export const fetchQuizData = createServerAction<FetchQuizDataActionArgs, number>(
  'data/fetchQuizData',
  async ({ quizId, quizName, lang }: FetchQuizDataActionArgs, { dispatch, getState }: ThunkAPI) => {
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
  },
);