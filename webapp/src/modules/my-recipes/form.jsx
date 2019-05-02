import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton } from 'antd'
import { ROLES, ROLES_TITLE } from '../../../../static/constants';
import { getRecipe, updateRecipe, addRecipe } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class MyRecipesForm extends Component {

  state ={
    recipe: {},
    loading: true,
    saving: false
  }


  componentDidMount() {
    const { id } = this.props.match.params;
    if (id === 'new') {
      this.props.setHeader({ title: 'Новый рецепт', back: true, });
      this.setState({ loading: false })
    } else {
      this.loadRecipe(id);
    }
  }

  loadRecipe(id) {
    getRecipe(id).then(({ data: recipe }) => {
      this.setState({
        recipe,
        loading: false
      }, () => { 
          this.props.form.setFieldsValue({
            name: recipe.name,
          });
      });
      this.props.setHeader({ title: `Рецепт: ${recipe.name}`, back: true, });
    })
  }


  handleSubmit = (e) => {
    const { getFieldValue, validateFields } = this.props.form;
    const { id } = this.props.match.params;
    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;
      
      this.setState({ saving: true })
      const recipeProcess = (id === 'new' ? addRecipe(values) : updateRecipe(id, values));
      const onSavingMesage = (id === 'new'? 'Рецепт создан': 'Рецепт сохранен' );

      recipeProcess.then(({ data: recipe }) => {
        message.success(onSavingMesage);
        this.props.history.replace(`/my-recipes/${recipe.id}`);
        this.props.setHeader({ title: `Рецепт: ${recipe.name}`, back: true });
        this.setState({ recipe, saving: false });
      })
    });
  }




  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { recipe } = this.state;

    return <Skeleton loading={this.state.loading} active>
    <Form onSubmit={this.handleSubmit}>
      <Row gutter={20}>
        <Col span={6}>
          <FormItem
            label='Название Рецепта'
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Введите название' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        <Button type="primary" loading={this.state.saving} htmlType="submit">{recipe.id ? 'Сохранить' : 'Создать'}</Button>
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
)(MyRecipesForm)

export default Form.create()(ConnectedForm)