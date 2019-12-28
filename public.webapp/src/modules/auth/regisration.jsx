import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { loginRequest } from './actions';
import { userRegister } from './dal'
import { isEmailExist } from './dal'

import styles from './styles.less';

import { Card, Button, Form, Icon, Input, message } from 'antd';

const FormItem = Form.Item;

class Register extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        userRegister(values)
          .then(() => {
            this.props.history.push('/');
            message.success('Вы успешно зарегистрированы')
          })
      }
    });
  }

  validateEmail = (rule, email, callback) => {
    if (this.emailTimeout) {
      clearTimeout(this.emailTimeout)
    }
    this.emailTimeout = setTimeout(() =>
      isEmailExist( { email })
        .then(res => res ? callback('Такой адрес уже существует') : callback())
      , 500);
}

  render () {
    const { getFieldDecorator } = this.props.form;
    return <div className={styles.loginContainer}>
        <Card title={<strong>Регистрация в Smart Menu</strong>} bordered={false} style={{ width: 300, marginBottom: '10%' }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Вы забыли указать email' },
                  { validator: this.validateEmail }
                ],
              })(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Пароль необходим для регистрации!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Пароль" />
              )}
            </FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to='/'>Вход</Link>
              <Button type="primary" htmlType="submit" className="login-form-button" /* loading={this.props.auth.loginRequesting}*/>
                Зарегистрироваться
              </Button>
            </div>
          </Form>
        </Card>
    </div>
  }
}

const RegisterForm = Form.create()(Register)

export default RegisterForm;