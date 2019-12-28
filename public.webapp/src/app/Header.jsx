import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Layout, Icon, Button } from 'antd';
const { Header } = Layout;

import { clearToken } from '../utils/fetch';
import AuthUtils from '../utils/auth';
import { unsetUser } from '../modules/auth/actions';
import { setHeader } from './actions';
import AppMenu from './Menu';

import styles from './styles.less';

const backStyle = {
  fontSize: '18px',
  marginRight: 10,
  cursor: 'pointer'
};

class AppHeader extends React.Component {
  onLogout() {
    clearToken();
    AuthUtils.clear();
    this.props.unsetUser();
    this.props.history.push('/');
  }
  goBack() {
    const back = this.props.header.back;
    if (back === true) {
      this.props.history.goBack();
    } else if (typeof back === 'string') {
      this.props.history.push(back);
    }
  }
  render() {
    const { header, user } = this.props;
    return (
      <Header className={styles.header}>
        <AppMenu />
        <div className="header__username">{user.last_name||''+' '+user.first_name||''}</div>
        <Button onClick={this.onLogout.bind(this)}>Выход</Button>
      </Header>
    )
  }
}

const AppHeaderRouted = withRouter(AppHeader)

export default connect(
  (state) => ({
    header: state.app.header,
    user: state.auth.user,
  }),
  { unsetUser, setHeader }
)(AppHeaderRouted)
