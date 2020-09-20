import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import returnStoreAndPersistor from './store';
import App from './components/App';

const { store } = returnStoreAndPersistor();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);
