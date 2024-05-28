import { useCallback } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchQuestions, fetchStatus } from '../actions/DataActions';
import { startQuiz as doStartQuiz } from '../actions/QuizActions';
import { deleteQuiz as doDeleteQuiz } from '../actions/QuizActions';
import useUser from './useUser';
import { Language } from '../constants';
import { useTranslation } from 'react-i18next';

const useQuiz = () => {
  const { i18n } = useTranslation();

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



  const refreshQuestions = useCallback(async () => {
    if (!quiz.name) return;
    
    const result = await dispatch(fetchQuestions({ lang: i18n.language as Language, quizName: quiz.name }));

    if (result.type.endsWith('/rejected')) {
      await user.logout();
    }
  }, [quiz.name]);



  const refreshStatus = useCallback(async () => {
    if (!quiz.id) return;

    const result = await dispatch(fetchStatus(quiz.id));

    if (result.type.endsWith('/rejected')) {
      await user.logout();
    }
  }, [quiz.id]);



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
    refreshQuestions,
    refreshStatus,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;