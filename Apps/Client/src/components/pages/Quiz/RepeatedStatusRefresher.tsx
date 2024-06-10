import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import { REFRESH_STATUS_INTERVAL } from '../../../config';

const RepeatedStatusRefresher: React.FC = () => {  
  const quiz = useQuiz();

  useEffect(() => {
    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
    
    return () => clearInterval(interval);
    
  }, []);

  return null;
}

export default RepeatedStatusRefresher;