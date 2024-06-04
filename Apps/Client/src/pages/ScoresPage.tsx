import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../components/Scoreboard';
import { useDispatch } from '../hooks/ReduxHooks';
import { fetchScoresAction } from '../actions/DataActions';
import { Navigate } from 'react-router-dom';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { useTranslation } from 'react-i18next';
import useQuiz from '../hooks/useQuiz';

const ScoresPage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useQuiz();

  const questionIndex = quiz.questionIndex;
  const isOver = quiz.isOver;
  
  // Fetch scores when loading page or when moving on to next question
  // or when quiz is over
  useEffect(() => {
    if (quiz.id === null || quiz.status === null) {
      return;
    }

    dispatch(fetchScoresAction(quiz.id));
    dispatch(closeAllOverlays());
  }, [questionIndex, isOver]);



  if (quiz.id === null || quiz.status === null || !quiz.scores) {
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