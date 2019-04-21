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


class MyFoodMenuForm extends Component {
  render() {
    return <div>MyFoodMenuForm</div>
  }
}

const ConnectedForm = connect(
  (state) => ({
    user: state.auth.user,
  }),
  { setHeader }
)(MyFoodMenuForm)

export default Form.create()(ConnectedForm)