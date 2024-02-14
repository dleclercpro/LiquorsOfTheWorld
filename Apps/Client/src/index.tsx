import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ENV } from './utils/env';
import { setLogLevel } from './utils/logging';
import App from './App';
import './index.scss';

setLogLevel(ENV);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);