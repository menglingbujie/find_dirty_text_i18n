import React from "react";
import $ from "jquery";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from '../tools/Lang-Client';
import HeaderReg from "../header/header_reg";

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: "",
      errorCss: "field hide"
    }
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  onFieldKillFocus(event) {
    let _target = event.target;
    let _ele = $(_target);
    let _value = _ele.val();
    let _name = _ele.attr("name");
    let _errorMsg = "";
    let _hasError = false;

    switch (_name) {
      case "oldpassword":
      case "newpassword":
      case "cfmpassword":
        {
          if (_value && _value.length < 6 || _value.length > 14) {
            _errorMsg = LangClient.i18n("password must be between 6 and 14 characters");
            _hasError = true;
          }
        }
        break;
    }

    if (_hasError) {
      this.showError(_target, _errorMsg);
    } else {
      _ele.parent().removeClass('error');
    }
  }

  showError(ele, text) {
    $(ele).parent().addClass("error");
    $(ele).parent().find(".tips").html(text);
  }

  doChangePassword() {
    try {
      ga("send", "event", "change_password");
    } catch (e) {}

    let language = Cookie.getCookie("language");
    let token = Cookie.getCookie("token");
    let userInfo = Cookie.getCookie("userinfo");
    if (!token || !userInfo) {
      Cookie.deleteCookie("userinfo");
      Cookie.deleteCookie("token");
      sessionStorage.setItem("need_to_login");
      location.href = "/";
      return;
    }

    let userInfoObj = userInfo
      ? JSON.parse(userInfo)
      : null;
    let email = userInfoObj
      ? (userInfoObj.email || "")
      : "";

    let _old_pwd = this.refs.ELE_old_password.value;
    let _new_pwd = this.refs.ELE_new_password.value;
    let _cfm_pwd = this.refs.ELE_cfm_password.value;

    if (_old_pwd.length < 6 || _old_pwd.length > 14) {
      this.showError($(this.refs.ELE_old_password), LangClient.i18n("password must be between 6 and 14 characters"));
      return;
    }

    if (_new_pwd.length < 6 || _new_pwd.length > 14) {
      this.showError($(this.refs.ELE_new_password), LangClient.i18n("password must be between 6 and 14 characters"));
      return;
    }

    if (_cfm_pwd.length < 6 || _cfm_pwd.length > 14) {
      this.showError($(this.refs.ELE_cfm_password), LangClient.i18n("password must be between 6 and 14 characters"));
      return;
    }

    if (_new_pwd != _cfm_pwd) {
      this.showError($(this.refs.ELE_cfm_password), LangClient.i18n("The new password and confirm password is not the same"));
      return;
    }

    let _url = "//" + Config.host[Config.env] + Config.api.user.change_password;
    _url += ("?access-token=" + token);

    let _postData = {
      "LoginForm[email]": email,
      "LoginForm[oldpassword]": _old_pwd,
      "LoginForm[newpassword]": _new_pwd,
      "LoginForm[cfmpassword]": _cfm_pwd,
      "token": token,
      "lang": language
    };

    $.post(_url, _postData, (resp) => {
      if (!resp) {
        return;
      }

      if (resp.status != 1) {
        this.showToast(LangClient.i18n(resp.msg));
        return;
      }

      this.showToast(LangClient.i18n("Changes have been saved."));

      let _backUrl = location.search.replace(/.backurl=(.*)/, "$1");
      location.href = "/" + (_backUrl || "");
    });
  }

  render() {
    return (
      <article className="page forget">
        <HeaderReg/>
        <h1>{LangClient.i18n("Change Password")}</h1>
        <div className="panel">
          <div className="content">
            <div className="form">
              <div className="field">
                <input type="password" name="oldpassword" onBlur={this.onFieldKillFocus.bind(this)} ref="ELE_old_password" min="6" max="14" placeholder={LangClient.i18n("Old Password")}/>
                <i className="icon common error"></i>
                <div className="tips"></div>
              </div>
              <div className="field">
                <input type="password" name="newpassword" onBlur={this.onFieldKillFocus.bind(this)} ref="ELE_new_password" min="6" max="14" placeholder={LangClient.i18n("New Password")}/>
                <i className="icon common error"></i>
                <div className="tips"></div>
              </div>
              <div className="field">
                <input type="password" name="cfmpassword" onBlur={this.onFieldKillFocus.bind(this)} ref="ELE_cfm_password" min="6" max="14" placeholder={LangClient.i18n("Please enter Password Again")}/>
                <i className="icon common error"></i>
                <div className="tips"></div>
              </div>
              <div className={this.state.errorCss}>
                <i className="icon common error"></i>
                <span className="error_msg">{this.state.errorMsg}</span>
              </div>
              <div className="field">
                <input type="button" className="submit" onClick={this.doChangePassword.bind(this)} value={LangClient.i18n("Submit")}/>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}
