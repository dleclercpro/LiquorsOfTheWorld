import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import './StartQuizForm.scss';
import { start } from '../../actions/QuizActions';

const StartQuizForm: React.FC = () => {
  const [isSupervised, setIsSupervised] = useState(false);

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;

  const dispatch = useDispatch();

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
      <h2 className='start-quiz-form-title'>Start</h2>
      <p className='start-quiz-form-text'>Are you ready to start the quiz? New players won't be able to join afterwards!</p>

      <div className='checkbox'>
        <input
          type='checkbox'
          id='option'
          name='option'
          checked={isSupervised}
          onChange={handleChange}
        />
        <label htmlFor='option'>Supervise quiz</label>
      </div>

      <button type='submit'>Yes, let's go!</button>
    </form>
  );
};

export default StartQuizForm;