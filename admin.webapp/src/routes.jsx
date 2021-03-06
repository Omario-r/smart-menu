import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom';
import { connect } from 'react-redux';

import AuthUtils from './utils/auth';
import { setToken } from './utils/fetch';
import { setUser, fetchSelfUser } from './modules/auth/actions';

// Public components
import Login from './modules/auth/login';
import Registration from './modules/auth/regisration';
// App components
import AppContainer from './app/App';
import Users from './modules/users/list';
import UserForm from './modules/users/form';
import Foodstuff from './modules/foodstuff/list';
import FoodstuffForm from './modules/foodstuff/form';
import MyFoodMenu from './modules/my-food-menu/list';
import MyFoodMenuForm from './modules/my-food-menu/form';
import MyRecipes from './modules/my-recipes/list';
import MyRecipesForm from './modules/my-recipes/form';
import MyPDFMenu from './modules/my-food-menu/pdf';

const AppRoutes = () => (
  <AppContainer>
    <Route exact path="/" component={MyFoodMenu} />
    <Route path="/users" exact={true} component={Users} />
    <Route path="/users/:id" exact={true} component={UserForm} />
    <Route path="/foodstuff" exact={true} component={Foodstuff} />
    <Route path="/foodstuff/:id" exact={true} component={FoodstuffForm} />
    <Route path="/my-recipes" exact={true} component={MyRecipes} />
    <Route path="/my-recipes/:id" exact={true} component={MyRecipesForm} />
    <Route path="/my-food-menu" exact={true} component={MyFoodMenu} />
    <Route path="/my-food-menu/:id" exact={true} component={MyFoodMenuForm} />
    <Route path="/pdf-menu" exact={true} component={MyPDFMenu} />
  </AppContainer>
);

class AuthRoutes extends React.Component {
  render() {
    return <div className="appContainer">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/registration" component={Registration} />      
      </Switch>
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

