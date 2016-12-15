import React from "react";
import $ from "jquery";
import LangClient from "../tools/Lang-Client";
import Config from "../config/config";

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: -1, // 0：未登录，1：登录，-1：还未获取当前登录状态
      money: 0,
      currency_symbol: ""
    };

    this.timer = 0;
  }

  componentDidMount() {
    this.fetchUserInfo();

    this.timer = setInterval(() => {
      this.fetchUserInfo();
    }, 15000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchUserInfo() {
    let _language = Cookie.getCookie("language") || "en";
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.setStateEx(false, null);
      return;
    }

    var _url = "//" + Config.host[Config.env] + Config.api.user.get_uinfo_by_token;
    $.get(_url, {
      token: _token,
      lang: _language
    }, (resp) => {
      if (resp.status != 1) {
        this.setStateEx(false, null);
        return;
      }

      // 检查一下返回用户信息的合法性
      let email = resp.data.email || "";
      let firstName = resp.data.first_name || "";
      let lastName = resp.data.last_name || "";

      if ((!email || email.length == 0) || ((!firstName || firstName.length == 0) && (!lastName || lastName.length == 0))) {
        this.setStateEx(false, null);
        return;
      }

      this.setStateEx(true, resp.data);
    })
  }

  setStateEx(login, userinfo) {
    if (login) {
      this.setState({
        isLogin: 1,
        money: userinfo.balance || 0,
        currency_symbol: userinfo.currency_symbol || ""
      });
      Cookie.setCookie("userinfo", JSON.stringify(userinfo), 7200);
    } else {
      this.setState({isLogin: 0});
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
    }
  }

  render() {
    let userinfo = Cookie.getCookie("userinfo");
    let userInfoObj = null;
    try {
      userInfoObj = (userinfo && JSON.parse(unescape(userinfo))) || null;
    } catch (e) {
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
    }

    let isLogin = (userInfoObj && userInfoObj.email)
      ? true
      : false;

    let account = "";
    let balance = "";
    if (isLogin) {
      account = LangClient.i18n("Real account") + ": " + userInfoObj.first_name + " " + userInfoObj.last_name;
      balance = LangClient.i18n("Balance") + ": " + (this.state.currency_symbol || "") + (this.state.money || 0);
    }

    let loginCss = isLogin
      ? "login"
      : "login hide";
    let unLoginCss = isLogin
      ? "unlogin hide"
      : "unlogin";

    return (
      <div id="id_trade_header" className="header">
        <div className={loginCss}>
          <div className="info">
            <span className="account">{account}</span>
            <span className="balance">{balance}</span>
          </div>
          <a className="btn deposit" href="/mobile/pay/deposit">{LangClient.i18n("Deposit")}</a>
        </div>
        <div className={unLoginCss}>
          <a className="btn login" href="/mobile/user/login?backurl=trade">{LangClient.i18n("LOGIN")}</a>
        </div>
      </div>
    );
  }
}
