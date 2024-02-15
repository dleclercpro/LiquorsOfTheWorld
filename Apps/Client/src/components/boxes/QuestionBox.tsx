import React, { useState } from 'react';
import './QuestionBox.scss';
import { CallVote } from '../../calls/data/CallVote';
import { useDispatch, useSelector } from '../../hooks/redux';
import { showAnswer } from '../../reducers/QuizReducer';

type Question = {
  index: number,
  question: string,
  theme: string,
  options: string[],
}

const QuestionBox: React.FC<Question> = ({ index, question, theme, options }) => {
  const quiz = useSelector(({ quiz }) => quiz.data);
  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await new CallVote({
      questionIndex: index,
      vote: options.findIndex(option => option === selectedOption),
    }).execute();

    dispatch(showAnswer());
    
    setSelectedOption('');
  }

  if (quiz.length === 0) {
    return null;
  }

  return (
    <div className='question-box'>
      <div className='question-box-theme-container'>
        <p className='question-box-index'>Question: {index + 1}/{quiz.length}</p>
        <p className='question-box-theme'>{theme}</p>
      </div>

      <h2 className='question-box-title'>{question}</h2>

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default QuestionBox;
