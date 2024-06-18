import React, { useEffect } from 'react';
import './HomePage.scss';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../Page';
import { PageUrl, QuizName } from '../../../constants';
import useUser from '../../../hooks/useUser';
import { DEBUG, DEFAULT_QUIZ_ID, DEFAULT_QUIZ_NAME, DEFAULT_TEAM_ID, URL_PARAM_HIDE, URL_PARAM_QUIZ_ID, URL_PARAM_QUIZ_NAME, URL_PARAM_TEAM_ID } from '../../../config';
import useQuiz from '../../../hooks/useQuiz';
import useData from '../../../hooks/useData';
import { setQuizName } from '../../../reducers/QuizReducer';
import { useDispatch } from '../../../hooks/ReduxHooks';
import LoginForm from '../../forms/LoginForm/LoginForm';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { t } = useTranslation();

  const user = useUser();
  const data = useData();
  const quiz = useQuiz();

  const paramQuizName = searchParams.get(URL_PARAM_QUIZ_NAME);
  const paramQuizId = searchParams.get(URL_PARAM_QUIZ_ID);
  const paramTeamId = searchParams.get(URL_PARAM_TEAM_ID);

  const quizName = (paramQuizName ?? quiz.name) ?? DEFAULT_QUIZ_NAME;
  const quizId = (paramQuizId ?? quiz.id) ?? (DEBUG ? DEFAULT_QUIZ_ID : '');
  const teamId = (paramTeamId ?? user.teamId) ?? (DEBUG ? DEFAULT_TEAM_ID : '');

  const isQuizNameValid = data.quizzes.map((q) => q.name)
    .includes(quizName as QuizName);



  // Set quiz name if available
  useEffect(() => {
    if (isQuizNameValid) {
      dispatch(setQuizName(quizName as QuizName));
    }
    else if (quizName === null) {
      navigate(PageUrl.Error);
    }
  }, [isQuizNameValid]);



  if (user.isAuthenticated) {
    return (
      <Navigate to={PageUrl.Quiz} />
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
          
          <LoginForm
            quizId={quizId} hideQuizId={URL_PARAM_HIDE && !!paramQuizId}
            teamId={teamId} hideTeamId={URL_PARAM_HIDE && !!paramTeamId}
          />
        </div>
      )}
    </Page>
  );
};

export default HomePage;