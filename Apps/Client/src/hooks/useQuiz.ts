import { useCallback } from 'react';
import { useDispatch, useSelector } from './useRedux';
import { fetchStatus } from '../actions/DataActions';
import { logout } from '../actions/AuthActions';

const useQuiz = () => {
  const quiz = useSelector(({ quiz }) => quiz);
  
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const players = quiz.status.data?.players ?? [];
  const votes = quiz.votes.data;
  const scores = quiz.scores.data;

  const dispatch = useDispatch();



  const refreshStatus = useCallback(async () => {
    if (!quiz.id) return;

    const result = await dispatch(fetchStatus(quiz.id));

    if (result.type.endsWith('/rejected')) {
      dispatch(logout());
    }
  }, [quiz.id]);



  return {
    id: quiz.id,
    questionIndex: status?.questionIndex,
    name: quiz.name,
    isStarted: status?.isStarted,
    isOver: status?.isOver,
    isSupervised: status?.isSupervised,
    questions,
    status,
    players,
    votes,
    scores,
    refreshStatus,
  };
};

export default useQuiz;