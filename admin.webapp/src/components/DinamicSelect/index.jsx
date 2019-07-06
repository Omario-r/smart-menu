import React, { Component } from 'react';
import { Form, Input, Icon, Row, Col, Button, Skeleton, Switch,
  Select, DatePicker } from 'antd';

const Option = Select.Option;

class DinamicSelect extends Component {
  constructor(props) {
    super(props);
    let data = [];
    if (props.initialData) {
      data = [props.initialData];
    }
    this.state = {
      data,
      value: props.value,
      request: false,
    }
  }

  componentDidMount() {
    if ((this.props.fetchParam && !this.props.search) || this.props.fetchImmediately) {
      this.fetch(this.props.fetchParam);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.fetchParam !== nextProps.fetchParam) {
      //console.log('NEXT PID',nextProps.fetchParam);
      this.fetch(nextProps.fetchParam);
      this.setState({ data: [], value: undefined });
    }
    if (this.props.value !== nextProps.value) {
      //console.log('NEXT VALUE', nextProps.value);
      this.setState({ value: nextProps.value })
    }
    if (this.props.initialData !== nextProps.initialData && this.props.initialData === undefined) {
      this.setState({
        data: [nextProps.initialData],
        value: nextProps.initialValue.value,
      })
    }
  }

  handleSearch = (value) => {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.fetch.bind(this, value), 700);
  }

  fetch(value) {
    this.setState({ request: true });
    this.props.fetch(value).then(data => {
      this.setState({
        request: false,
        data
      });
    });
  }

  handleChange = (value) => {
    // FIXME: Приходит не то когда меняется fetchParam
    //console.log('v',value);
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    //console.log('value ', this.props.value, this.state.data);
    const { allowClear, search, value, onChange, onSearch, ...otherProps } = this.props;
    const options = this.state.data.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>);
    return (
      <div style={{ position: 'relative' }}>
        <Select
          allowClear={allowClear}
          showSearch={search}
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          notFoundContent={null}
          value={this.state.value}
          {...otherProps}
        >
          {options}
        </Select>
        {this.state.request &&
          <Icon type="loading" style={{ position: 'absolute', right: 30, top: 10 }} className="primary-color" />
        }
      </div>
    );
  }
}

export default DinamicSelect
