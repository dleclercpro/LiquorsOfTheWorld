import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { ENV } from './utils/env';
import { setLogLevel } from './utils/logging';
import App from './App';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';

setLogLevel(ENV);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);