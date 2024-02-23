import React from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useSelector } from '../hooks/redux';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NavMenu from '../components/Nav';

const HomePage: React.FC = () => {
  const { quizId } = useParams();
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <div className='home-page'>
      <NavMenu />

      {!isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t('PAGES.HOME.TITLE')}</h1>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_HEAD')}</p>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_TEXT')}</p>
          <p className='home-page-text'>{t('PAGES.HOME.WELCOME_CTA')}</p>
          
          <LoginForm quizId={quizId} />
        </div>
      )}
      {isAuthenticated && (
        <Navigate to='/quiz' />
      )}
    </div>
  );
};

export default HomePage;