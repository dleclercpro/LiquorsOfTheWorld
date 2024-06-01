import React, { useEffect } from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useDispatch } from '../hooks/ReduxHooks';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { QuizName } from '../constants';
import { setQuizName } from '../reducers/QuizReducer';
import useUser from '../hooks/useUser';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useUser();

  const quizName = QuizName.KonnyUndJohannes;
  const quizId = '60';
  const teamId = '';



  // Store quiz name in app state when valid
  useEffect(() => {
    dispatch(setQuizName(quizName));

  }, [quizName]);



  if (user.isAuthenticated) {
    return (
      <Navigate to='/quiz' />
    );
  }

  return (
    <Page title={t('common:COMMON:HOMEPAGE')} className='home-page'>
      {!user.isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t(`${quizName}:TITLE`)}</h1>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_HEAD`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_TEXT`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_CTA`)}</p>
          
          <LoginForm quizId={quizId} teamId={teamId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;