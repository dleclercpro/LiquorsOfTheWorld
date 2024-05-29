import { useCallback } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchQuestions, fetchQuizData, fetchStatus } from '../actions/DataActions';
import { startQuiz as doStartQuiz } from '../actions/QuizActions';
import { deleteQuiz as doDeleteQuiz } from '../actions/QuizActions';
import useUser from './useUser';
import { Language, NON_VOTE } from '../constants';
import { useTranslation } from 'react-i18next';
import { setQuestionIndex } from '../reducers/AppReducer';
import { toReversedArray } from '../utils/array';

const useQuiz = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as Language;

  const user = useUser();
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

  const dispatch = useDispatch();



  const fetchData = useCallback(async () => {
    if (quiz.id === null || !quiz.name) return;

    await dispatch(fetchQuizData({ quizId: quiz.id, quizName: quiz.name, lang }));

    const questionIndex = status?.questionIndex ?? 0;

    let lastUnansweredQuestionIndex = toReversedArray(votes).findIndex((vote: number) => vote === NON_VOTE);

    if (lastUnansweredQuestionIndex === -1) {
      lastUnansweredQuestionIndex = 0;
    }
    
    let appQuestionIndex = questionIndex;
    if (!isSupervised && lastUnansweredQuestionIndex < questionIndex) {
      appQuestionIndex = lastUnansweredQuestionIndex;
    }

    dispatch(setQuestionIndex(appQuestionIndex));

  }, [quiz.id, quiz.name, lang]);



  const refreshQuestions = useCallback(async () => {
    if (!quiz.name) return;
    
    await dispatch(fetchQuestions({ quizName: quiz.name, lang }));
  }, [quiz.name, lang, user]);



  const refreshStatus = useCallback(async () => {
    if (!quiz.id) return;

    await dispatch(fetchStatus(quiz.id));
  }, [quiz.id, user]);



  const startQuiz = useCallback(async (isSupervised: boolean, isTimed: boolean) => {
    if (quiz.id === null) return;

    return await dispatch(doStartQuiz({ quizId: quiz.id, isSupervised, isTimed }));
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
    questions,
    status,
    players,
    votes,
    scores,
    fetchData,
    refreshQuestions,
    refreshStatus,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;