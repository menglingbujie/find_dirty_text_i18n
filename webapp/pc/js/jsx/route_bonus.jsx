import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Header from "./header/header";
import Service from "./home/online_service";
import Cookie from "./tools/cookie";

import Config from "./config/config";

import DialogWarmTips from "./dialog/dg_warm_tips";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

export default class Bonus extends ReactServerRenderEntry {
  constructor(props){
    super(props);
    this.state = {
      is_login: false,
    }

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
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
  showDialog() {
    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogWarmTips title={LangClient.i18n("Warm Tips")} msg={LangClient.i18n("The Bonus Activity Has Ended.")} />, document.getElementById("dialogContainerId"));
  }
  componentDidMount(){
    this.showDialog();

    let _language = Cookie.getCookie("language");
    let _langLower = _language;

    if(_langLower=="zh-CN"||_langLower=="zh-TW"||_langLower=="zh-HK"){
      $("#bonusId").attr("src",this.urlCdn+"/pc/images/bonus_cn.jpg");
    }else if(_langLower =="en"){
      $("#bonusId").attr("src",this.urlCdn+"/pc/images/bonus_en.jpg");
    }else if(_langLower == 'pl'){
      $("#bonusId").attr("src",this.urlCdn+"/pc/images/bonus_pl.jpg");
    }else{
      $("#bonusId").attr("src",this.urlCdn+"/pc/images/bonus_pt.jpg");
    }

  }
  render(){
    let _bonusImg = this.urlCdn+"/pc/images/bonus_en.jpg";
    return(
      <article>
        <Header ref="header" isLogin={this.state.is_login} doLoginSuccess={this.doLoginSuccess.bind(this)} doLoginout={this.unLogin.bind(this)} />
        <div className="container">
            <a className="btnReg1" href="/user/reg"></a>
            <img src={_bonusImg} id="bonusId"/>
            <a className="btnReg2" href="/user/reg"></a>
        </div>
        <Service/>
      </article>
    )
  }
}
