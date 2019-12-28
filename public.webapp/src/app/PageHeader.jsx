import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Layout, Icon, Button, PageHeader } from 'antd';
const { Header } = Layout;

class AppPageHeader extends Component {

  goBack = () => {
    const { header = {} } = this.props;
    if (header.back === true) {
      return this.props.history.goBack();
    } else if (typeof header.back === 'string') {
      return this.props.history.push(back);
    }
  }

  render() {
    const { header = {} } = this.props;
    return (
      <PageHeader
        onBack={header.back ? this.goBack : null}
        title={header.title}
        subTitle={header.subTitle}
      />
    )
  }
}


const PageHeaderRouted = withRouter(AppPageHeader)

export default connect(
  (state) => ({
    header: state.app.header,
    user: state.auth.user,
  }),
  {}
)(PageHeaderRouted)
