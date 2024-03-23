import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../components/Scoreboard';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchScores } from '../actions/DataActions';
import { Navigate } from 'react-router-dom';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { useTranslation } from 'react-i18next';

const ScoresPage: React.FC = () => {
  const { t } = useTranslation();

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
    dispatch(closeAllOverlays());
  }, [questionIndex, isOver]);

  if (quizId === null || status === null || scores === null) {
    return null;
  }

  const isStarted = status.isStarted;

  if (!isStarted) {
    return (
      <Navigate to='/quiz' />
    );
  }
  
  return (
    <Page title={t('common:COMMON:SCOREBOARD')} className='scores-page'>
      <Scoreboard scores={scores.users} />
    </Page>
  );
};

export default ScoresPage;