import useQuiz from './useQuiz';

const useVote = (questionIndex: number) => {
  const quiz = useQuiz();

  if (quiz.questions === null || quiz.votes.length === 0) {
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