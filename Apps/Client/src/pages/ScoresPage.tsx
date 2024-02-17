import React, { useEffect } from 'react';
import './ScoresPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import Scoreboard from '../components/Scoreboard';
import { fetchScores } from '../reducers/QuizReducer';
import { useDispatch, useSelector } from '../hooks/redux';

const ScoresPage: React.FC = () => {
  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const scores = quiz.scores.data;

  const dispatch = useDispatch();
  
  // Fetch scores when loading page
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchScores(quizId));
  }, [quizId]);

  if (quizId === null || scores === null) {
    return null;
  }
  
  return (
    <React.Fragment>
      <HamburgerMenu />
      <Scoreboard scores={scores} />
    </React.Fragment>
  );
};

export default ScoresPage;