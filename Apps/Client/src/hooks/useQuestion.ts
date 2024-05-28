import { useSelector } from './useRedux';
import { selectAnswer, selectCorrectAnswer } from '../selectors/QuizSelectors';

const useQuestion = (questionIndex: number) => {
  const answer = useSelector((state) => selectAnswer(state, questionIndex));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, questionIndex));

  return {
    questionIndex,
    answer: {
      value: answer,
      isCorrect: answer === correctAnswer,
    },
    correctAnswer: {
      value: correctAnswer,
    },
  };
};

export default useQuestion;