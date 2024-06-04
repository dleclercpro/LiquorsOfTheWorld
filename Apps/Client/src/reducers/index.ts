import { combineReducers } from '@reduxjs/toolkit';
import AppReducer from './AppReducer';
import UserReducer from './UserReducer';
import QuizReducer from './QuizReducer';
import OverlaysReducer from './OverlaysReducer';
import DataReducer from './DataReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  data: DataReducer,
  user: UserReducer,
  quiz: QuizReducer,
  overlays: OverlaysReducer,
});

export default rootReducer;