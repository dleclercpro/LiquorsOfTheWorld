import { useDispatch, useSelector } from './ReduxHooks';
import { selectAnswer, selectCorrectAnswer } from '../selectors/QuizSelectors';
import useOverlay from './useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import { setQuestionIndex } from '../reducers/AppReducer';
import useQuiz from './useQuiz';
import { startQuestion } from '../actions/QuizActions';
import useUser from './useUser';

const useQuestion = (index: number) => {
  const dispatch = useDispatch();

  const quiz = useQuiz();
  const user = useUser();

  const answerOverlay = useOverlay(OverlayName.Answer);

  const answer = useSelector((state) => selectAnswer(state, index));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, index));

  const isNextQuestionReady = quiz.questionIndex ? index < quiz.questionIndex : false;
  const mustWaitForNextQuestion = !user.isAdmin && !isNextQuestionReady;



  const goToNextQuestion = () => {
    answerOverlay.close();

    dispatch(setQuestionIndex(index + 1));
  }



  const startAndGoToNextQuestion = () => {
    answerOverlay.close();

    dispatch(startQuestion({
      quizId: quiz.id as string,
      questionIndex: index + 1,
    }));
  }



  return {
    index,
    answer: {
      chosen: answer,
      correct: correctAnswer,
      isCorrect: answer === correctAnswer,
    },
    next: {
      index: index + 1,
      isReady: isNextQuestionReady,
      mustWaitFor: mustWaitForNextQuestion,
      goTo: goToNextQuestion,
      startAndGoTo: startAndGoToNextQuestion,
    },
  };
};

export default useQuestion;