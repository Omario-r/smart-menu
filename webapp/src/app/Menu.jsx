import React, { Component, Fragment } from 'react';
import { Menu, Layout, Icon, Badge, Button } from 'antd';
const { Sider } = Layout;
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

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

    let defaultKey = path || 'dashboard';

    return <Sider className={styles.menuSider}>
      <div className="logo">STROY MARKET LOGO</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultKey]} onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="users">
          <Icon type="user" />
          <span className="nav-text">Пользователи</span>
        </Menu.Item>
      </Menu>
    </Sider>
  }
}

const AppMenuWithRouter = withRouter(AppMenu)

export default AppMenuWithRouter;
