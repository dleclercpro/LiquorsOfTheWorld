import { CallStartQuiz } from '../calls/quiz/CallStartQuiz';
import { CallStartQuestion } from '../calls/quiz/CallStartQuestion';
import { CallDeleteQuiz } from '../calls/quiz/CallDeleteQuiz';
import { logoutAction } from './UserActions';
import { ThunkAPI, createServerAction } from './ServerActions';
import { CallVote } from '../calls/quiz/CallVote';
import { CallVoteResponseData } from '../types/DataTypes';
import { Language } from '../constants';



type StartQuizActionArgs = { quizId: string, language: Language, isSupervised: boolean, isTimed: boolean, isNextQuestionForced: boolean };
export const startQuizAction = createServerAction<StartQuizActionArgs, void>(
  'quiz/start',
  async ({ quizId, language, isSupervised, isTimed, isNextQuestionForced }: StartQuizActionArgs) => {
    await new CallStartQuiz(quizId).execute({ language, isSupervised, isTimed, isNextQuestionForced });

    return;
  },
);

export const deleteQuizAction = createServerAction<string, void>(
  'quiz/delete',
  async (quizId: string, { dispatch }: ThunkAPI) => {
    await new CallDeleteQuiz(quizId).execute();

    dispatch(logoutAction());

    return;
  },
);

type VoteActionArgs = { quizId: string, questionIndex: number, vote: number };
export const voteAction = createServerAction<VoteActionArgs, CallVoteResponseData>(
  'quiz/vote',
  async ({ quizId, questionIndex, vote }: VoteActionArgs) => {
    try {
      const { data } = await new CallVote(quizId, questionIndex).execute({
        vote,
      });

      return data!;

    } catch (err: any) {
      alert(`Could not vote!`);

      throw err;
    }
  },
);

type StartQuestionActionArgs = { quizId: string, questionIndex: number };
export const startQuestionAction = createServerAction<StartQuestionActionArgs, number>(
  'quiz/question/start',
  async ({ quizId, questionIndex }: StartQuestionActionArgs) => {
    await new CallStartQuestion(quizId, questionIndex).execute();

    return questionIndex;
  },
);