import { NO_QUESTION_INDEX, NO_VOTE_INDEX } from '../constants';
import useQuiz from './useQuiz';
import useUser from './useUser';

const useVote = (questionIndex: number) => {
  const quiz = useQuiz();
  const user = useUser();

  const users = Object.keys(quiz.votes.users);
  const admins = Object.keys(quiz.votes.admins);

  if (user.username === null || quiz.questions === null || users.length === 0 || admins.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return {
      index: null,
      value: null,
    };
  }

  const question = quiz.questions[questionIndex];
  const voteIndex = user.isAdmin ? quiz.votes.admins[user.username][questionIndex] : quiz.votes.users[user.username][questionIndex];

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