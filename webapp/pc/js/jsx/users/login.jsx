import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      errorCss: "field hide"
    }

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  validEmail(email) {
    if (!email) {
      return LangClient.i18n("Enter your email address");
    }

    let emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailValid.test(email)) {
      return LangClient.i18n("Enter a valid email address");
    }

    return "";
  }

  doLogin() {
    try {
      ga("send", "event", "btn_login");
    } catch (e) {}

    this.hideError();

    var _isDev = Config.env;
    var _host = Config.host[_isDev];
    var _url = "//" + _host + Config.api.user.login;
    var _email = this.refs.ELE_email.value;
    var _password = this.refs.ELE_password.value;

    var _emailValidMsg = this.validEmail(_email);
    if (_emailValidMsg) {
      this.showError(_emailValidMsg);
      return;
    }

    if (!_password) {
      let tempMSG = LangClient.i18n("Password is required")
      this.showError(tempMSG);
      return;
    }

    // console.log(_email+"==="+_password);
    let _postData = {
      "LoginForm[email]": _email,
      "LoginForm[password]": _password,
      "lang": Cookie.getCookie("language") || "en"
    }
    $.post(_url, _postData, (resp) => {
      // console.log(resp);
      if (!resp.status || !resp.data) {
        this.showError(resp.msg);
        return;
      }
      //save token
      // localStorage.setItem("token",resp.data.token);
      Cookie.setCookie("userinfo", JSON.stringify(resp.data.userinfo), 7200);
      Cookie.setCookie("token", resp.data.token, 7200);
      this.hideError();
      this.props.onLoginSuccess(resp.data.userinfo);
      this.doCloseHideLoginDialog();
    });
  }

  doCloseHideLoginDialog() {
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }

  evtKeydown(event) {
    // console.log(this,"==keydown=="+event.keyCode)
    if (event.keyCode == 13) {
      //this.doLogin();
      $(".btn.login").click();
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.evtKeydown, false);
    let transAccount = this.props.account;
    this.refs.ELE_email.value = transAccount;

    let transPassword = this.props.password;
    this.refs.ELE_password.value = transPassword;

    let error = this.props.errmsg;
    if (error && error.length > 0) {
      this.showError(error);
    }

    $("#id_email").bind("focus", () => {
      this.hideError();
    });

    $("#id_password").bind("focus", () => {
      this.hideError();
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.evtKeydown, false);
  }

  showError(error) {
    this.setState({"errorMsg": error, "errorCss": "field error"});
  }

  hideError() {
    this.setState({errorMsg: "", errorCss: "field hide"});
  }

  render() {
    let _logoSrc = $("#id_ultra_icon").attr("src")||this.urlCdn+"/pc/images/ultra_logo.png";
    return (
      <div className="dialog login">
        <div className="panel">
          <a href="#" onClick={this.doCloseHideLoginDialog.bind(this)} className="btn icon common close"></a>
          <a href="/user/reg" className="btn reg">{LangClient.i18n("Sign Up")}</a>
          <div className="content">
            <div className="logo"><img src={_logoSrc}/></div>
            <div className="diver"></div>
            <div className="form">
              <div className="field">
                <input id="id_email" type="email" ref="ELE_email" placeholder={LangClient.i18n("Email")}/>
              </div>
              <div className="field">
                <input id="id_password" type="password" ref="ELE_password" placeholder={LangClient.i18n("Password")}/>
              </div>
              <div className={this.state.errorCss}>
                <i className="icon error"></i>
                <span className="errorMsg">{LangClient.i18n(this.state.errorMsg)}</span>
              </div>
              <div className="field login">
                <input type="button" className="btn login" onClick={this.doLogin.bind(this)} value={LangClient.i18n("Sign In")}/>
              </div>
              <div className="field forget">
                <a href="/user/forget_password">{LangClient.i18n("Forgot password")}？</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
