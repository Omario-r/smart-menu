import React from 'react';
import { Layout, Button } from 'antd';
import AppHeader from './Header';
import PageHeader from './PageHeader';
import styles from './styles.less';

const { Content, Footer, } = Layout;


class App extends React.Component {
  render() {
    return <Layout style={{ height: '100%' }}>
      <Layout style={{ height: '100%',  backgroundColor: '#fff' }}>
        <div className={styles.container}>
          <AppHeader />
          <PageHeader />
          <Content className={styles.content}>
            {this.props.children}
          </Content>
        </div>
        <Footer className={styles.footer}>
          Smart Menu ©2019 Powered by Roman Avilov
        </Footer>
      </Layout>
    </Layout>
  }
}


export default App;
