import React, { Component, Fragment } from 'react';
import { Menu, Layout, Icon, Badge, Button } from 'antd';
const { Sider } = Layout;
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { ROLES } from '../../../static/constants'

import styles from './styles.less';


class AppMenu extends Component {


  onMenuClick({ key }) {
    switch(key) {
      case 'main':
        this.props.history.push('/');
        break;
      default:
        this.props.history.push('/'+key);
    }
  }

  render() {
    const path = this.props.location.pathname.slice(1);
    const { user } = this.props;

    const isAdmin = user.role === ROLES.admin;
    const isAdminOrEditor = [ROLES.admin, ROLES.editor].includes(user.role);

    let defaultKey = path || 'dashboard';

    return (
      <Menu className="header__menu" mode="horizontal" defaultSelectedKeys={[defaultKey]} onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="main">
          <div className="logo"><img src={require('../images/SM_logo_gray1.jpg')} style={{ height: 70 }} /></div>
        </Menu.Item>
        <Menu.Item key="food-menu">
          <Icon type="bars" />
          <span className="nav-text">Меню</span>
        </Menu.Item>
        <Menu.Item key="recipes">
          <Icon type="profile" />
          <span className="nav-text">Рецепты</span>
        </Menu.Item>
      </Menu>
    )
  }
}

const AppMenuWithRouter = withRouter(AppMenu)

export default connect((state) => ({
  user: state.auth.user,
}), {}
)(AppMenuWithRouter);
