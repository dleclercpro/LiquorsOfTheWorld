import { useCallback } from 'react';
import { useDispatch, useSelector } from './useRedux';
import { fetchStatus } from '../actions/DataActions';
import { startQuiz as doStartQuiz } from '../actions/QuizActions';
import { deleteQuiz as doDeleteQuiz } from '../actions/QuizActions';
import useUser from './useUser';

const useQuiz = () => {
  const user = useUser();
  const quiz = useSelector(({ quiz }) => quiz);

  const { id, name } = quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const players = quiz.status.data?.players ?? [];
  const votes = quiz.votes.data;
  const scores = quiz.scores.data;

  const questionIndex = status?.questionIndex;

  const isStarted = Boolean(status?.isStarted);
  const isOver = Boolean(status?.isOver);
  const isSupervised = Boolean(status?.isSupervised);
  const isTimed = Boolean(status?.timer.isEnabled);

  const dispatch = useDispatch();



  const refreshStatus = useCallback(async () => {
    if (!quiz.id) return;

    const result = await dispatch(fetchStatus(quiz.id));

    if (result.type.endsWith('/rejected')) {
      await user.logout();
    }
  }, [quiz.id]);



  const startQuiz = useCallback(async () => {
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
    questions,
    status,
    players,
    votes,
    scores,
    refreshStatus,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;