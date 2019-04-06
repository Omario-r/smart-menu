import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';

import ruRU from 'antd/lib/locale-provider/ru_RU';




// Import Styles
import './styles/index.scss';

// Routers
import Routes from './routes';

ReactDOM.render(
  <LocaleProvider locale={ruRU}>
    <Routes/>
  </LocaleProvider>,
    document.getElementById('app')
);

