import React, { ReactNode, useState } from 'react';
import AppContext, { AppState } from './AppContext';
import { Quiz } from '../types/QuizTypes';

interface Props {
  children?: ReactNode;
}

export const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [quiz, setQuiz] = useState<Quiz>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shouldShowAnswer, setShouldShowAnswer] = useState(false);
  
  const showAnswer = () => setShouldShowAnswer(true);
  const hideAnswer = () => setShouldShowAnswer(false);

  const state: AppState = {
    questionIndex,
    setQuestionIndex,
    quiz,
    setQuiz,
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
