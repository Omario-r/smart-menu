import React from 'react';
import { Layout } from 'antd';
import AppMenu from './Menu';
import AppHeader from './Header';
import styles from './styles.less'

const { Content, Footer, } = Layout;


class App extends React.Component {
  render() {
    return <Layout style={{ height: '100%' }}>
      {/* <AppMenu />
      <Layout style={{ marginLeft: 200, height: '100%' }}>
        <div className={styles.container}>
          <AppHeader />
          <Content className={styles.content}>
            {this.props.children}
          </Content>
          <Footer className={styles.footer}>
            Smart Menu ©2019 Powered by Roman Avilov
          </Footer>
        </div>
      </Layout> */}
      <div className={styles.header}>QWERTY</div>
    </Layout>
  }
}


export default App;
