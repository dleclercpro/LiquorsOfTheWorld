import { NO_QUESTION_INDEX } from '../reducers/AppReducer';
import useQuiz from './useQuiz';

const useVote = (questionIndex: number) => {
  const quiz = useQuiz();

  if (!quiz.questions || quiz.votes.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return {
      index: null,
      value: null,
    };
  }

  const question = quiz.questions[questionIndex];
  const voteIndex = quiz.votes[questionIndex];
  const voteValue = question.options[voteIndex];

  return {
    index: voteIndex,
    value: voteValue,
  };
};

export default useVote;