import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import AppContainer from './js/app/App';

const AppRoutes = () => (
  <AppContainer>
    <div>From routes</div>
  </AppContainer>
);

class Routes extends React.Component {
  render() {
    return <Router>
      <AppRoutes/>
    </Router>
  }
}

export default Routes;
