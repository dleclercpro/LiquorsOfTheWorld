import React from 'react';
import './QuizQuestion.scss';

type Question = {
  question: string,
  options: string[],
  onSubmit: () => void,
}

const QuizQuestion = ({ question, options, onSubmit }: Question) => {
  console.log(options);
  
  return (
    <div className='quiz-question'>
      <h2>{question}</h2>
      <form onSubmit={onSubmit}>
        {options.map((option, index) => (
          <div key={index}>
            <input type='radio' id={`option-${index}`} name='option' value={option} />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default QuizQuestion;
