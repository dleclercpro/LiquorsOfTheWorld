import { combineReducers } from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import QuizReducer from './QuizReducer';

const rootReducer = combineReducers({
  user: UserReducer,
  quiz: QuizReducer,
});

export default rootReducer;