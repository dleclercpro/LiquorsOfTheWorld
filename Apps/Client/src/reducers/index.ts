import { combineReducers } from '@reduxjs/toolkit';
import AppReducer from './AppReducer';
import AuthReducer from './AuthReducer';
import QuizReducer from './QuizReducer';
import OverlaysReducer from './OverlaysReducer';
import DataReducer from './DataReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  data: DataReducer,
  auth: AuthReducer,
  quiz: QuizReducer,
  overlays: OverlaysReducer,
});

export default rootReducer;