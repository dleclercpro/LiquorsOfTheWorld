import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../components/Scoreboard';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchScores } from '../actions/QuizActions';
import { Navigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { hideAllOverlays } from '../reducers/OverlaysReducer';

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
    dispatch(hideAllOverlays());
  }, [questionIndex, isOver]);

  if (quizId === null || status === null || scores === null) {
    return null;
  }

  const isStarted = status.isStarted;
  if (!isStarted) {
    return <Navigate to='/quiz' />;
  }
  
  return (
    <div className='scores-page'>
      <Nav />
      <Scoreboard scores={scores} />
    </div>
  );
};

export default ScoresPage;