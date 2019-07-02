import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button, Input, Icon} from 'antd';
import {Link} from 'react-router-dom';


import { fetchUsers } from './dal';
import Dates from '../../utils/dates';
import { setHeader } from '../../app/actions';
import { ROLES_TITLE } from '../../../../static/constants';
import  { VisualTrueFalse } from '../../components';

const Search = Input.Search;

const columns = [{
  title: 'Имя',
  dataIndex: 'name',
  render: (_, u) => <Link to={`/users/${u.id}`}>{u.last_name || '_'} {u.first_name || '_'}</Link>,
  width: '30%',
  sorter: true,
}, {
  title: 'Email',
  dataIndex: 'email',
  width: '20%',
}, {
  title: 'Телефон',
  dataIndex: 'phone',
  width: '15%',
}, {
  title: 'Роль',
  dataIndex: 'role',
  sorter: true,
  render: (role) => ROLES_TITLE[role],
  filters: Object.keys(ROLES_TITLE).map(roleId => ({ text: ROLES_TITLE[roleId], value: roleId})),
  width: '15%',
}, {
  title: 'Активность',
  dataIndex: 'active',
  render: (_, p) => <VisualTrueFalse value={p.active} />,
  width: '10%',
  //sorter: true,
}, {
  title: 'Создан',
  dataIndex: 'created_at',
  sorter: true,
  width: '10%',
  render: (d) => Dates.formatDateTime(d)
}];

const sortDefault = {
  field: "created_at",
  order: "descend"
};

class Users extends Component {

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
  };

  componentDidMount() {
    this.fetch();
    this.props.setHeader({title: 'Пользователи'})
  }

  fetch(param = {}) {
    this.setState({ loading: true });
    const { pagination, sorter } = this.state;
    let filters = {...this.state.filters};
    filters.role = filters.role ? filters.role.map(r => parseInt(r, 10)) : [];
    fetchUsers({ pagination, filters, sorter }).then(response => {
      this.setState({
        loading: false,
        pagination: response.pagination,
        data: response.data
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
    this.props.history.push(`/users/new`);
  }

  render() {
    return <div>
      <div style={{width: 300, float: "left", paddingRight: 20}}>
        <Search placeholder="Поиск" onSearch={this.searchChange} enterButton/>
      </div>
      <div style={{textAlign: 'right', marginBottom: 10,}}>
        <Button onClick={this.createNew.bind(this)} primary={"true"}>Создать<Icon type="plus"/></Button>
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

export default connect(() => ({}), { setHeader })(Users)
