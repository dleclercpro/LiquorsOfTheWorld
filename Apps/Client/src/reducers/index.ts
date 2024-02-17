import { combineReducers } from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import QuizReducer from './QuizReducer';
import ModalsReducer from './ModalsReducer';

const rootReducer = combineReducers({
  user: UserReducer,
  quiz: QuizReducer,
  modals: ModalsReducer,
});

export default rootReducer;