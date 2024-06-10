import { NO_QUESTION_INDEX, NO_VOTE_INDEX, UserType } from '../constants';
import useQuiz from './useQuiz';
import useUser from './useUser';

const useVote = (questionIndex: number) => {
  const quiz = useQuiz();
  const user = useUser();

  const regularUserVotes = Object.keys(quiz.votes[UserType.Regular]);
  const adminUserVotes = Object.keys(quiz.votes[UserType.Admin]);

  if (user.username === null || quiz.questions === null || regularUserVotes.length === 0 || adminUserVotes.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return {
      index: null,
      value: null,
    };
  }

  const question = quiz.questions[questionIndex];
  const voteIndex = quiz.votes[user.isAdmin ? UserType.Admin : UserType.Regular][user.username][questionIndex];

  // User hasn't voted on that question yet
  if (voteIndex === NO_VOTE_INDEX) {
    return {
      index: null,
      value: null,
    };
  }
  
  // Get string value that matches this vote
  const voteValue = question.options[voteIndex];

  return {
    index: voteIndex,
    value: voteValue,
  };
};

export default useVote;