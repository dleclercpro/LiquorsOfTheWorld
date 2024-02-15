import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './AuthReducer';
import CounterReducer from './CounterReducer';
import CounterAsyncReducer from './CounterAsyncReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  counter: CounterReducer,
  counterAsync: CounterAsyncReducer,
});

export default rootReducer;