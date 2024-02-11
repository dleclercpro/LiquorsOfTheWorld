import { createContext } from 'react';
import { Quiz } from '../types/QuizTypes';

export interface AppState {
  questionIndex: number,
  setQuestionIndex: (id: number) => void,
  quiz: Quiz,
  setQuiz: (data: Quiz) => void,
  shouldShowAnswer: boolean,
  showAnswer: () => void,
  hideAnswer: () => void,
}



const AppContext = createContext<AppState>({
  questionIndex: 0,
  setQuestionIndex: () => {},
  quiz: [],
  setQuiz: () => {},
  shouldShowAnswer: false,
  showAnswer: () => {},
  hideAnswer: () => {},
});

export default AppContext;