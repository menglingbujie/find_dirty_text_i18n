import React from "react";
import $ from "jquery";

import Config from "./config/config";
import Header from "./header/header";
import Service from "./home/online_service";
import Infodetail from "./info/infodetail";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

let OPTIONS_ENV = (Config && Config.env) ? Config.env : "release";
export default class Info extends ReactServerRenderEntry {
  constructor(props) {
    super(props);
    this.state = {
      is_login: false,
    }
  }
  //去除socketData重复的数据，只留最新的不重复数据
  arrayUniq(arr){
    let newArr = [];
    let obj ={};
    for(let i=arr.length-1;i>0;i--){
      let _d = arr[i];
      let _first = _d.split(",")[0];
      if(!obj[_first]){
        newArr.push(_d);
        obj[_first]=true;
      }
    }
    return newArr;
  }
  getCookie(key){
    var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
  }
  checkTokenExist(){
    //如果token不存在就更新header
    let _token = this.getCookie("token");
    if(!_token){
      if(this.refs.header){
        this.refs.header.doLogout();
      }
    }
  }

  dispatchDataToHeader(){
    if(this.refs.header){
      this.refs.header.dispatchMoneyChange();
    }
  }
  doLoginSuccess() {
    //登录成功刷新日志列表
    //this.updateLogsTable();
  }
  needToLogin(){
    this.unLogin();
    this.refs.header.needToLogin();//弹出登录框
  }
  unLogin() {
    this.setState({is_login: false});
  }

  //componentDidMount(){}
  render() {
    return (
      <article>
         <Header ref="header" isLogin={this.state.is_login}
          doLoginSuccess={this.doLoginSuccess.bind(this)}
          doLoginout={this.unLogin.bind(this)} />
        <div className="container">
          <Infodetail />
        </div>
        <Service/>
      </article>
    );
  }
}
