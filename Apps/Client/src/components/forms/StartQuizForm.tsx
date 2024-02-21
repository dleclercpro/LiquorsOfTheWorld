import React from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import './StartQuizForm.scss';
import { start } from '../../actions/QuizActions';

const StartQuizForm: React.FC = () => {
  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;

  const dispatch = useDispatch();

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const res = await dispatch(start(quizId));

    if (res.type === 'quiz/start/rejected') {
      alert(`Could not start quiz!`);
      return;
    }
  }

  return (
    <form className='start-quiz-form' onSubmit={handleSubmit}>
      <h2 className='start-quiz-form-title'>Start</h2>
      <p className='start-quiz-form-text'>Are you ready to start the quiz? New players won't be able to join afterwards!</p>

      <button type='submit'>Yes, let's go!</button>
    </form>
  );
};

export default StartQuizForm;
