import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Row, Col, Button, Switch, message, DatePicker, Radio, Skeleton, Modal, Tabs, Card, Icon } from 'antd'
import { PDFViewer } from '@react-pdf/renderer';


import { ROLES, ROLES_TITLE, WEEK_DAYS, EAT_TIMES } from '../../../../static/constants';
import { addMenu, updateMenu, getMenu, cloneMenu } from './dal';
import { DinamicSelect } from '../../components';
import { setHeader } from '../../app/actions';
import { setMenuForRecipeAdding, unsetMenuForRecipeAdding } from './action';
import PdfMenu from './pdf'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class MyFoodMenuForm extends Component {

  state = {
    menu: { menu_recipes: [] },
    weeks: [],
    loading: true,
    saving: false,
    showRecipeModal: false,
    modalRecipe: { recipe: {} },
    activeWeek: '1',
    activeDay: '0',
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
            if (!day.notEmpty) {
              day.notEmpty = menuRecipes.length > 0 ? true : false;              
            }
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
    const newWeeks = menu.weeks.filter(m => m != weekName);
    menu.weeks = newWeeks;
    this.saveMenu(menu);
  }

  startAddingRecipe(week, day, eat_time) {
    const { menu } = this.state;
    this.props.setMenuForRecipeAdding({ menu_id: menu.id, week, day, eat_time });
    this.props.history.push('/recipes')
  }
  
  finishAddingRecipe() {
    const { addedMenu, newRecipe } = this.props;
    const { menu } = this.state;
    const menuRecipe = { ...addedMenu, recipe_id: newRecipe.id, recipe: newRecipe }
    menu.menu_recipes.push(menuRecipe)
    this.setState({ activeWeek: `${addedMenu.week}`, activeDay: `${addedMenu.day}` })
    this.props.unsetMenuForRecipeAdding();
    this.saveMenu(menu);
  }

  removeRecipe(id) {
    const { menu } = this.state;
    const menu_recipes = menu.menu_recipes.filter(mr => mr.id !== id)
    this.saveMenu( { ...menu, menu_recipes })
  }

  cloneMenu = () => {
    const { menu } = this.state;
    cloneMenu(menu.id)
    .then(() => message.success('Меню успешно скопировано'))
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { menu, weeks, activeWeek, activeDay } = this.state;
    const isMyMenu = menu.owner_id == this.props.user.id || menu.id === undefined;

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
              <Input disabled={!isMyMenu} />
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
              <Input disabled={!isMyMenu} />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{ textAlign: 'center' }}>
        {isMyMenu
          ? <Button type="primary" loading={this.state.saving} htmlType="submit">
                {menu.id ? 'Сохранить' : 'Создать'}
              </Button>
          : <Button type="primary" htmlType="button" onClick={this.cloneMenu}>Забрать себе</Button>}
      </Row>
    </Form>
    <div>
      {isMyMenu && <Button size='small' style={{ marginBottom: 10 }} onClick={this.handleWeekAdd.bind(this)}>
        Добавить неделю
      </Button>}
      <Tabs
        hideAdd
        type={isMyMenu ? 'editable-card' : 'card'}
        onEdit={this.handleWeekRemove.bind(this)} // сюда приходит key={week.weekName} ввиде строки
        activeKey={activeWeek}
        onChange={(aw) => this.setState({ activeWeek: aw })}
      >
      {weeks.map((week, weekIndex) => (
        <TabPane tab={`Неделя ${weekIndex + 1}`} key={week.weekName} >
          <Week 
            week={week}
            addRecipe={this.startAddingRecipe.bind(this)}
            removeRecipe={this.removeRecipe.bind(this)}
            isMyMenu={isMyMenu}
            activeDay={activeDay}
          />
        </TabPane>
      ))}
      </Tabs>
    </div>
      <Button onClick={() => this.props.history.push({ pathname:'/pdf-menu', weeks })}>PDF</Button>
  </Skeleton>
  }
}

class Week extends Component {
  state = {
    activeDay: this.props.activeDay
  }
  render() {
    const { week, addRecipe, removeRecipe, isMyMenu } = this.props;
    const { activeDay } = this.state;
    return <div>
      <Tabs
        tabPosition='left'
        activeKey={activeDay}
        onChange={(d) => this.setState({ activeDay: d })}
      >
        {week.weekDays.map(day => (
          <TabPane tab={`${day.title}`} key={day.id}>
            <Day isMyMenu={isMyMenu} day={day} week={week} addRecipe={addRecipe} removeRecipe={removeRecipe}/>
          </TabPane>
        ))}
      </Tabs>
      
    </div> 
  }
}

class Day extends Component {
  state = {
    modalRecipe: { recipe: {} },
  }

  showRecipeModal(menuRecipe) {
    this.setState({
      showRecipeModal: true,
      modalRecipe: menuRecipe,
    })
  }

  closeResipeModal() {
    this.setState({ showRecipeModal: false })
  }

  render() {
    const { day, week, addRecipe, removeRecipe, isMyMenu } = this.props;
    const { modalRecipe } = this.state;

    const eatTimeCard = (eatTimes) => eatTimes.map(eatTime => 
      <Card
        key={eatTime.name}
        title={eatTime.title}
        style={{ width: 300, marginBottom: 20 }}
        extra={isMyMenu && <Button 
            style={{ marginTop: 5 }} 
            size='small' onClick={addRecipe.bind(null, week.weekName, day.id, eatTime.id)}
          >
            Добавить блюдо
          </Button>}
      >
        {eatTime.menuRecipes.map((menuRecipe, i) =>
          <div key={i}>
            <span>{menuRecipe.recipe.name}</span>
            <a onClick={this.showRecipeModal.bind(this, menuRecipe)}> рецепт {menuRecipe.portion}</a>
            {isMyMenu && <Icon style={{ marginLeft: 3 }} type="close-circle"  onClick={removeRecipe.bind(null, menuRecipe.id)} />}
          </div>)}
      </Card>)

    return <div>    
      <Row><h2>{day.title}</h2></Row>
      <Row gutter={24}>
        <Col span={6} >
          {eatTimeCard(day.eatTimes.filter((d, i) => (i + 2) % 2 === 0))}
        </Col >
        <Col style={{ paddingLeft: 50 }} span={6} >
          {eatTimeCard(day.eatTimes.filter((d, i) => (i + 2) % 2 !== 0))}
        </Col>
      </Row>
      <Modal
        title={modalRecipe.recipe.name}
        visible={this.state.showRecipeModal}
        // onOk={this.closeResipeModal.bind(this)}
        onCancel={this.closeResipeModal.bind(this)}
        footer={null}
        closable
        maskClosable
      >
        {modalRecipe.recipe.name}
      </Modal>
    </div>
    
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