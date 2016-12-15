import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Login from "../users/login";

export default class UnLoginBar extends React.Component {
  constructor(props) {
    super(props);
    this.error = "";

    var _isDev = Config.env;
    var _host = Config.host[_isDev];
    this.state={
      login_google:"//"+_host+Config.api.user.login_google,
      login_facebook:"//"+_host+Config.api.user.login_facebook,
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.onKeyDown, false);
  }

  onKeyDown(event) {
    if (event.keyCode == 13) {
      if ($('#dialogContainerId').is(':hidden')) {
        $('.btn.login').click();
      }
    }
  }

  doOpenLoginDialog(account, password, errmsg) {
    let _account = account || "";
    let _password = password || "";
    let _errmsg = errmsg || "";

    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <Login account={_account} password={_password} errmsg={_errmsg} onLoginSuccess={this.doLoginSuccess.bind(this)}/>, document.getElementById("dialogContainerId"));
  }

  doLoginSuccess(userinfo) {
    this.props.doLoginSuccess(userinfo);
  }

  needShowDialog() {
    this.error = "";
    var _email = this.refs.account.value;
    var _password = this.refs.password.value;

    if (!_email || _email.length == 0 || !_password || _password.length == 0) {
      return true;
    }

    let emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailValid.test(_email)) {
      return true;
    }

    return false;
  }

  doLogin() {
    try {
      ga("send", "event", "btn_login");
    } catch (e) {}

    var _isDev = Config.env;
    var _host = Config.host[_isDev];
    var _url = "//" + _host + Config.api.user.login;
    var _email = this.refs.account.value;
    var _password = this.refs.password.value;

    let _postData = {
      "LoginForm[email]": _email,
      "LoginForm[password]": _password,
      "lang": Cookie.getCookie("language") || "en"
    }

    $.post(_url, _postData, (resp) => {
      if (!resp.status || !resp.data) {
        this.error = resp.msg;
        this.doOpenLoginDialog(_email, _password, this.error);
        return;
      }

      //save token
      Cookie.setCookie("userinfo", JSON.stringify(resp.data.userinfo), 7200);
      Cookie.setCookie("token", resp.data.token, 7200);
      this.doLoginSuccess(resp.data.userinfo);
    });
  }

  onClickLogin() {
    let needPop = this.needShowDialog();
    if (needPop) {
      this.doOpenLoginDialog("", "", "");
      return;
    }

    this.doLogin();
  }

  render() {
    let fbUrl = this.state.login_facebook;
    let goUrl = this.state.login_google;

    let utmSource = Cookie.getCookie("utm_source");
    if (utmSource && utmSource.length > 0) {
      if (fbUrl.indexOf("?") > 0) {
        fbUrl += ("&utm_source=" + utmSource);
      } else {
        fbUrl += ("?utm_source=" + utmSource);
      }

      if (goUrl.indexOf("?") > 0) {
        goUrl += ("&utm_source=" + utmSource);
      } else {
        goUrl += ("?utm_source=" + utmSource);
      }
    }

    return (
      <div className="panel unlogin">
        <a href={fbUrl} className="btn third_login"><i className="icon logo fb"></i></a>
        <a href={goUrl} className="btn third_login"><i className="icon logo gg"></i></a>
        <div className="btn account">
          <input type="text" ref="account" name="account" placeholder={LangClient.i18n("Account")}/>
        </div>
        <div className="btn password">
          <input type="password" ref="password" name="password" placeholder={LangClient.i18n("Password")}/>
        </div>
        {/* <a href="#" className="btn login" onClick={this.onClickLogin.bind(this)}>{LangClient.i18n("LOGIN")}</a> */}
        <input type="button" className="btn login" onClick={this.onClickLogin.bind(this)} value={LangClient.i18n("LOGIN")} />
        <a href="/user/reg" className="btn reg">{LangClient.i18n("Sign Up")}</a>
      </div>
    );
  }
}
