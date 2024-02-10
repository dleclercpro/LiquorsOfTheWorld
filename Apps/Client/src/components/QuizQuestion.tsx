import React, { useState } from 'react';
import './QuizQuestion.scss';
import { useNavigate } from 'react-router-dom';
import { CallVote } from '../calls/data/CallVote';

type Question = {
  id: number,
  question: string,
  theme: string,
  options: string[],
}

const QuizQuestion = ({ id, question, theme, options }: Question) => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const response = await new CallVote({
      questionId: id,
      vote: options.findIndex(option => option === selectedOption),
    }).execute();

    console.log(response);

    navigate(`/quiz/${id + 1}`);
  }

  return (
    <div className='quiz-question'>
      <div className='quiz-question-theme-container'>
        <p className='quiz-question-theme'>{theme}</p>
      </div>

      <h2 className='quiz-question-title'>{question}</h2>

      <form onSubmit={handleSubmit}>
        {options.map((option, index) => (
          <div className='checkbox' key={index}>
            <input
              type='radio'
              id={`option-${index}`}
              name='option'
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}

        <button type='submit' disabled={selectedOption === ''}>Next Question</button>
      </form>
    </div>
  );
};

export default QuizQuestion;
