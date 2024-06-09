import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../components/Scoreboard';
import { useDispatch } from '../hooks/ReduxHooks';
import { Navigate } from 'react-router-dom';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { useTranslation } from 'react-i18next';
import useQuiz from '../hooks/useQuiz';
import { REFRESH_STATUS_INTERVAL } from '../config';

const ScoresPage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useQuiz();
  


  // Ensure there are user scores
  const isReady = Object.keys(quiz.scores.users).length > 0;



  // Regularly fetch current quiz status from server
  useEffect(() => {
    dispatch(closeAllOverlays());

    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  if (!isReady) {
    return null;
  }

  if (!quiz.isStarted) {
    return (
      <Navigate to='/quiz' />
    );
  }
  
  return (
    <Page title={t('common:COMMON:SCOREBOARD')} className='scores-page'>
      <Scoreboard scores={quiz.scores} />
    </Page>
  );
};

export default ScoresPage;