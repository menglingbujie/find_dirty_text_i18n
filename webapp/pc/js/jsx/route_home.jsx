import React from "react";
import $ from "jquery";

import Config from "./config/config";
import Header from "./header/header";
import Service from "./home/online_service";
import SectionReg from "./home/section_reg";
import SectionUsers from "./home/section_users";
import SectionTrade from "./home/section_trade";

import Carousel from "./components/carousel";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

let OPTIONS_ENV = (Config && Config.env) ? Config.env : "release";
export default class Home extends ReactServerRenderEntry {
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

  componentDidMount(){

  }
  render() {
    return (
      <article>
        <Header ref="header" isLogin={this.state.is_login}
          doLoginSuccess={this.doLoginSuccess.bind(this)}
          doLoginout={this.unLogin.bind(this)} />
        <div className="container">
          <div className="section banner">
            <div className="carousel"><Carousel /></div>
            <div className="wrap">
              <div className="description">
                <div id="freedom">{LangClient.i18n("YOU DESERVE THE FREEDOM")}</div>
                <div id="earnMoney">{LangClient.i18n("Earn Money Anytime And Anywhere")}</div>
                <em className="info"></em>
                <a href="/user/reg" className="btn reg">
                  {/* {LangClient.i18n("Sign up and get a free $1,000 demo account,")}
                  {LangClient.i18n("Get $100 gift in real account")} */}
                  {LangClient.i18n("Free Insurance, reduce your investments’ risk")}
                </a>
              </div>
            </div>
          </div>
          <SectionReg />
          <div className="section how_to_earn">
            <div className="wrap">
              <h1>{LangClient.i18n("Make money in just 3 steps!")}</h1>
              <ul className="panel_step">
                <li><div>
                  <i className="icon home md_file"></i>
                  <div className="title">1. {LangClient.i18n("Sign Up")}</div>
                  <div className="desc">{LangClient.i18n("Sign up in 30 seconds")}</div>
                </div></li>
                <li><div>
                  <i className="icon common lg_arrow_right left"></i>
                  <i className="icon common lg_arrow_right right"></i>
                  <i className="icon home md_pig"></i>
                  <div className="title">2. {LangClient.i18n("Demo/real account")}</div>
                  <div className="desc">{LangClient.i18n("Enter the demo or live account for the trading experience")}</div>
                </div></li>
                <li><div>
                  <i className="icon home md_user"></i>
                  <div className="title">3. {LangClient.i18n("Make a deposit")}</div>
                  <div className="desc">{LangClient.i18n("Deposit and make money")}</div>
                </div></li>
              </ul>
            </div>
          </div>
          <SectionTrade />
          <div className="section strengths">
            <div className="wrap">
              <div className="title">{LangClient.i18n("A simple and reliable funds' withdrawing system")}</div>
              <ul className="list">
                <li><i className="icon common sm_ok"></i>{LangClient.i18n("More than 70 assets for trading")}</li>
                <li><i className="icon common sm_ok"></i>{LangClient.i18n("A wide range of analysis tools")}</li>
                <li><i className="icon common sm_ok"></i>{LangClient.i18n("Earn as much as 90% on your invested capital")}</li>
                <li><i className="icon common sm_ok"></i>{LangClient.i18n("The platform is suitable for both professionals and beginners")}</li>
                <li><i className="icon common sm_ok"></i>{LangClient.i18n("Fast withdraw in 2 hours")}</li>
              </ul>
            </div>
          </div>
          <SectionUsers />
          <div className="section reward">
            <div className="wrap">
              <div className="item">
                <div className="info">
                  <i className="icon home sm_file"></i>
                  <div className="text">
                    <div className="title">{LangClient.i18n("SIGN UP")}</div>
                    <div className="desp">{LangClient.i18n("Sign up to get $1000 bonus")}</div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="info">
                  <i className="icon home sm_pig"></i>
                  <div className="text">
                    <div className="title">{LangClient.i18n("INSURANCE")}</div>
                    <div className="desp">{LangClient.i18n("Free Insurance, reduce your investments’ risk")}</div>
                  </div>
                </div>
              </div>
              <div className="item item_last">
                <div className="info">
                  <i className="icon home sm_user"></i>
                  <div className="text">
                    <div className="title">{LangClient.i18n("IB  Affiliate Program")}</div>
                    <div className="desp">{LangClient.i18n("Invite friends to get a gift")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section glory">
            <div className="title">{LangClient.i18n("We won international awards")}</div>
            <ul className="list_glory">
              <li><i className="icon home glory g1"></i></li>
              <li><i className="icon home glory g2"></i></li>
              <li><i className="icon home glory g3"></i></li>
              <li><i className="icon home glory g4"></i></li>
              <li><i className="icon home glory g5"></i></li>
            </ul>
          </div>
        </div>
        <Service/>
      </article>
    );
  }
}
