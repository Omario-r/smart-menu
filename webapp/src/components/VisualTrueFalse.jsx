import {Icon} from "antd";
import React,{Component} from "react";

/*
  Визуальное оформление для значений булева типа
  @param {value} true|false.
  @return {default} Иконку соответствующую значению.
*/

class VisualTrueFalse extends Component{
  state = {
    value: false
  }

  componentDidMount(){
    this.setState({value: this.props.value});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ( this.props.value != nextProps.value ){
      this.setState({value: nextProps.value});
    }
  }

  render() {

    if (this.state.value){
      return <Icon type="check-circle" theme="filled" style={{color:'green'}} />;
    }

    return <Icon type="minus" />;
  }

}

export default VisualTrueFalse