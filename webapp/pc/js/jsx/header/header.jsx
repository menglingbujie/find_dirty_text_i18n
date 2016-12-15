import React from "react";
import $ from "jquery";
import Country from "../data/country";
import OptionsNav from "./bar_nav";
import LoginBar from "./login";
import UnLoginBar from "./unlogin";
import OptionsLangs from "./panel_langs";

import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_login: -1,
      symbol: "down",
      lang: ""
    }

    this.isOpenLangPanel = false;

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let curProps = this.props;
    let curState = this.state;
    if (nextProps && nextState && curProps.isLogin == nextProps.isLogin && curState.is_login == nextState.is_login && curState.symbol == nextState.symbol && curState.lang == nextState.lang) {
      return false;
    }

    return true;
  }

  doLoginSuccess(userinfo) {
    this.setState({is_login: 1, userinfo: userinfo})
    if (this.props.doLoginSuccess && typeof(this.props.doLoginSuccess) == "function") {
      this.props.doLoginSuccess();
    }
  }

  doLogout() {
    Cookie.deleteCookie("token");
    if (this.state.is_login != 0) {
      // this.props.doLoginout()方法会导致图表的刷新，所以尽量不要重复执行下面的逻辑
      this.setState({is_login: 0});
      if (this.props.doLoginout && typeof(this.props.doLoginout) == "function") {
        this.props.doLoginout();
      }
    }
  }

  resetSymbole() {
    this.isOpenLangPanel = false;
    this.setState({symbol: "down"});
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }
  componentWillMount() {
    this.state.lang = LangClient.states.lang;
  }
  componentDidMount() {
    //let _language = Cookie.getCookie("language");
    let _language = Cookie.getCookie("language");

    let _needToLogin = sessionStorage.getItem("need_to_login");
    if (_needToLogin) {
      this.setState({is_login: 0});
      sessionStorage.removeItem("need_to_login");
      Cookie.deleteCookie("token");
      this.needToLogin();
      return;
    }

    let _token = Cookie.getCookie("token");
    let _userinfo = Cookie.getCookie("userinfo");
    if (_token) {
      //如果有token没有userinfo，则需要拿着token去请求用户信息并存cookie
      //if(!_userinfo){

      // 从demo平台跳转过来的时候会带着token参数，这个时候不管有没有userinfo的cookie，都要重新请求一次
      if (true) {
        var _isDev = Config.env;
        var _host = Config.host[_isDev];
        var _url = "//" + _host + Config.api.user.get_uinfo_by_token;
        $.get(_url, {
          token: _token,
          lang: _language
        }, (resp) => {
          if (resp.status != 1) {
            this.showToast(resp.msg);
            if (resp.status == 0 || resp.status == "0") {
              Cookie.deleteCookie("token");
              this.doLogout();
            }
            return;
          }
          // 检查一下返回用户信息的合法性
          let email = resp.data.email;
          let firstName = resp.data.first_name;
          let lastName = resp.data.last_name;

          if ((!email || email.length == 0) || ((!firstName || firstName.length == 0) && (!lastName || lastName.length == 0))) {
            Cookie.deleteCookie("token");
            this.doLogout();
            return;
          }

          Cookie.setCookie("userinfo", JSON.stringify(resp.data), 7200);
          this.doLoginSuccess(resp.data);
        })
      } else {
        this.doLoginSuccess(JSON.parse(_userinfo));
      }
    } else {
      this.doLogout();
    }
  }

  componentDidUpdate() {
    // 为了兼容IE10上react渲染出的img标签中带有width、height属性，导致图片显示不正确的问题，2016-9-30，李猛
    $("#id_ultra_icon").removeAttr("width");
    $("#id_ultra_icon").removeAttr("height");
    $("#id_flag_icon").removeAttr("width");
    $("#id_flag_icon").removeAttr("height");
  }

  openLangsPanel(evt) {
    evt.stopPropagation();

    if (this.refs.panel_langs) {
      this.refs.panel_langs.toggleShow();
    }

    this.isOpenLangPanel = !this.isOpenLangPanel;
    if (this.isOpenLangPanel) {
      this.setState({symbol: "up"});
    } else {
      this.setState({symbol: "down"});
    }
  }

  needToLogin() {
    setTimeout(() => {
      if (this.refs.login) {
        this.setState({is_login: 0});
      }

      if (this.refs.unlogin) {
        this.refs.unlogin.doOpenLoginDialog();
      }
    }, 100)
  }

  dispatchMoneyChange() {
    if (this.refs.login) {
      this.refs.login.dispatchMoneyChange();
    }
  }

  onClickMenu(itemId) {
    switch (itemId) {
      case 1:
        // 提现
        this.gotoWidthdrawal();
        break;
      case 2:
        // 切换模拟账户
        this.convertToDemoUser();
        break;
      case 3:
        // 退出
        if (this.refs.login) {
          this.refs.login.doLogout();
        }
        break;
      case 4:
        // 个人中心
        this.gotoProfile();
        break;
      default:
        break;
    }
  }

  convertToDemoUser() {
    let _token = Cookie.getCookie("token") || "";
    if (!_token) {
      this.needToLogin();
      return
    }

    let _language = Cookie.getCookie("language") || "";

    let _demoTradeUrl = "//" + Config.host[Config.env + "_host"] + "/trade?token=" + _token;
    if (_language && _language.length > 0) {
      _demoTradeUrl += ("&lang=" + _language);
    }
    location.href = _demoTradeUrl;
  }

  gotoWidthdrawal() {
    //withdraw need to judage full userinfo
    //else need to show cpl dialog
    // if(this.refs.login){
    //   if (this.refs.login.isShowCplDialog()) {
    //     this.refs.login.showCplUserInfoDialog();
    //     return;
    //   }
    // }

    let _base_url = "/pay/withdraw?access-token=";
    let _token = Cookie.getCookie("token");
    if (_token) {
      // let _url = _base_url + _token.replace(/^Bearer /, "") + "&lang=" + global.gLang;
      let _url = _base_url + _token.replace(/^Bearer /, "");
      setTimeout(() => {
        sessionStorage.setItem("sub_nav", -1);
        location.href = _url;
      }, 200);
    } else {
      this.needToLogin();
    }
  }

  gotoProfile() {
    location.href = "/profile";
  }

  getTimeStamp() {
    if (this.props.hasOwnProperty("getTimeStamp")) {
      return this.props.getTimeStamp();
    }
    return 0;
  }

  onPositionClosed() {
    if (this.refs.login) {
      this.refs.login.onPositionClosed();
    }
  }

  render() {
    let _state = this.state;
    let _loginState = _state.is_login;
    let _loginTpl = "";
    if (_loginState == 1) {
      _loginTpl = (<LoginBar ref="login" userinfo={_state.userinfo} doLogout={this.doLogout.bind(this)} needToLogin={this.needToLogin.bind(this)} onClickMenu={this.onClickMenu.bind(this)} getTimeStamp={this.getTimeStamp.bind(this)}/>);
    } else if (_loginState == 0) {
      _loginTpl = (<UnLoginBar ref="unlogin" doLoginSuccess={this.doLoginSuccess.bind(this)}/>);
    }
    //匹配当前语言
    let _langCode = "";
    let _countryData = [];
    for (let key in Country) {
      _countryData.push({key: key, name: Country[key].name, lang: Country[key].lang});
      //通过lang找到国家的缩写，旗子是用这个缩写显示的
      if (_state.lang == Country[key].lang) {
        _langCode = key;
      }
    }
    let _firstFlag = "icon flag " + _langCode.toLowerCase();
    let _logo = this.urlCdn + "/pc/images/ultra_logo.png";
    if (_state.lang == "zh-CN" || _state.lang == "zh-TW" || _state.lang == "zh-HK") {
      _logo = this.urlCdn + "/pc/images/ultra_logo_cn.png";
    }

    let symbolCss = "symble " + this.state.symbol;
    return (
      <header>
        <div className="h_1">
          <div className="wrap">
            <a href="/" className="logo"><img style={{display: "none"}} id="id_ultra_icon" src={_logo}/></a>

            <a href="#" className="flag" style={{display: "none"}} id="flagId" onClick={this.openLangsPanel.bind(this)}>
              <i id="id_flag_icon" className={_firstFlag}></i>
              <i className={symbolCss}></i>
            </a>

            <a href="#" className="service">
              <span>{LangClient.i18n("Customer Service")}</span>
            </a>
            {_loginTpl}
          </div>
        </div>
        <OptionsNav needToLogin={this.needToLogin.bind(this)}/>
        <OptionsLangs ref="panel_langs" countries={_countryData} resetSymbole={this.resetSymbole.bind(this)}/>
      </header>
    );
  }
}
