import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppContextProvider } from './contexts/AppContextProvider';
import { store } from './store';
import { ENV } from './utils/env';
import { setLogLevel } from './utils/logging';
import App from './App';
import './index.scss';

setLogLevel(ENV);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Provider>
  </React.StrictMode>
);