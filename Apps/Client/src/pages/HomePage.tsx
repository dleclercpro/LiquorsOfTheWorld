import React from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useSelector } from '../hooks/redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';

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
    <Page className='home-page'>
      {!isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t('PAGES.HOME.TITLE')}</h1>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_HEAD')}</p>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_TEXT')}</p>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_CTA')}</p>
          
          <LoginForm quizId={quizId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;