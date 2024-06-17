import React, { useState } from 'react';
import './AdminQuizForm.scss';
import { Trans, useTranslation } from 'react-i18next';
import useQuiz from '../../../hooks/useQuiz';
import useUser from '../../../hooks/useUser';

const AdminQuizForm: React.FC = () => {
  const { t } = useTranslation();
  
  const [isSupervised, setIsSupervised] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [isNextQuestionForced, setIsNextQuestionForced] = useState(false);

  const quiz = useQuiz();
  const user = useUser();

  const regularPlayers = quiz.players.filter((player) => !player.isAdmin);



  const handleIsSupervisedCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsSupervised(!isSupervised);
  }

  const handleIsTimedCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsTimed(!isTimed);
  }

  const handleIsNextQuestionForcedCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsNextQuestionForced(!isNextQuestionForced);
  }



  const handleStartQuiz: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    
    await quiz.start(isSupervised, isTimed, isNextQuestionForced);
  }

  const handleDeleteQuiz: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await quiz.delete();
  }

  return (
    <form className='admin-quiz-form'>
      <h2 className='admin-quiz-form-title'>{t('common:FORMS.START_QUIZ.TITLE')}</h2>

      <p className='admin-quiz-form-text'>
        <Trans
          i18nKey={regularPlayers.length === 1 ? 'FORMS.START_QUIZ.SINGLE_PLAYER_WAITING' : 'FORMS.START_QUIZ.MANY_PLAYERS_WAITING'}
          values={{ id: quiz.id, username: user.username, count: regularPlayers.length }}
        >
          ... <strong>...</strong> ... <strong>...</strong> ...
        </Trans>
      </p>
      
      <div className='checkboxes'>
        <input
          type='checkbox'
          id='option-supervise'
          name='option-supervise'
          checked={isSupervised}
          onChange={handleIsSupervisedCheckboxChange}
        />
        <label htmlFor='option-supervise'>{t('common:FORMS.START_QUIZ.SUPERVISE')}</label>

        <input
          type='checkbox'
          id='option-timer'
          name='option-timer'
          checked={isTimed}
          onChange={handleIsTimedCheckboxChange}
        />
        <label htmlFor='option-timer'>{t('common:FORMS.START_QUIZ.TIMER')}</label>

        <input
          type='checkbox'
          id='option-next-question-forced'
          name='option-next-question-forced'
          checked={isNextQuestionForced}
          onChange={handleIsNextQuestionForcedCheckboxChange}
        />
        <label htmlFor='option-next-question-forced'>{t('common:FORMS.START_QUIZ.FORCE_NEXT_QUESTION')}</label>
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