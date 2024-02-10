import { createContext } from 'react';
import { QuizData } from '../types/QuizTypes';

export interface AppState {
  currentQuestionId: number,
  setCurrentQuestionId: (id: number) => void,
  quizData: QuizData,
  setQuizData: (data: QuizData) => void,
  shouldShowAnswer: boolean,
  showAnswer: () => void,
  hideAnswer: () => void,
}

export const INIT_APP_STATE = {
  currentQuestionId: 0,
  setCurrentQuestionId: () => {},
  quizData: [],
  setQuizData: () => {},
  shouldShowAnswer: false,
  showAnswer: () => {},
  hideAnswer: () => {},
};

const AppContext = createContext<AppState>(INIT_APP_STATE);

export default AppContext;