import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './AuthReducer';
import QuizReducer from './QuizReducer';
import CounterReducer from './CounterReducer';
import CounterAsyncReducer from './CounterAsyncReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  quiz: QuizReducer,
  counter: CounterReducer,
  counterAsync: CounterAsyncReducer,
});

export default rootReducer;