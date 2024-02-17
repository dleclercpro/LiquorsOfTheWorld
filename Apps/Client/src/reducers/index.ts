import { combineReducers } from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import QuizReducer from './QuizReducer';
import OverlaysReducer from './OverlaysReducer';

const rootReducer = combineReducers({
  user: UserReducer,
  quiz: QuizReducer,
  overlays: OverlaysReducer,
});

export default rootReducer;