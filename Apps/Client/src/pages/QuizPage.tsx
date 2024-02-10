import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './QuizPage.scss';
import { CallGetQuestion } from '../calls/data/CallGetQuestion';
import { QuizQuestionResponse } from '../types';
import { useParams } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';
import QuizQuestion from '../components/QuizQuestion';

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
    <React.Fragment>
      <HamburgerMenu />
      <QuizQuestion
        checked={false}
        theme={data.theme}
        question={data.question}
        options={data.options}
        onChange={() => {}}
        onSubmit={() => {}}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;