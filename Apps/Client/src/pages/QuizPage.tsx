import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './QuizPage.scss';
import { CallGetQuestion } from '../calls/data/CallGetQuestion';
import { QuizQuestionResponse } from '../types';
import { useParams } from 'react-router-dom';

type QuizPageProps = {

}

const QuizPage: React.FC<QuizPageProps> = (props) => {
  const { questionId } = useParams();
  
  const [data, setData] = useState<QuizQuestionResponse>();
  const [selectedOption, setSelectedOption] = useState<string>();

  // Fetch page data on load once
  useEffect(() => {
    const fetchData = async () => {
      const res = await new CallGetQuestion(Number(questionId)).execute();
  
      setData(res.data);
    };
    
    fetchData();
  }, [questionId]);

  function onNextQuestion(option: any) {
    throw new Error('Function not implemented.');
  }

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    onNextQuestion(selectedOption);
  };

  if (!data) {
    return null;
  }

  return (
    <div className='quiz-question'>
      <h2>{data.question}</h2>
      <form onSubmit={handleSubmit}>
        {data.options.map((option, index) => (
          <div className='checkbox' key={index}>
            <input
              type='radio'
              id={`option-${index}`}
              name='option'
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
        <button type='submit'>Next Question</button>
      </form>
    </div>
  );
}

export default QuizPage;