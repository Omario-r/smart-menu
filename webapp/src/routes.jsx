import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import AppContainer from './js/app/App';

const AppRoutes = () => (
  <AppContainer></AppContainer>
);

class Routes extends React.Component {
  render() {
    return <AppRoutes/>
  }
}

export default Routes;
