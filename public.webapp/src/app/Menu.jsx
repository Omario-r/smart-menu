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
      case 'dashboard':
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

    return <Sider className={styles.menuSider}>
      <div className="logo"><img src={require('../images/SM_logo_gray1.jpg')} style={{ height: 70, width: '100%' }} /></div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultKey]} onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="all-food-menu">
          <Icon type="bars" />
          <span className="nav-text">Все Меню</span>
        </Menu.Item>
        <Menu.Item key="my-food-menu">
          <Icon type="bars" />
          <span className="nav-text">Мои Меню</span>
        </Menu.Item>
        <Menu.Item key="all-recipes">
          <Icon type="profile" />
          <span className="nav-text">Все рецепты</span>
        </Menu.Item>
        <Menu.Item key="my-recipes">
          <Icon type="profile" />
          <span className="nav-text">Мои рецепты</span>
        </Menu.Item>
        {isAdminOrEditor && <Menu.Item key="foodstuff">
          <Icon type="gold" />
          <span className="nav-text">Продукты</span>
        </Menu.Item>}
        {isAdmin && <Menu.Item key="users">
          <Icon type="user" />
          <span className="nav-text">Пользователи</span>
        </Menu.Item>}

      </Menu>
    </Sider>
  }
}

const AppMenuWithRouter = withRouter(AppMenu)

export default connect((state) => ({
  user: state.auth.user,
}), {}
)(AppMenuWithRouter);
