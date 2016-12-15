import React from "react";
import $ from "jquery";
import Config from "./config/config";
import Cookie from "./tools/cookie";
import Service from "./home/online_service";
import Header from "./header/header";
import ProfHeader from "./profile/prof_header";
import PanelProfile from "./profile/panel_profile";
import PanelCard from "./profile/panel_card";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: null,
      curIdx: 0
    };

    this.cardInfo = null;
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {
    let userInfoStr = Cookie.getCookie("userinfo");
    if (userInfoStr) {
      let userInfo = JSON.parse(userInfoStr);
      if (userInfo) {
        this.setState({userInfo: userInfo});
      }
    }

    this.fetchUserInfo();
    this.fetchCardInfo();
  }

  fetchUserInfo() {
    let token = Cookie.getCookie("token");
    if (!token) {
      this.toLogin();
      return;
    }

    var _url = "//" + Config.host[Config.env] + Config.api.user.get_uinfo_by_token;
    $.get(_url, {
      token: token,
      lang: Cookie.getCookie("language") || "en"
    }, (resp) => {
      if (resp.status != 1) {
        this.showToast(resp.msg);
        if (resp.status == 0 || resp.status == "0") {
          Cookie.deleteCookie("token");
          this.toLogin();
        }
        return;
      }

      Cookie.setCookie("userinfo", JSON.stringify(resp.data), 7200);
      this.setState({userInfo: resp.data});
    })
  }

  fetchCardInfo() {
    let token = Cookie.getCookie("token");
    let language = Cookie.getCookie("language");
    if (!token) {
      this.toLogin();
    }

    let url = "//" + Config.host[Config.env] + Config.api.account.get_bank_info;
    $.ajax({
      url: url,
      method: "GET",
      data: {
        "access-token": token,
        language: language
      },
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.status != 1) {
          this.showToast(resp.msg);
          return;
        }

        this.cardInfo = resp.data;
      },
      error: (e) => {}
    });
  }

  toLogin() {
    sessionStorage.setItem("need_to_login", 1);
    location.href = "/";
  }

  onSwitch(idx) {
    if (idx == 0) {
      this.fetchCardInfo();
    }
    this.setState({curIdx: idx});
  }

  render() {
    let panelView = this.state.curIdx == 0
      ? (<PanelProfile userinfo={this.state.userInfo}/>)
      : (<PanelCard userinfo={this.state.userInfo} cardinfo={this.cardInfo} needToLogin={this.toLogin.bind(this)}/>);
    return (
      <article>
        <Header/>
        <ProfHeader ref="header" userinfo={this.state.userInfo} current={this.state.curIdx} onSwitch={this.onSwitch.bind(this)}/> {panelView}
        <Service/>
      </article>
    );
  }
}
