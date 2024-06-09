import { useDispatch, useSelector } from './ReduxHooks';
import useOverlay from './useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import { setQuestionIndex } from '../reducers/AppReducer';
import useQuiz from './useQuiz';
import { startQuestionAction } from '../actions/QuizActions';
import useApp from './useApp';
import useUser from './useUser';
import { selectChosenAnswer, selectCorrectAnswer, selectHaveAllPlayersAnswered, selectVoteCount } from '../selectors';



const useQuestion = (index: number) => {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();

  const voteCount = useSelector((state) => selectVoteCount(state, index));

  const haveAllPlayersAnswered = useSelector((state) => selectHaveAllPlayersAnswered(state, index));

  const nextQuestionIndex = index + 1;
  const isNextQuestionReady = app.questionIndex < quiz.questionIndex;
  const mustWaitForNextQuestion = !quiz.isOver && !user.isAdmin && !isNextQuestionReady;

  const answerOverlay = useOverlay(OverlayName.Answer);

  const chosenAnswer = useSelector((state) => selectChosenAnswer(state, index));
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
    voteCount,
    haveAllPlayersAnswered,
    answer: {
      chosen: chosenAnswer,
      correct: correctAnswer,
      isCorrect: chosenAnswer !== null && correctAnswer !== null && chosenAnswer.index === correctAnswer.index,
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