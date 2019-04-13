import React, { Component, Fragment } from 'react';
import { Menu, Layout, Icon, Badge, Button } from 'antd';
const { Sider } = Layout;
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

// import styles from './styles.less';


class AppMenu extends Component {
  render() {
    return <Sider /*className={styles.menuSider}*/>
      <div className="logo">FREEBIE LOGO</div>
      <Menu theme="dark" mode="inline" >
        <Menu.Item key="dashboard">
          <span className="nav-text">Монитор</span>
        </Menu.Item>
      </Menu>
    </Sider>
  }
}

// const AppMenuWithRouter = withRouter(AppMenu)

export default AppMenu;
