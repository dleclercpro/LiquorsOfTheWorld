import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

export const store = configureStore({
  reducer: rootReducer,
  // If you have custom middleware, you can add it here:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourCustomMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;