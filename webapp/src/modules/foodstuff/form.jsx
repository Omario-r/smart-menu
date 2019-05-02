import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton } from 'antd'
import { ROLES, ROLES_TITLE, FOOD_CATEGORIES } from '../../../../static/constants';
import { getFoodstuff, addFoodstuff, updateFoodstuff } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class FoodstuffForm extends Component {

  state ={
    foodstuff: {},
    loading: true,
    saving: false
  }



  componentDidMount() {
    const { id } = this.props.match.params;
    if (id === 'new') {
      this.props.setHeader({ title: 'Новый продукт', back: true, });
      this.setState({ loading: false })
    } else {
      this.loadFoodstuff(id);
    }
  }

  loadFoodstuff(id) {
    getFoodstuff(id).then(({ data: foodstuff }) => {
      this.setState({
        foodstuff,
        loading: false
      }, () => { 
          this.props.form.setFieldsValue({
            name: foodstuff.name,
            // category: foodstuff.category,
          });
      });
      this.props.setHeader({ title: `Продукт: ${foodstuff.name}`, back: true, });
      return foodstuff;
    }).then(f => this.props.form.setFieldsValue({category: f.category,}))
  }


  handleSubmit = (e) => {
    const { getFieldValue, validateFields } = this.props.form;
    const { id } = this.props.match.params;
    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;

      this.setState({ saving: true })
      const foodstuffProcess = (id === 'new' ? addFoodstuff(values) : updateFoodstuff(id, values));
      const onSavingMesage = (id === 'new'? 'Продукт создан': 'Продукт сохранен' );

      foodstuffProcess.then(({ data: foodstuff }) => {
        message.success(onSavingMesage);
        this.props.history.replace(`/foodstuff/${foodstuff.id}`);
        this.props.setHeader({ title: `Продукт: ${foodstuff.name}`, back: true });
        this.setState({ foodstuff, saving: false });
      })
    });
  }

  // validateName = (rule, email, callback) => {
  //     const { id } = this.props.match.params;
  //     const validationData = id === 'new' ? { email } : { email, id }
  //     if (this.emailTimeout) {
  //       clearTimeout(this.emailTimeout)
  //     }
  //     this.emailTimeout = setTimeout(() =>
  //       isEmailExist(validationData)
  //         .then(res => res ? callback('Такой адрес уже существует') : callback())
  //       , 500);
  // }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { foodstuff } = this.state;

    return <Skeleton loading={this.state.loading} active>
    <Form onSubmit={this.handleSubmit}>
      <Row gutter={20}>
        <Col span={6}>
          <FormItem
            label='Название продукта'
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Введите название' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            label='Категория'
          >
            {getFieldDecorator('category', {
              rules: [{ required: true, message: 'Введите название' }],
            })(
              <Select>
                {Object.keys(FOOD_CATEGORIES).map(key => 
                  <Option key={key} value={parseInt(key, 10)}>{FOOD_CATEGORIES[key]}</Option>)}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        <Button type="primary" loading={this.state.saving} htmlType="submit">{foodstuff.id ? 'Сохранить' : 'Создать'}</Button>
      </Row>
    </Form>
  </Skeleton>
  }
}

const ConnectedForm = connect(
  (state) => ({
    user: state.auth.user,
  }),
  { setHeader }
)(FoodstuffForm)

export default Form.create()(ConnectedForm)
