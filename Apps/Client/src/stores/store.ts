import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import { STORE_VERSION } from '../config';

const persistConfig = {
  key: 'root',
  storage, // Local storage by default
  version: STORE_VERSION,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// Handle local storage store inconsistencies
const persistedStore = localStorage.getItem('persist:root');

const currentVersion = STORE_VERSION;
const persistedVersion = persistedStore ? JSON.parse(JSON.parse(persistedStore)._persist).version : null;

if (persistedVersion !== currentVersion) {
  console.log(`Persisted store version is different than the latest one: ${currentVersion} !== ${persistedVersion}`);
  console.log(`Erasing persisted app store of local storage...`);

  localStorage.clear();
}