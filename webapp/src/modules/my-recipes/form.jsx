import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton } from 'antd'

import { ROLES, ROLES_TITLE, FOOD_CATEGORIES } from '../../../../static/constants';
import { getRecipe, updateRecipe, addRecipe } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';
import { fetchFoodstuffForSelect } from '../foodstuff/dal'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class MyRecipesForm extends Component {

  state ={
    recipe: { recipe_foodstuffs: [{ recipe_id: 1, foodstuff_id: 1, weight_recipe: 400, weight_portion: 100, foodstuff: { category: 1 } }] },
    loading: true,
    saving: false,
    category: {}
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
            recipe_foodstuffs: recipe.recipe_foodstuffs,
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

  handleCategoryChange(index, key) {
    const { recipe } = this.state;
    recipe.recipe_foodstuffs[index].foodstuff.category = key;
    this.setState({
      recipe,
    })
  }

  handleAddFoodstuff() {
    const { recipe } = this.state;
    recipe.recipe_foodstuffs.push({ foodstuff: { category: 'new' } });
    this.setState({ recipe });
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
      <Row>
      {recipe.recipe_foodstuffs && recipe.recipe_foodstuffs.map((fs, index) =>
        <Row key={index} gutter={20}>
          <Col span={6}>
            <FormItem
              label='Категория'
            >
              {getFieldDecorator(`recipe_foodstuffs[${index}].foodstuff.category`, {
                rules: [{ required: true, message: 'Введите название' }],
              })(
              <Select onChange={this.handleCategoryChange.bind(this, index)} >
                {Object.keys(FOOD_CATEGORIES).map(key => 
                  <Option key={key} value={parseInt(key, 10)}>{FOOD_CATEGORIES[key]}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          {<Col span={6}>
            <FormItem
              label='Продукт'
            >
              {getFieldDecorator(`recipe_foodstuffs[${index}].foodstuff_id`, {
                rules: [{ required: true, message: 'Введите название' }],
              })(
                <DinamicSelect
                fetch={fetchFoodstuffForSelect}
                fetchImmediately
                fetchParam={recipe.recipe_foodstuffs[index].foodstuff.category}
                />
              )}
            </FormItem>
          </Col>}
          <Col span={6}>
          <FormItem
            label='Вес по рецепту'
          >
            {getFieldDecorator(`recipe_foodstuffs[${index}].weight_recipe`, {
              // rules: [{ required: true, message: 'Введите вес' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            label='Вес на порцию'
          >
            {getFieldDecorator(`recipe_foodstuffs[${index}].weight_portion`, {
              // rules: [{ required: true, message: 'Введите вес' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        </Row>)}
        <Button onClick={this.handleAddFoodstuff.bind(this)} >Добавить продукт</Button>
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