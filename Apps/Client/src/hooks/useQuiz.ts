import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchPlayersAction, fetchQuestionsAction, fetchQuizDataAction, fetchScoresAction, fetchStatusAction } from '../actions/DataActions';
import { startQuizAction as doStartQuiz } from '../actions/QuizActions';
import { deleteQuizAction as doDeleteQuiz } from '../actions/QuizActions';
import { Language, NON_VOTE } from '../constants';
import { useTranslation } from 'react-i18next';
import { setQuestionIndex } from '../reducers/AppReducer';
import { toReversedArray } from '../utils/array';

const useQuiz = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as Language;

  const app = useSelector(({ app }) => app);
  const quiz = useSelector(({ quiz }) => quiz);

  const { id, name } = quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const players = quiz.players.data ?? [];
  const votes = quiz.votes.data ?? [];
  const scores = quiz.scores.data ?? { admins: {}, users: {} };

  const questionIndex = status?.questionIndex;
  
  const isStarted = Boolean(status?.isStarted);
  const isOver = Boolean(status?.isOver);
  const isSupervised = Boolean(status?.isSupervised);
  const isTimed = Boolean(status?.timer.isEnabled);
  const isNextQuestionForced = Boolean(status?.isNextQuestionForced);

  const dispatch = useDispatch();



  // Refresh app quiz ID
  useEffect(() => {
    if (!status || votes.length === 0) return;

    const questionIndex = status.questionIndex ?? 0;

    let lastUnansweredQuestionIndex = toReversedArray(votes)
      .findIndex((vote: number) => vote === NON_VOTE);

    if (lastUnansweredQuestionIndex === -1) {
      lastUnansweredQuestionIndex = 0;
    }
    
    let appQuestionIndex = questionIndex;
    if (!isSupervised && lastUnansweredQuestionIndex < questionIndex) {
      appQuestionIndex = lastUnansweredQuestionIndex;
    }

    if (app.questionIndex !== appQuestionIndex) {
      dispatch(setQuestionIndex(appQuestionIndex));
    }
  }, [status, votes]);



  const fetchData = useCallback(async () => {
    if (quiz.id === null || !quiz.name || !lang) return;

    await dispatch(fetchQuizDataAction({ quizId: quiz.id, quizName: quiz.name, lang }));

  }, [quiz.id, quiz.name, lang]);



  const refreshQuestions = useCallback(async () => {
    if (!quiz.name) return;
    
    await dispatch(fetchQuestionsAction({ quizName: quiz.name, lang }));
  }, [quiz.name, lang]);



  const refreshStatusPlayersAndScores = useCallback(async () => {
    if (!quiz.id) return;

    await dispatch(fetchStatusAction(quiz.id));
    await dispatch(fetchPlayersAction(quiz.id));
    await dispatch(fetchScoresAction(quiz.id));
  }, [quiz.id]);



  const startQuiz = useCallback(async (isSupervised: boolean, isTimed: boolean, isNextQuestionForced: boolean) => {
    if (quiz.id === null) return;

    return await dispatch(doStartQuiz({ quizId: quiz.id, isSupervised, isTimed, isNextQuestionForced }));
  }, [quiz.id]);



  const deleteQuiz = useCallback(async () => {
    if (quiz.id === null) return;

    return await dispatch(doDeleteQuiz(quiz.id));
  }, [quiz.id]);



  return {
    id,
    name,
    questionIndex,
    isStarted,
    isOver,
    isSupervised,
    isTimed,
    isNextQuestionForced,
    questions,
    status,
    players,
    votes,
    scores,
    fetchData,
    refreshQuestions,
    refreshStatusPlayersAndScores,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;