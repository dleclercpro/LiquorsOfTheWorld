import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import { CallGetQuestion } from '../calls/data/CallGetQuestion';
import { QuizQuestionResponse } from '../types';
import { useParams } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';
import QuizQuestion from '../components/QuizQuestion';

type QuizPageProps = {

}

const QuizPage: React.FC<QuizPageProps> = (props) => {
  const params = useParams();
  const questionId = Number(params.questionId)

  const [data, setData] = useState<QuizQuestionResponse>();

  // Fetch page data on load once
  useEffect(() => {
    const fetchData = async () => {
      const res = await new CallGetQuestion(questionId).execute();
  
      setData(res.data);
    };
    
    fetchData();
  }, [questionId]);

  if (!data) {
    return null;
  }

  return (
    <React.Fragment>
      <HamburgerMenu />
      <QuizQuestion
        id={questionId}
        theme={data.theme}
        question={data.question}
        options={data.options}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;