import { combineReducers } from '@reduxjs/toolkit';
import AppReducer from './AppReducer';
import UserReducer from './UserReducer';
import QuizReducer from './QuizReducer';
import OverlaysReducer from './OverlaysReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  user: UserReducer,
  quiz: QuizReducer,
  overlays: OverlaysReducer,
});

export default rootReducer;