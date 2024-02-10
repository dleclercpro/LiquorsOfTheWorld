import React from 'react';
import './QuizQuestion.scss';

type Question = {
  checked: boolean,
  question: string,
  theme: string,
  options: string[],
  onChange: () => void,
  onSubmit: () => void,
}

const QuizQuestion = ({ checked, question, theme, options, onChange, onSubmit }: Question) => {
  return (
    <div className='quiz-question'>
      <p className='quiz-question-theme'>{theme}</p>
      <h2 className='quiz-question-title'>{question}</h2>

      <form onSubmit={onSubmit}>
        {options.map((option, index) => (
          <div className='checkbox' key={index}>
            <input
              type='radio'
              id={`option-${index}`}
              name='option'
              value={option}
              checked={checked}
              onChange={onChange}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}

        <button type='submit'>Next Question</button>
      </form>
    </div>
  );
};

export default QuizQuestion;
