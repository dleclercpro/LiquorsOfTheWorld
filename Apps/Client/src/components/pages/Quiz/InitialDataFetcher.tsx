import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';

const InitialDataFetcher: React.FC = () => {  
  const quiz = useQuiz();

  useEffect(() => {
    console.log(`Fetching all data...`);
    
    quiz.fetchAllData();

  }, []);

  return null;
};

export default InitialDataFetcher;