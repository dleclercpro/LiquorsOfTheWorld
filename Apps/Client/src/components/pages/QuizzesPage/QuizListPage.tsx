import React from 'react';
import './QuizListPage.scss';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from '../../../hooks/ReduxHooks';
import { URL_PARAM_QUIZ_NAME } from '../../../config';
import Page from '../Page';

const QuizListPage: React.FC = () => {
  const { t } = useTranslation();

  const quizzes = useSelector((state) => state.data.quizzes);

  return (
    <Page title={t('common:COMMON:QUIZ_LIST')} className='quiz-list-page'>
        <div className='quiz-list-page-box'>
          <h1 className='quiz-list-page-title'>
            {t('common:PAGES.QUIZ_LIST.TITLE')}
          </h1>
          <p className='quiz-list-page-text'>
            {t('common:PAGES.QUIZ_LIST.TEXT')}
          </p>
          <ul className='quiz-list-page-list'>{quizzes.map((quiz, i) => {
            const url = `/?${URL_PARAM_QUIZ_NAME}=${quiz.name}`;
            
            return (
              <li className='quiz-list-page-list-item' key={`button-quiz-name-${i}`}>
                <Link to={url}>
                  <button className='quiz-list-page-button'>
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

export default QuizListPage;