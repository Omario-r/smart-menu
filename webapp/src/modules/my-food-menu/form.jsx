import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton } from 'antd'
import { ROLES, ROLES_TITLE, WEEK_DAYS, EAT_TIMES } from '../../../../static/constants';
import { addMenu, updateMenu, getMenu } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';
import { setMenuForRecipeAdding, unsetMenuForRecipeAdding } from './action';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class MyFoodMenuForm extends Component {

  state ={
    menu: { menu_recipes: [] },
    weeks: [],
    loading: true,
    saving: false
  }

  
  componentDidMount() {
    const { id } = this.props.match.params;
    const { addedMenu, newRecipe } = this.props;
    if (id === 'new') {
      this.props.setHeader({ title: 'Новое меню', back: true, });
      this.setState({ loading: false })
    } else {
      this.loadMenu(id)
        .then(() => {
          if (newRecipe && addedMenu.menu_id == id) {
            this.finishAddingRecipe()
          }
        })
    }
  }

  makeMenuTree() {
    const { menu } = this.state;
    // console.log('menu rec', menu.menu_recipes)
    const weeks = menu.weeks.map((weekName, weekIndex) => {
      const days = WEEK_DAYS.map((day, dayIndex) => {
        const times = EAT_TIMES.map((eatTime, etIndex) => {
          const menuRecipes = menu.menu_recipes.filter(menuRecipe => {
            const isThisWeek = menuRecipe.week === weekName;
            const isThisDay = menuRecipe.day === day.id;
            const isThisEatTime = menuRecipe.eat_time === eatTime.id;
            return isThisWeek && isThisDay && isThisEatTime;
          })
            .map(menuRecipe => {
              menuRecipe.recipe.recipe_foodstuffs.map(fs => ({...fs, weight_menu: fs.weght_portion * menuRecipe.portions}));
              return menuRecipe;
            });
          return { ...eatTime, menuRecipes: [...menuRecipes] };
        })
        return { ...day, eatTimes: [...times] };
      })
      return { weekName, weekDays: [...days] };
    })
    this.setState({ weeks });
  }

  loadMenu(id) {
    return getMenu(id).then(({ data: menu }) => {
      this.setState({
        menu,
        loading: false
      }, () => { 
          this.props.form.setFieldsValue({
            name: menu.name,
            description: menu.description,
          });
          this.makeMenuTree();
      })
      this.props.setHeader({ title: `Меню: ${menu.name}`, back: true, });
    })
  }


  handleSubmit = (e) => {
    const { getFieldValue, validateFields } = this.props.form;
    const { id } = this.props.match.params;
    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;

      values.menu_recipes = this.state.menu.menu_recipes;
      values.weeks = this.state.menu.weeks;
      
      this.setState({ saving: true })

      if (id !== 'new') {
        return updateMenu(id, values)
          .then(() => {
            this.setState({ saving: false });
            message.success('Меню сохранено');
          })
      }

      addMenu(values).then(({ data: menu }) => {
        message.success('Меню создано');
        this.props.history.replace(`/my-food-menu/${menu.id}`);
        this.props.setHeader({ title: `Меню: ${menu.name}`, back: true });
        this.setState({ menu, saving: false });
      })
    });
  }

  saveMenu(menu) {
    const { id } = this.props.match.params;
    this.setState({ menu }, () => {
      this.makeMenuTree();
      updateMenu(id, this.state.menu)
        .then(() => {
          message.success('Меню сохранено');
        })
    })
  }

  handleWeekAdd() {
    const { menu } = this.state;
    const lastWeek = menu.weeks.length ? menu.weeks[menu.weeks.length - 1] : 0;
    menu.weeks.push(lastWeek + 1);
    this.saveMenu(menu);
  }

  handleWeekRemove(weekName) {
    const { menu } = this.state;
    const newWeeks = menu.weeks.filter(m => m !== weekName);
    menu.weeks = newWeeks;
    this.saveMenu(menu);
  }

  startAddingRecipe(week, day, eat_time) {
    const { menu } = this.state;
    this.props.setMenuForRecipeAdding({ menu_id: menu.id, week, day, eat_time });
    this.props.history.push('/my-recipes')
  }

  finishAddingRecipe() {
    const { addedMenu, newRecipe } = this.props;
    const { menu } = this.state;
    const menuRecipe = { ...addedMenu, recipe_id: newRecipe.id, recipe: newRecipe }
    menu.menu_recipes.push(menuRecipe)
    this.props.unsetMenuForRecipeAdding();
    this.saveMenu(menu);
  }

  handleShowRecipeModal() {
    
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { menu, weeks } = this.state;
    // console.log('menu >>', menu)

    return <Skeleton loading={this.state.loading} active>
    <Form onSubmit={this.handleSubmit}>
      <Row gutter={20}>
        <Col span={6}>
          <FormItem
            label='Название Меню'
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
            label='Описание Меню'
          >
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Введите описание' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        <Button type="primary" loading={this.state.saving} htmlType="submit">{menu.id ? 'Сохранить' : 'Создать'}</Button>
      </Row>
    </Form>
    <div>
      {weeks.map((week, indexWeek) => <div key={week.weekName}>

        <h2>Неделя {week.weekName}</h2>
        <Button onClick={this.handleWeekRemove.bind(this, week.weekName)}>Удалить неделю</Button>

        {week.weekDays.map(day => <div key={day.name}>
          <h3>{day.title}</h3>
          {day.eatTimes.map(eatTime => <div style={{ paddingLeft: 20 }} key={eatTime.name}>
            <h4>{eatTime.title}</h4>
            <Button onClick={this.startAddingRecipe.bind(this, week.weekName, day.id, eatTime.id)}>Добавить рецепт</Button>
            {eatTime.menuRecipes.map((menuRecipe, i) =>
              <div key={i}>
                <a onClick={()=> console.log('reci', menuRecipe.recipe.name)}> рецепт {menuRecipe.recipe.name} {menuRecipe.portion}</a>
              </div>)}
          </div>)}
        </div> )}
      </div>)}
      <Button onClick={this.handleWeekAdd.bind(this)}>Добавить неделю</Button>
    </div>
  </Skeleton>
  }
}


const ConnectedForm = connect(
  (state) => ({
    user: state.auth.user,
    addedMenu: state.addingRecipe.menu,
    newRecipe: state.addingRecipe.recipe,
  }),
  { setHeader, setMenuForRecipeAdding, unsetMenuForRecipeAdding }
)(MyFoodMenuForm)

export default Form.create()(ConnectedForm)