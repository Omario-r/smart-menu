import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input, Icon, Radio } from 'antd';
import { Link } from 'react-router-dom';


import { fetchAllMenus, fetchUserMenus } from './dal';
import Dates from '../../utils/dates';
import { setHeader } from '../../app/actions';
import { ROLES_TITLE } from '../../../../static/constants';
import  { VisualTrueFalse } from '../../components';

const Search = Input.Search;


const menuMode = { my: 'my', all: 'all' };

const columns = [{
  title: 'Имя',
  dataIndex: 'name',
  render: (_, u) => <Link to={`/my-food-menu/${u.id}`}>{u.name || '_'}</Link>,
  width: '30%',
  sorter: true,
}];

const sortDefault = {
  field: "created_at",
  order: "descend"
};

class MyFoodMenu extends Component {


  state = {
    data: [],
    pagination: {
      size: 10,
      page: 0
      // current: 1,
      // pageSize: 10
    },
    filters: {
      s: "",
      role: [],
    },
    sorter: sortDefault,
    loading: false,
    status: menuMode.my,
    
  };

  componentDidMount() {
    this.fetch();
    this.props.setHeader({title: 'Список меню', back: true})
  }

  fetch() {
    this.setState({ loading: true });
    const { pagination, sorter, status } = this.state;
    let filters = {...this.state.filters};

    const fetchMenus = status === menuMode.my ? fetchUserMenus : fetchAllMenus;

    // filters.role = filters.role ? filters.role.map(r => parseInt(r, 10)) : [];
    fetchMenus({ pagination, filters, sorter }).then(({ data, pagination }) => {
      this.setState({
        loading: false,
        pagination,
        data,
      });
    });
  }

  searchChange = (value) => {
    const pagination = {...this.state.pagination, current: 1};
    const filters = {...this.state.filters, s: value};
    this.setState({
      filters: filters,
      pagination: pagination
    }, () => {
      this.fetch();
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const copyPagination = {...this.state.pagination, ...pagination};
    const copyFilters = {...this.state.filters, ...filters};
    let copySorter = this.state.sorter;
    if ( Object.keys(sorter).length > 0 ){
      copySorter = {
        field: sorter.field,
        order: sorter.order
      }
    } else {
      copySorter = sortDefault;
    }
    this.setState({
      pagination: copyPagination,
      filters: copyFilters,
      sorter: copySorter
    }, () => {
      this.fetch();
    });
  }

  createNew() {
    this.props.history.push(`/my-food-menu/new`);
  }

  handleMenuTypeChange = (e) => {
    this.setState({
      status: e.target.value
    }, this.fetch)
  }

  render() {
    return <div>
    <div style={{ flexDirection: 'row' }}>
      <div style={{width: 300, float: "left", paddingRight: 20}}>
        <Search placeholder="Поиск" onSearch={this.searchChange} enterButton/>
      </div>
      <Radio.Group defaultValue={menuMode.my} onChange={this.handleMenuTypeChange}>
        <Radio.Button value={menuMode.my} >Мои меню</Radio.Button>
        <Radio.Button value={menuMode.all} >Все меню</Radio.Button>
      </Radio.Group>
      <div style={{float: 'right', marginBottom: 15}}>
        <Button onClick={this.createNew.bind(this)} primary={"true"}>Создать<Icon type="plus"/></Button>
      </div>      
    </div>

    <Table
      columns={columns}
      rowKey={record => record.id}
      dataSource={this.state.data}
      pagination={this.state.pagination}
      loading={this.state.loading}
      onChange={this.handleTableChange}
    />
  </div>
  }
}


export default connect(() => ({}), { setHeader })(MyFoodMenu)