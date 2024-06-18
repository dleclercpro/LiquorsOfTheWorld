import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import { STORE_VERSION } from '../config';
import AppStore from './AppStore';

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
      serializableCheck: false, // Disable serialization check when persisting app store in local storage
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// Handle local storage store inconsistencies
const currentVersion = STORE_VERSION;
const persistedVersion = AppStore.getStoreVersion();

if (persistedVersion !== currentVersion) {
  console.log(`Persisted store version is different than the latest one: ${currentVersion} !== ${persistedVersion}`);

  AppStore.reset();
}