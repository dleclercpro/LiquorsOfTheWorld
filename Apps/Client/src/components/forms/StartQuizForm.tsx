import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import './StartQuizForm.scss';
import { deleteQuiz, startQuiz } from '../../actions/QuizActions';
import { Trans, useTranslation } from 'react-i18next';
import { selectPlayers } from '../../reducers/QuizReducer';

const StartQuizForm: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [isSupervised, setIsSupervised] = useState(false);

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const players = useSelector(selectPlayers);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsSupervised(!isSupervised);
  }

  const handleStart: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const result = await dispatch(startQuiz({ quizId, isSupervised }));

    if (result.type.endsWith('/rejected')) {
      alert(`Could not start quiz!`);
      return;
    }
  }

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const result = await dispatch(deleteQuiz(quizId));

    if (result.type.endsWith('/rejected')) {
      alert(`Could not delete quiz!`);
      return;
    }
  }

  return (
    <form className='start-quiz-form'>
      <h2 className='start-quiz-form-title'>{t('FORMS.START_QUIZ.TITLE')}</h2>

      <p className='start-quiz-form-text'>
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
          id='option'
          name='option'
          checked={isSupervised}
          onChange={handleChange}
        />
        <label htmlFor='option'>{t('FORMS.START_QUIZ.SUPERVISE')}</label>
      </div>

      <p className='start-quiz-form-text'>{t('FORMS.START_QUIZ.TEXT')}</p>

      <button className='start-quiz-form-button' onClick={handleStart}>{t('FORMS.START_QUIZ.START_QUIZ')}</button>
      <button className='start-quiz-form-button' onClick={handleDelete}>{t('FORMS.START_QUIZ.DELETE_QUIZ')}</button>
    </form>
  );
};

export default StartQuizForm;