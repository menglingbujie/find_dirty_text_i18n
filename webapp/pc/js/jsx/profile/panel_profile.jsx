import React from "react";
import $ from "jquery";
import CountryAll from "../data/country_all";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from "../tools/Lang-Client";

export default class PanelProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      phone: null,
      btnDisabled: true
    }

    this.needFocus = false;
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {}

  componentDidUpdate() {
    if (this.needFocus) {
      document.getElementById("id_phone").focus();
    }
  }

  onChangePhone() {
    if ($("#id_phone").attr("disabled")) {
      this.needFocus = true;
      this.setState({disabled: false, btnDisabled: false});
    }
  }

  onPhoneTextChange(evt) {
    let ele = $(evt.target);
    let text = ele.val();
    // 此处不再校验，用户容易反复看到吐司，没意义
    // if (text && !this.validField(text, /^[+\-\d]+$/)) {
    //   this.showToast("Invalid mobile number, please enter again");
    //   return;
    // }

    this.setState({phone: text});
  }

  onPhoneKillFocus() {
    this.needFocus = false;
  }

  onChangePassword() {
    location.href = "/user/change_password?backurl=profile";
  }

  onClickSubmit() {
    if ($("#id_phone").attr("disabled") || $(".btn.submit").hasClass("disabled")) {
      return;
    }

    $(".btn.submit").addClass("disabled");
    this.setState({btnDisabled: true});

    let token = Cookie.getCookie("token");

    let phoneVal = $("#id_phone").val();
    if (this.validField(phoneVal, /^\s*$/)) {
      this.showToast("Enter a valid mobile number");
      // 延迟一秒，防止那些手速快的用户频繁点击造成反复弹吐司
      setTimeout(() => {
        this.setState({btnDisabled: false});
      }, 4000);
      return;
    } else if (!this.validField(phoneVal, /^[+\-\d]+$/)) {
      this.showToast("Invalid mobile number, please enter again");
      // 延迟一秒，防止那些手速快的用户频繁点击造成反复弹吐司
      setTimeout(() => {
        this.setState({btnDisabled: false});
      }, 4000);
      return;
    }

    let userInfo = this.props.userinfo;
    let countryCode = (userInfo && userInfo.country) || "";
    let countryData = CountryAll[countryCode];
    let areaCode = "+" + ((countryData && countryData.callingcode) || "");
    let newPhone = areaCode + phoneVal;

    let url = "//" + Config.host[Config.env] + Config.api.user.update_phone_number;
    $.ajax({
      url: url,
      method: "GET",
      data: {
        "access-token": token,
        "phone_number": newPhone
      },
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.status == 1) {
          this.needFocus = false;
          this.setState({disabled: true, btnDisabled: true});
          this.showToast("Changes have been saved.");
        } else {
          let msg = resp.msg;
          if (msg) {
            this.showToast(msg);
          }
        }
      },
      error: (e) => {
        if (e) {
          this.showToast(e);
        }
      }
    });
  }

  validField(value, regx) {
    return regx.test(value);
  }

  render() {
    let userInfo = this.props.userinfo;
    let lastName = (userInfo && userInfo.last_name) || "";
    let firstName = (userInfo && userInfo.first_name) || "";
    let countryCode = (userInfo && userInfo.country) || "";
    let countryData = CountryAll[countryCode];
    let countryName = (countryData && countryData.name) || "";
    let areaCode = "+" + ((countryData && countryData.callingcode) || "");
    let phone = (userInfo && userInfo.phone_number) || "";
    phone = phone.replace(areaCode, "");
    let phoneText = this.state.phone != null
      ? this.state.phone
      : phone;
    let email = (userInfo && userInfo.email) || "";

    let modTelCss = this.state.disabled
      ? "btn mod_tel"
      : "btn mod_tel hide";

    let btnSectionCss = this.state.disabled
      ? "section btn hide"
      : "section btn";
    let btnCss = this.state.btnDisabled
      ? "btn submit disabled"
      : "btn submit";

    return (
      <div className="panel profile">
        <div className="wrap">
          <div className="headtip"></div>
          <div className="center_wrap">
            <div className="section info">
              <div className="field">{lastName}</div>
              <div className="field">{firstName}</div>
              <div className="field">{countryName}</div>
              <div className="field">
                <input id="id_phone" type="tel" name="phone" value={phoneText} disabled={this.state.disabled} onChange={this.onPhoneTextChange.bind(this)} onBlur={this.onPhoneKillFocus.bind(this)}/>
                <a className={modTelCss} onClick={this.onChangePhone.bind(this)}>{LangClient.i18n("Modify")}</a>
              </div>
              <div className="field">{email}</div>
            </div>
            <div className="section pwd">
              <div className="field">
                <a className="btn mod_pwd" onClick={this.onChangePassword.bind(this)}>{LangClient.i18n("Change Password")}</a>
              </div>
            </div>
            <div className={btnSectionCss}>
              <div className="field">
                <a className={btnCss} onClick={this.onClickSubmit.bind(this)}>{LangClient.i18n("Confirm")}</a>
              </div>
            </div>
          </div>
          <div className="left_wrap">
            <div className="section info">
              <div className="field">{LangClient.i18n("Last Name")}:</div>
              <div className="field">{LangClient.i18n("First Name")}:</div>
              <div className="field">{LangClient.i18n("Country")}:</div>
              <div className="field">{LangClient.i18n("Tel")}:</div>
              <div className="field">{LangClient.i18n("E-mail")}:</div>
            </div>
            <div className="section pwd">
              <div className="field">{LangClient.i18n("Password")}:</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
