import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counter.slice';
import counterAsyncReducer from './counterAsync.slice';

const rootReducer = combineReducers({
  counter: counterReducer,
  counterAsync: counterAsyncReducer,
});

export default rootReducer;