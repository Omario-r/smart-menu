import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton, Icon } from 'antd'

import { ROLES, ROLES_TITLE, FOOD_CATEGORIES } from '../../../../static/constants';
import { getRecipe, updateRecipe, addRecipe } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';
import { fetchFoodstuffForSelect } from '../foodstuff/dal'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class MyRecipesForm extends Component {

  state ={
    recipe: { recipe_foodstuffs: [{ recipe_id: 1, foodstuff_id: 1, weight_recipe: 400, weight_portion: 100, foodstuff: { category: 1 } }] },
    loading: true,
    saving: false,
    category: {},
    edit: false,
  }


  componentDidMount() {
    const { id } = this.props.match.params;
    if (id === 'new') {
      this.props.setHeader({ title: 'Новый рецепт', back: true, });
      this.setState({ loading: false, edit: true })
    } else {
      this.loadRecipe(id);
    }
  }

  loadRecipe(id) {
    getRecipe(id).then(({ data: recipe }) => {
      this.setState({
        recipe,
        loading: false
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

      if (id !== 'new') {
        return updateRecipe(id, values)
          .then(() => {
            message.success('Рецепт сохранен' );
            this.setState({ saving: false });
          })
      }
      addRecipe(values).then(({ data: recipe }) => {
        message.success('Рецепт создан');
        this.props.history.replace(`/my-recipes/${recipe.id}`);
        this.props.setHeader({ title: `Рецепт: ${recipe.name}`, back: true });
        this.setState({ saving: false });
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

  handleRemoveFoodstuff(index) {
    const { recipe } = this.state;
    recipe.recipe_foodstuffs = recipe.recipe_foodstuffs.filter((r, i) => i !== index);
    this.setState({ recipe },
      () => this.props.form.setFieldsValue({
          recipe_foodstuffs: recipe.recipe_foodstuffs,
        }));
  }

  handleEditRecipe() {
    const { recipe } = this.state;
    this.setState({ edit: true },
      () => this.props.form.setFieldsValue({
        name: recipe.name,
        portions: recipe.portions,
        description: recipe.description,
        recipe_foodstuffs: recipe.recipe_foodstuffs,
      })
      )
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { recipe, edit } = this.state;

    return <Skeleton loading={this.state.loading} active>
    {edit ? <Form onSubmit={this.handleSubmit}>
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
        <Col span={2}>
          <FormItem
            label='Количество порций по рецепту'
          >
            {getFieldDecorator('portions', {
              rules: [{ required: true, message: 'Введите количество порций на которое расчитан рейепт' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={3}><span>Категория:</span></Col>
        <Col span={3}><span>Продукт:</span></Col>
        <Col span={3}><span>Вес по рецепту, г:</span></Col>
        {/* <Col span={3}><span>Вес на порцию, г:</span></Col> */}
      </Row>
      <Row>
      {recipe.recipe_foodstuffs && recipe.recipe_foodstuffs.map((fs, index) =>
        <Row key={index} gutter={20}>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator(`recipe_foodstuffs[${index}].foodstuff.category`, {
                rules: [{ required: true, message: 'Выберите категорию продукта' }],
              })(
              <Select size='small' onChange={this.handleCategoryChange.bind(this, index)} >
                {Object.keys(FOOD_CATEGORIES).map(key => 
                  <Option key={key} value={parseInt(key, 10)}>{FOOD_CATEGORIES[key]}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator(`recipe_foodstuffs[${index}].foodstuff_id`, {
                rules: [{ required: true, message: 'Выберите продукт' }],
              })(
                <DinamicSelect
                size='small'
                fetch={fetchFoodstuffForSelect}
                fetchImmediately
                fetchParam={recipe.recipe_foodstuffs[index].foodstuff.category}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator(`recipe_foodstuffs[${index}].weight_recipe`, {
                rules: [{ required: true, message: 'Введите вес' }],
              })(
                <InputNumber size='small'/>
              )}
            </FormItem>
          </Col>
          {/* <Col span={3}>
            <FormItem>
              {getFieldDecorator(`recipe_foodstuffs[${index}].weight_portion`, {
                // rules: [{ required: true, message: 'Введите вес' }],
              })(
                <Input size='small'/>
              )}
            </FormItem>
          </Col> */}
          <Col span={4}>
            <FormItem>
             <Icon onClick={this.handleRemoveFoodstuff.bind(this, index)} type="minus-circle" />                
            </FormItem>
          </Col>
        </Row>)}
        <Button onClick={this.handleAddFoodstuff.bind(this)} >Добавить продукт</Button>
      </Row>
      <Row>
      <Col span={10}>
          <FormItem
            label='Описание рецепта'
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Введите описание' }],
            })(
              <TextArea autosize={{ minRows: 6, maxRows: 20 }} />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        <Button type="primary" loading={this.state.saving} htmlType="submit">{recipe.id ? 'Сохранить' : 'Создать'}</Button>
      </Row>
    </Form>
    :
    <Row>
      <h2>Рецепт {recipe.name}:</h2>
      <br/>
      <h4>Состав рецепта на {recipe.portions} порции:</h4>
      {recipe.recipe_foodstuffs.map((fs) => <div key={fs.id}>
        <span>{fs.foodstuff.name}: {fs.weight_recipe} г.</span>
      </div>)}
      <br/>
      <h4>Описание рецепта:</h4>
      <p>{recipe.description}</p>
      <Row>
        <Button onClick={this.handleEditRecipe.bind(this)} >Редактировать рецепт</Button>        
      </Row>
    </Row>}
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