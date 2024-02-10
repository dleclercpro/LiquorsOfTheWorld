import React, { ReactNode, useState } from 'react';
import AppContext, { AppState } from './AppContext';
import { QuizData } from '../types/QuizTypes';

interface Props {
  children?: ReactNode;
}

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizData>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [shouldShowAnswer, setShouldShowAnswer] = useState(false);
  
  const showAnswer = () => setShouldShowAnswer(true);
  const hideAnswer = () => setShouldShowAnswer(false);

  const state: AppState = {
    currentQuestionId,
    setCurrentQuestionId,
    quizData,
    setQuizData,
    shouldShowAnswer,
    showAnswer,
    hideAnswer,
  };

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
};
