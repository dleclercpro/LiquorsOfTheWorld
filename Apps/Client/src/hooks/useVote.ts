import { useSelector } from './ReduxHooks';

const useVote = (questionIndex: number) => {
  const quiz = useSelector((state) => state.quiz);

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (!questions || !votes) {
    return {
      index: null,
      value: null,
    };
  }

  const question = questions[questionIndex];
  const voteIndex = votes[questionIndex];
  const voteValue = question.options[voteIndex];

  return {
    index: voteIndex,
    value: voteValue,
  };
};

export default useVote;