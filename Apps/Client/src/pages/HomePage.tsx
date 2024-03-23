import React, { useEffect } from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { QuizName } from '../constants';
import { setName } from '../reducers/QuizReducer';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const data = useSelector(({ data }) => data);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const paramQuizId = searchParams.get('id');
  const paramQuizName = searchParams.get('quiz');

  const quizId = paramQuizId;
  const quizName = quiz.name || paramQuizName as QuizName;
  const isQuizNameValid = data.quizzes.includes(paramQuizName ?? '');

  useEffect(() => {
    if (isQuizNameValid) {
      dispatch(setName(quizName));
    }
  }, [isQuizNameValid]);

  if (!isQuizNameValid) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate to='/quiz' />
    );
  }

  return (
    <Page title={t('common:COMMON:HOME')} className='home-page'>
      {!isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t(`${quizName}:TITLE`)}</h1>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_HEAD`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_TEXT`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_CTA`)}</p>
          
          <LoginForm quizId={quizId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;