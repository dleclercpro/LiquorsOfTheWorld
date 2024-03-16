import React from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useSelector } from '../hooks/redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { QUIZ_NAME } from '../config';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
    navigate('/quiz');
  }

  const quizId = searchParams.get('id');

  return (
    <Page title={t('common:COMMON:HOME')} className='home-page'>
      {!isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t(`${QUIZ_NAME}:TITLE`)}</h1>
          <p className='home-page-text'>{t(`${QUIZ_NAME}:WELCOME_HEAD`)}</p>
          <p className='home-page-text'>{t(`${QUIZ_NAME}:WELCOME_TEXT`)}</p>
          <p className='home-page-text'>{t(`${QUIZ_NAME}:WELCOME_CTA`)}</p>
          
          <LoginForm quizId={quizId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;