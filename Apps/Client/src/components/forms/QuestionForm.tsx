import React, { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { vote } from '../../reducers/QuizReducer';
import { showAnswer } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';

type Question = {
  index: number,
  question: string,
  theme: string,
  options: string[],
}

const QuestionBox: React.FC<Question> = ({ index, question, theme, options }) => {
  const quiz = useSelector(({ quiz }) => quiz);
  const questions = quiz.questions.data;

  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    
    await dispatch(vote({
      vote: options.findIndex(option => option === selectedOption),
    }));

    dispatch(showAnswer());
    
    setSelectedOption('');
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-theme-container'>
        <p className='question-form-index'>Question: {index + 1}/{questions.length}</p>
        <p className='question-form-theme'>{theme}</p>
      </div>

      <h2 className='question-form-title'>{question}</h2>

      {options.map((option, i) => (
        <div className='checkbox' key={i}>
          <input
            type='radio'
            id={`option-${i}`}
            name='option'
            value={option}
            checked={selectedOption === option}
            onChange={handleChange}
          />
          <label htmlFor={`option-${i}`}>{option}</label>
        </div>
      ))}

      <button type='submit' disabled={selectedOption === ''}>Submit my answer</button>
    </form>
  );
};

export default QuestionBox;
