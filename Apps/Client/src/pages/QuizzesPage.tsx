import React from 'react';
import './QuizzesPage.scss';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { useSelector } from '../hooks/ReduxHooks';
import { Link } from 'react-router-dom';
import { URL_PARAM_QUIZ_NAME } from '../config';

const QuizzesPage: React.FC = () => {
  const { t } = useTranslation();

  const quizzes = useSelector((state) => state.data.quizzes);

  return (
    <Page title={t('common:COMMON:QUIZZES')} className='quizzes-page'>
        <div className='quizzes-page-box'>
          <h1 className='quizzes-page-title'>{t('common:PAGES.QUIZZES.TITLE')}</h1>
          <p className='quizzes-page-text'>{t('common:PAGES.QUIZZES.TEXT')}</p>
          <ul className='quizzes-page-list'>{quizzes.map((quiz, i) => {
            const url = `/?${URL_PARAM_QUIZ_NAME}=${quiz.name}`;
            
            return (
              <li className='quizzes-page-list-item' key={`button-quiz-name-${i}`}>
                <Link to={url}>
                  <button className='quizzes-page-button'>
                    {quiz.label}
                  </button>
                </Link>
              </li>
            );
          })}</ul>
        </div>
    </Page>
  );
};

export default QuizzesPage;