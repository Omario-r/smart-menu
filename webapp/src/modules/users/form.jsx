import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton } from 'antd'
import { ROLES, ROLES_TITLE } from '../../../../static/constants';
import { addUser, getUser, updateUser, updatePassword, isEmailExist, isPhoneExist, fetchUsers } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class UserForm extends Component {

  state = {
    password: {
      isInputVisible: true,
      isChanged: false, // проверяется на бэке
    },
    isDataLoading: false,
    isDataSaving: false,
    isEmailExist: true,
    user: {
      active: true,
    },
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id === 'new') {
      this.props.setHeader({ title: 'Новый пользователь', back: true, });
      this.props.form.setFieldsValue({
        email: null,
        phone: '7',
        password: null,
      })
    } else {
      this.loadUser(id);
    }
  }

  UNSEFE_componentWillReceiveProps(nextProps) {
    const nextPropsUserID = nextProps.match.params.id;
    const currentUserId = this.state.user.id;
    // сравниваю с приведением типов
    if (nextPropsUserID !== 'new' && currentUserId != nextPropsUserID) {
      this.loadUser(nextPropsUserID);
    }
  }

  loadUser(id) {
    this.setState({ isDataLoading: true });
    getUser(id).then((user) => {
      this.setState({
        user,
        password: { isInputVisible: false },
        isDataLoading: false
      }, () => { 
          this.props.form.setFieldsValue({
            first_name: user.first_name,
            last_name: user.last_name,
            fathers_name: user.fathers_name,
            email: user.email,
            phone: user.phone,
            city_id: user.city_id,
            role: user.role,
            active: user.active,
          });
        });
      this.props.setHeader({ title: `Пользователь: ${user.last_name || ''} ${user.first_name || ''}`, back: true, });
    });
  }


  handleSubmit = (e) => {
    const { getFieldValue, validateFields } = this.props.form;
    const { id } = this.props.match.params;
    e.preventDefault();
    validateFields((err, values) => {
      const { isChanged } = this.state.password;
      const editedValues = { id, isChanged, ...values };

      if (!err) {
        this.setState({ isDataSaving: true })
        if (id === 'new') {
          addUser(editedValues).then(user => {
            message.success('Пользователь создан');
            this.props.history.replace(`/users/${user.id}`);
            this.props.setHeader({ title: `Пользователь: ${user.last_name || ''} ${user.first_name || ''}`, back: true, });
            this.setState({ user, isDataLoading: false, isDataSaving: false });
          });
        } else {
          updateUser(editedValues).then(() => {
            this.setState({
              password: {
                isInputVisible: false,
                isCancelButton: false,
                isChanged: false,
              },
              isDataSaving: false
            });
            message.success('Пользователь сохранен');
          });
          this.props.setHeader({ title: `Пользователь: ${editedValues.last_name || ''} ${editedValues.first_name}`, back: true, });
        }
      }
    });
  }

  passwordOnChange = () => {
    this.setState({
      password: {
        isInputVisible: true,
        isCancelButton: true,
        isChanged: true,
      },
    });
  }

  passwordOnCancelChange = () => {
    this.setState({
      password: {
        isInputVisible: false,
        isCancelButton: false,
        isChanged: false,
      }
    });
  }

  validateEmail = (rule, email, callback) => {
      const { id } = this.props.match.params;
      const validationData = id === 'new' ? { email } : { email, id }
      if (this.emailTimeout) {
        clearTimeout(this.emailTimeout)
      }
      this.emailTimeout = setTimeout(() =>
        isEmailExist(validationData)
          .then(res => res ? callback('Такой адрес уже существует') : callback())
        , 500);
  }

  validatePhone = (rule, phone, callback) => {
      const { id } = this.props.match.params;
      const validationData = id === 'new' ? { phone } : { phone, id };
      if (this.phoneTimeout) {
        clearTimeout(this.phoneTimeout)
      }
      this.phoneTimeout = setTimeout(() =>
        isPhoneExist(validationData)
          .then(res => res ? callback('Такой телефон уже существует') : callback())
        , 500);
  }

  handlePartnerChange() {
    this.props.form.setFieldsValue({ partner_point_id: null });
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { user, password, isEmailExist } = this.state;
    const { id } = this.props.match.params;
    const role = getFieldValue('role');
    let roles = ROLES_TITLE;

    return <div>
      <Skeleton loading={this.state.isDataLoading} active>
        <Form onSubmit={this.handleSubmit}>

          <Row gutter={20}>
            <Col span={6}>
              <FormItem
                label='Имя'
              >
                {getFieldDecorator('first_name', {
                  rules: [{ required: true, message: 'Введите имя' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='Фамилия'
              >
                {getFieldDecorator('last_name', {
                  rules: [{ required: false, message: 'Введите фамилию' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='Отчество'
              >
                {getFieldDecorator('fathers_name', {
                  rules: [{ required: false, message: 'Введите отчество' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={6}>
              <FormItem
                label='Email'
              >
                {getFieldDecorator('email', {
                  rules: [
                    { type: 'email', message: 'Введите правильный email' },
                    { required: true, message: 'Введите email' },
                    { validator: this.validateEmail },


                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='Телефон'
              >
                {getFieldDecorator('phone', {
                  rules: [
                    { type: 'string', pattern: /^79[\d]{9}$/, message: 'Номер должен быть в формате \'79\' и ещё 9 цифр' },
                    { validator: this.validatePhone },
                    // { required: true, message: 'Введите телефон' },
                  ],
                })(
                  <Input placeholder="71234567890" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='Роль'
              >
                {getFieldDecorator('role', {
                  rules: [{ required: true, message: 'Выберите роль' }],
                })(
                  <Select placeholder='Роль'>
                    {Object.keys(roles).map(key => <Option key={key} value={parseInt(key, 10)}>{roles[key]}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={6}>
              {password.isInputVisible
              ? < FormItem label='Пароль'>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Пожалуйста введите пароль!' }],
                  })(
                    <Input type="password" /> 
                  )}
                  {id !== 'new' && <Button onClick={this.passwordOnCancelChange}>Отмена</Button>}
                </FormItem>
              : <Button  style={{ marginTop: '11.5%' }} icon="lock" onClick={this.passwordOnChange}>Изменить пароль</Button>}
            </Col>
            <Col span={6}>
              <FormItem
                label='Активен'
              >
                {getFieldDecorator('active', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Switch />
                )}
              </FormItem>
            </Col>
 
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" loading={this.state.isDataSaving} htmlType="submit">{user.id ? 'Сохранить' : 'Создать'}</Button>
          </Row>
        </Form>
      </Skeleton>
    </div>
  }
}

const ConnectedForm = connect(
  (state) => ({
    user: state.auth.user,
  }),
  { setHeader }
)(UserForm)

export default Form.create()(ConnectedForm)