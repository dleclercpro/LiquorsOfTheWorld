import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ENV } from './utils/env';
import { setLogLevel } from './utils/logging';
import { AppContextProvider } from './contexts/AppContextProvider';

setLogLevel(ENV);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <AppContextProvider>
        <App />
      </AppContextProvider>
  </React.StrictMode>
);