import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import './AdminQuizForm.scss';
import { deleteQuiz, startQuiz } from '../../actions/QuizActions';
import { Trans, useTranslation } from 'react-i18next';
import { selectPlayers } from '../../selectors/QuizSelectors';

const AdminQuizForm: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [isSupervised, setIsSupervised] = useState(false);
  const [isTimed, setIsTimed] = useState(false);

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const players = useSelector(selectPlayers);

  const handleSuperviseCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsSupervised(!isSupervised);
  }

  const handleTimerCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsTimed(!isTimed);
  }

  const handleStartQuiz: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    await dispatch(startQuiz({ quizId, isSupervised, isTimed }));
  }

  const handleDeleteQuiz: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    await dispatch(deleteQuiz(quizId));
  }

  return (
    <form className='admin-quiz-form'>
      <h2 className='admin-quiz-form-title'>{t('common:FORMS.START_QUIZ.TITLE')}</h2>

      <p className='admin-quiz-form-text'>
        <Trans
          i18nKey={players.length === 1 ? 'FORMS.START_QUIZ.SINGLE_PLAYER_WAITING' : 'FORMS.START_QUIZ.MANY_PLAYERS_WAITING'}
          values={{ count: players.length }}
        >
          ... <strong>...</strong> ...
        </Trans>
      </p>
      
      <div className='checkbox'>
        <input
          type='checkbox'
          id='option-supervise'
          name='option-supervise'
          checked={isSupervised}
          onChange={handleSuperviseCheckboxChange}
        />
        <label htmlFor='option-supervise'>{t('common:FORMS.START_QUIZ.SUPERVISE')}</label>

        <input
          type='checkbox'
          id='option-timer'
          name='option-timer'
          checked={isTimed}
          onChange={handleTimerCheckboxChange}
        />
        <label htmlFor='option-timer'>{t('common:FORMS.START_QUIZ.TIMER')}</label>
      </div>

      <p className='admin-quiz-form-text'>{t('common:FORMS.START_QUIZ.TEXT')}</p>

      <button className='admin-quiz-form-button' onClick={handleStartQuiz}>
        {t('common:FORMS.START_QUIZ.START_QUIZ')}
      </button>
      
      <button className='admin-quiz-form-button' onClick={handleDeleteQuiz}>
        {t('common:FORMS.START_QUIZ.DELETE_QUIZ')}
      </button>
    </form>
  );
};

export default AdminQuizForm;