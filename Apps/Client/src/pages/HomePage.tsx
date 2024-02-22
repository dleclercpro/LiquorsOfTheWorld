import React from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useSelector } from '../hooks/redux';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { quizId } = useParams();
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <div className='home-page-page'>
      {!isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t('HOME_PAGE_TITLE')}</h1>
          <p className='home-page-text'>Welcome to tonight's quiz!</p>
          <p className='home-page-text'>Get ready to showcase your mastery of the world's spirits in an epic quiz, where only the savviest liquor aficionados will manage to claim victory...</p>
          <p className='home-page-text'>Are you ready?</p>
          
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