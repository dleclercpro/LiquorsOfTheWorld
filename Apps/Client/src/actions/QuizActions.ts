import { CallStartQuiz } from '../calls/quiz/CallStartQuiz';
import { CallStartQuestion } from '../calls/quiz/CallStartQuestion';
import { CallDeleteQuiz } from '../calls/quiz/CallDeleteQuiz';
import { logout } from './AuthActions';
import { ThunkAPI, createServerAction } from './ServerActions';
import { CallVote } from '../calls/quiz/CallVote';
import { VotesData } from '../types/DataTypes';



type StartQuizActionArgs = { quizId: string, isSupervised: boolean };
export const startQuiz = createServerAction<StartQuizActionArgs, void>(
  'quiz/start',
  async ({ quizId, isSupervised }: StartQuizActionArgs) => {
    await new CallStartQuiz(quizId).execute({ isSupervised });
  },
);

export const deleteQuiz = createServerAction<string, void>(
  'quiz/delete',
  async (quizId: string, { dispatch }: ThunkAPI) => {
    await new CallDeleteQuiz(quizId).execute();

    dispatch(logout());
  },
);

type VoteActionArgs = { quizId: string, questionIndex: number, vote: number };
export const vote = createServerAction<VoteActionArgs, VotesData>(
  'quiz/vote',
  async ({ quizId, questionIndex, vote }: VoteActionArgs) => {
    const { data } = await new CallVote(quizId, questionIndex).execute({ vote });

    return data as VotesData;
  },
);

type StartQuestionActionArgs = { quizId: string, questionIndex: number };
export const startQuestion = createServerAction<StartQuestionActionArgs, number>(
  'question/start',
  async ({ quizId, questionIndex }: StartQuestionActionArgs) => {
    await new CallStartQuestion(quizId, questionIndex).execute();

    return questionIndex;
  },
);