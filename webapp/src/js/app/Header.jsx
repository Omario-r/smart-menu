import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Layout, Icon, Button } from 'antd';
const { Header } = Layout;

import styles from './styles.less';

class AppHeader extends Component {
  render() {
    return <Header className={styles.header}>
      <h2 /*className="header__title"*/>Header</h2>
    </Header>
  }
}

// const AppHeaderRouted = withRouter(AppHeader)

export default AppHeader;
