import { useDispatch, useSelector } from './ReduxHooks';
import useOverlay from './useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import { setQuestionIndex } from '../reducers/AppReducer';
import useQuiz from './useQuiz';
import { startQuestionAction } from '../actions/QuizActions';
import useApp from './useApp';
import useUser from './useUser';
import { selectChosenAnswer, selectCorrectAnswer, selectHaveAllPlayersAnswered, selectVoteCounts } from '../selectors';



const useQuestion = (index: number) => {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();

  const voteCount = useSelector((state) => selectVoteCounts(state, index));

  const haveAllPlayersAnswered = useSelector((state) => selectHaveAllPlayersAnswered(state, index, true));

  const nextQuestionIndex = index + 1;
  const isNextQuestionReady = app.questionIndex < quiz.questionIndex;
  const mustWaitForNextQuestion = !quiz.isOver && !user.isAdmin && !isNextQuestionReady;

  const answerOverlay = useOverlay(OverlayName.Answer);

  const chosenAnswer = useSelector((state) => selectChosenAnswer(state, index));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, index));

  const hasChosenAnswer = chosenAnswer !== null;
  const hasCorrectAnswer = correctAnswer !== null;

  const data = quiz.questions !== null ? quiz.questions[index] : null



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
    data,
    voteCount,
    haveAllPlayersAnswered,
    answer: {
      chosen: chosenAnswer,
      correct: correctAnswer,
      isCorrect: hasChosenAnswer && hasCorrectAnswer && (chosenAnswer.index === correctAnswer.index),
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