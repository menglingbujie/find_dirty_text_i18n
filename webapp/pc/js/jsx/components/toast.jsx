import React from "react";
import LangClient from '../tools/Lang-Client';

export default class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayStyle:"toast hide",
      msg:"",
    }
    this.hideTimer = null;
  }
  showToast(text){
    if(this.hideTimer){clearTimeout(this.hideTimer)}
    this.setState({displayStyle:"toast show",msg:LangClient.i18n(text)});
    this.hideTimer=setTimeout(function(){
      this.setState({displayStyle:"toast hide",msg:""});
    },5e3)
  }
  componentWillUnmount(){
    if(this.hideTimer){clearTimeout(this.hideTimer)}
  }
  render() {
    return (<div className={this.state.displayStyle}>{this.state.msg}</div>);
  }
}
