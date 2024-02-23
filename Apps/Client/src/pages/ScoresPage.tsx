import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../components/Scoreboard';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchScores } from '../actions/QuizActions';
import { Navigate } from 'react-router-dom';

const ScoresPage: React.FC = () => {
  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const status = quiz.status.data;
  const scores = quiz.scores.data;

  const questionIndex = status?.questionIndex;
  const isOver = status?.isOver;
  
  // Fetch scores when loading page or when moving on to next question
  // or when quiz is over
  useEffect(() => {
    if (quizId === null || status === null) {
      return;
    }

    dispatch(fetchScores(quizId));
  }, [questionIndex, isOver]);

  if (quizId === null || status === null || scores === null) {
    return null;
  }

  const hasStarted = status.hasStarted;

  if (!hasStarted) {
    return <Navigate to='/quiz' />;
  }
  
  return (
    <Scoreboard scores={scores} />
  );
};

export default ScoresPage;