import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import { CallGetQuestion } from '../calls/data/CallGetQuestion';

const QuizPage: React.FC = () => {
  const [data, setData] = useState(''); 

  const fetchData = async (question: number = 0) => {
    const res = await new CallGetQuestion(question).execute();

    const { data: _data } = res;

    setData(_data);
  };

  useEffect(() => {
    fetchData(0);
  });

  return (
    <div>
      {data}
    </div>
  );
}

export default QuizPage;