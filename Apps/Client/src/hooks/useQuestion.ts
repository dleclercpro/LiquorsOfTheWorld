import { useDispatch, useSelector } from './ReduxHooks';
import { selectAnswer, selectCorrectAnswer } from '../selectors/QuizSelectors';
import useOverlay from './useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import { setQuestionIndex } from '../reducers/AppReducer';
import useQuiz from './useQuiz';
import { startQuestionAction } from '../actions/QuizActions';
import useApp from './useApp';
import useUser from './useUser';

const useQuestion = (index: number) => {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();

  const nextQuestionIndex = index + 1;
  const isNextQuestionReady = app.questionIndex < quiz.questionIndex;
  const mustWaitForNextQuestion = !quiz.isOver && !user.isAdmin && !isNextQuestionReady;

  const answerOverlay = useOverlay(OverlayName.Answer);

  const answer = useSelector((state) => selectAnswer(state, index));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, index));



  const goToNextQuestion = () => {
    answerOverlay.close();

    dispatch(setQuestionIndex(nextQuestionIndex));
  }



  const startAndGoToNextQuestion = async () => {
    answerOverlay.close();

    await dispatch(startQuestionAction({
      quizId: quiz.id as string,
      questionIndex: nextQuestionIndex,
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
      mustWaitFor: mustWaitForNextQuestion,
      goTo: goToNextQuestion,
      startAndGoTo: startAndGoToNextQuestion,
    },
  };
};

export default useQuestion;