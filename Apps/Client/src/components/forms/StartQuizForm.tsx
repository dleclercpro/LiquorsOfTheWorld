import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import './StartQuizForm.scss';
import { start } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
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

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const result = await dispatch(start({ quizId, isSupervised }));

    if (result.type.endsWith('/rejected')) {
      alert(`Could not start quiz!`);
      return;
    }
  }

  return (
    <form className='start-quiz-form' onSubmit={handleSubmit}>
      <h2 className='start-quiz-form-title'>{t('FORMS.START_QUIZ.TITLE')}</h2>

      <p className='start-quiz-form-text'>
        {t(players.length === 1 ? 'FORMS.START_QUIZ.SINGLE_PLAYER_WAITING' : 'FORMS.START_QUIZ.MANY_PLAYERS_WAITING', { count: players.length })}
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

      <button type='submit'>{t('FORMS.START_QUIZ.SUBMIT')}</button>
    </form>
  );
};

export default StartQuizForm;