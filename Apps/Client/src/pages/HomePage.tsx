import React, { useEffect } from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useDispatch } from '../hooks/useRedux';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { QuizName } from '../constants';
import { setQuizName } from '../reducers/QuizReducer';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';
import useData from '../hooks/useData';

const QUIZ_ID_PARAM = 'id';
const QUIZ_NAME_PARAM = 'q';



const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const quiz = useQuiz();
  const user = useUser();

  const data = useData();

  const paramQuizId = searchParams.get(QUIZ_ID_PARAM);
  const paramQuizName = searchParams.get(QUIZ_NAME_PARAM);

  const quizId = paramQuizId;
  const quizName = paramQuizName as QuizName ?? quiz.name;
  const isQuizNameValid = data.quizzes.includes(quizName);

  // Store quiz name in app state when valid
  useEffect(() => {
    if (isQuizNameValid) {
      dispatch(setQuizName(quizName));
    }
  }, [isQuizNameValid]);

  if (!isQuizNameValid) {
    return (
      <Navigate to='/error' />
    );
  }

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
          
          <LoginForm quizId={quizId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;