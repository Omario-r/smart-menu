import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { LocaleProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';

// Import Styles
import './styles/index.less';

import IndexReducer from './index-reduser';


// Routers
import Routes from './routes';

/* eslint-disable */
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/* eslint-enable */

const store = createStore(
  IndexReducer,
  composeSetup(applyMiddleware(thunk)), // allows redux devtools to watch thunk
);

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={ruRU}>
      <Routes />
    </LocaleProvider>
  </Provider>,
  document.getElementById('app'),
);

// if (module.hot) {
//   module.hot.accept();
// }