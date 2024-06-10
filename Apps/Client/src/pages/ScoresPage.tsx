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
import { UserType } from '../constants';
import useUser from '../hooks/useUser';

const ScoresPage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useQuiz();
  const user = useUser();

  const regularUserScores = quiz.scores[UserType.Regular];
  const adminUserScores = quiz.scores[UserType.Admin];

  const hasEitherRegularOrAdminScores = Object.keys(regularUserScores).length > 0 || Object.keys(adminUserScores).length > 0;

  // Ensure there are user scores
  const isReady = hasEitherRegularOrAdminScores;



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
      <Scoreboard scores={quiz.scores} ignoreAdmins={!user.isAdmin} />
    </Page>
  );
};

export default ScoresPage;