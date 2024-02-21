import React from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import './QuestionForm.scss';
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
      <h2 className='start-quiz-form-title'>Do you wish to start the quiz?</h2>

      <button type='submit'>Start</button>
    </form>
  );
};

export default StartQuizForm;
