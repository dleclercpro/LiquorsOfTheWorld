import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './UserReducer';
import QuizReducer from './QuizReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  quiz: QuizReducer,
});

export default rootReducer;