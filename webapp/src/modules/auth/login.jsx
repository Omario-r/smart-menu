import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginRequest } from './actions'

import { Card, Button, Form, Icon, Input } from 'antd';

import styles from './styles.less';

const FormItem = Form.Item;


class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginRequest(values.email, values.password);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return <div className={styles.loginContainer}>
      <Card title={<strong>Вход Smart Menu</strong>} bordered={false} style={{ width: 300, marginBottom: '10%' }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
             {getFieldDecorator('email', {
               rules: [{ required: true, message: 'Вы забыли указать email' }],
             })(
               <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
             )}
          </FormItem>
          <FormItem>
             {getFieldDecorator('password', {
               rules: [{ required: true, message: 'Пароль необходим для входа!' }],
             })(
               <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Пароль" />
             )}
          </FormItem>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.auth.loginRequesting}>
              Вход
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  }
}

const LoginForm = Form.create()(Login)

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { loginRequest })(LoginForm)
