import React, { useContext, useState } from 'react';
import './QuizQuestion.scss';
import { CallVote } from '../calls/data/CallVote';
import AppContext from '../states/AppContext';

type Question = {
  id: number,
  question: string,
  theme: string,
  options: string[],
}

const QuizQuestion: React.FC<Question> = ({ id, question, theme, options }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const { showAnswer } = useContext(AppContext);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedOption(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await new CallVote({
      questionId: id,
      vote: options.findIndex(option => option === selectedOption),
    }).execute();

    showAnswer();
    
    setSelectedOption('');
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

        <button type='submit' disabled={selectedOption === ''}>Submit my answer</button>
      </form>
    </div>
  );
};

export default QuizQuestion;
