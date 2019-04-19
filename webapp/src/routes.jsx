import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { connect } from 'react-redux';

import AuthUtils from './utils/auth';
import { setToken } from './utils/fetch';
import { setUser, fetchSelfUser } from './modules/auth/actions';

// Public components
import Login from './modules/auth/login';
// App components
import AppContainer from './app/App';
import Users from './modules/users/list';
import UserForm from './modules/users/form';

const AppRoutes = () => (
  <AppContainer>
    {/* <Route exact path="/" component={Dashboard} /> */}
    <Route path="/users" exact={true} component={Users} />
    <Route path="/users/:id" exact={true} component={UserForm} />
  </AppContainer>
);

class AuthRoutes extends React.Component {
  render() {
    return <div className="appContainer">
      <Route path="/" component={Login} />
    </div>
  }
}

class Routes extends React.Component {
  componentDidMount() {
    const resp = AuthUtils.isLoggedIn();
    if (resp) {
      setToken(resp.token);
      this.props.fetchSelfUser();
    }
  }
  render() {
    return <Router>
      {this.props.auth.user ?
        <AppRoutes /> :
        <AuthRoutes />
      }
    </Router>
  }
}

export default connect(
  (state) => ({auth: state.auth}), { setUser, fetchSelfUser }
)(Routes);

