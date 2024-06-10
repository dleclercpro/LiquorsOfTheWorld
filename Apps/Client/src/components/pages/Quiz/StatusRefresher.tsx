import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import useApp from '../../../hooks/useApp';

const StatusRefresher: React.FC = () => {  
  const quiz = useQuiz();
  const app = useApp();

  const { questionIndex } = app;

  useEffect(() => {
    if (questionIndex < 1) return;

    console.log(`Refreshing status...`);
    
    quiz.refreshStatusPlayersAndScores();
  
  }, [questionIndex]);

  return null;
}

export default StatusRefresher;