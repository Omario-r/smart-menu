import React from 'react';
import { Layout, Icon, Button, Menu } from 'antd';

const { Content, Footer, Header, Sider } = Layout;

const { SubMenu } = Menu;

class App extends React.Component {
  render() {
    return <Layout>
      <Header>
        <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
      </Header>
    </Layout>
  }
}

export default App;
