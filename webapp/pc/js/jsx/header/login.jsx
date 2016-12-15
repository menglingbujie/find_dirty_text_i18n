import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import CompleteUserInfo from "../users/complete_userinfo";
import Menu from "./menu";
import DialogInsuranceActivity from "../dialog/dg_insurance_activity";
import DialogGetInsurance from "../dialog/dg_insurance_get";

export default class LoginBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      money: "",
      symbol: "down",
      currency_symbol: "",
      bonusValue: 0,
      insuranceGot: false,
      insuranceExist: false
    };

    this.isMenuVisible = false;
    this.h_1OverFlow = "";

    this.timer = 0;
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  resetSymbol() {
    this.isMenuVisible = false;
    this.setParentOverflow(false);
    this.setState({symbol: "down"});
  }

  doLogout() {
    Cookie.deleteCookie("userinfo");
    let _oldToken = Cookie.getCookie("token");
    Cookie.deleteCookie("token");

    this.props.doLogout();

    var _isDev = Config.env;
    var _host = Config.host[_isDev];
    var _url = "//" + _host + Config.api.user.logout;

    $.get(_url, {
      "access-token": _oldToken.replace(/^Bearer /, "")
    }, (resp) => {
      //为了避免退出失败Token没有清除的问题，这里先清token，也就是只要点击退出
      //前端就清token，不管后台是真的退出还是假的，因为两个账号同时登陆时，服务器不会给原来的
      //账户推送退出消息，以至原账户退出失败
      //  if (!resp.status || resp.status != 1) {
      //      alert(resp.msg);
      //      return;
      //  }
      // let _subNav = sessionStorage.getItem("sub_nav");
      // if (_subNav != 2 || _subNav != "2") {
      //   //推出后默认返回首页并把当前首页的nav索引归为home
      //   sessionStorage.setItem("sub_nav", 2);
      //   setTimeout(() => {
      //     location.href = "/";
      //   }, 200);
      // }
      let _gourl = "/trade";
      if (location.search) {
        _gourl = location.href.replace(location.search, "");
      } else if (location.hash) {
        _gourl = location.href.replace(location.hash, "");
      }

      sessionStorage.removeItem("sub_nav");

      if (location.href.match(/pay\/withdraw/) || location.href.match(/pay\/deposit/)) {
        _gourl = "/trade";
      }

      setTimeout(() => {
        location.href = _gourl;
      }, 200);
    })
  }

  getBonusValue() {
    let _url = "//" + Config.host[Config.env] + Config.api.user.get_bonus_value;
    $.ajax({
      url: _url,
      method: "get",
      success: (resp) => {
        if (resp.status != 1) {
          return;
        }

        this.setState({
          bonusValue: resp.data.bonus || 0
        });
      }
    });
  }

  componentDidMount() {
    this.fetchUserInfo();
    this.getBonusValue();

    this.h_1OverFlow = $("div.h_1").css("overflow");
    this.updateMenuPos();

    // 每15秒查询一次用户当前的余额
    this.timer = setInterval(() => {
      this.fetchUserMoney();
    }, 15 * 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateMenuPos() {
    let pos = {
      left: $(".btn.account")[0].offsetLeft,
      top: $(".btn.account")[0].offsetTop,
      width: $(".btn.account")[0].offsetWidth - 30,
      height: $(".btn.account")[0].offsetHeight
    };

    this.refs.popmenu.updatePos(pos);
  }

  dispatchMoneyChange() {
    this.fetchUserMoney();
  }

  fetchUserMoney() {
    let _host = Config.host[Config.env];
    let token = Cookie.getCookie('token');
    if (!token) {
      return;
    }

    token = token.replace('Bearer ', '') || "";
    let _userinfo = Cookie.getCookie("userinfo");
    let _userInfoObj = {};
    if (_userinfo) {
      _userInfoObj = JSON.parse(_userinfo);
    }

    let _email = _userInfoObj && _userInfoObj.email || "";

    let _postData = {
      "access-token": token,
      "email": _email,
      "lang": Cookie.getCookie("language") || "en"
    }

    let _url = "//" + _host + Config.api.user.get_moneyinfo;
    $.ajax({
      url: _url,
      method: "get",
      data: _postData,
      success: (resp) => {
        if (!resp || resp.status != 1) {
          this.showToast(LangClient.i18n(resp.msg));
          return;
        }

        this.setState({money: resp.data.balance, currency_symbol: resp.data.currency_symbol});

        // 更新余额的时候记得更新userinfo cookie
        let _userInfo = Cookie.getCookie("userinfo") || "";
        let _userInfoObj = JSON.parse(_userInfo);
        if (_userInfo.length > 0 && _userInfoObj) {
          _userInfoObj.balance = resp.data.balance;
          _userInfoObj.currency_symbol = resp.data.currency_symbol;

          Cookie.setCookie("userinfo", JSON.stringify(_userInfoObj), 7200);
        }
      },
      error: function(error) {},
      statusCode: {
        401: function() {
          console.log('page not found');
        }
      }
    });
  }

  fetchUserInfo() {
    var _isDev = Config.env;
    var _host = Config.host[_isDev];
    var _url = "//" + _host + Config.api.user.get_uinfo_by_token;

    let _language = Cookie.getCookie("language");
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.props.needToLogin();
      return;
    }

    $.get(_url, {
      token: _token,
      lang: _language
    }, (resp) => {
      if (resp.status != 1) {
        this.showToast(resp.msg);
        return;
      }

      // 检查一下返回用户信息的合法性
      let email = resp.data.email;
      let firstName = resp.data.first_name;
      let lastName = resp.data.last_name;

      if ((!email || email.length == 0) || ((!firstName || firstName.length == 0) && (!lastName || lastName.length == 0))) {
        this.doLogout();
        return;
      }

      Cookie.setCookie("userinfo", JSON.stringify(resp.data), 7200);
      this.setState({money: resp.data.balance, currency_symbol: resp.data.currency_symbol});

      this.checkInsurancePop();
    })
  }

  isShowCplDialog() {
    let _props = this.props;
    let _needCplInfo = (_props.userinfo.phone_number && _props.userinfo.phone_number.length > 0)
      ? false
      : true;
    return _needCplInfo;
  }

  onClickAward() {
    let _props = this.props;
    let _realUser = Config.platform == 2
      ? true
      : false;
    if (_realUser) {
      if (this.isShowCplDialog()) {
        this.showCplUserInfoDialog(this.onCompleteInfoSuccess);
      } else {
        this.doGetBonus();
      }
    } else {}
  }

  showCplUserInfoDialog(completeInfoCallback) {
    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    let callback = () => {}
    if (completeInfoCallback) {
      callback = completeInfoCallback.bind(this);
    }
    ReactDOM.render(
      <CompleteUserInfo userinfo={this.props.userinfo} onCompleteInfoSuccess={callback}/>, document.getElementById("dialogContainerId"));
  }

  onCompleteInfoSuccess(phoneNumber) {
    this.props.userinfo.phone_number = phoneNumber;
    this.doGetBonus();
  }

  doGetBonus() {
    let _url = "//" + Config.host[Config.env] + Config.api.user.get_bonus;
    let _token = Cookie.getCookie("token");
    if (_token) {
      $.ajax({
        url: _url,
        method: "get",
        data: {
          'access-token': _token.replace(/^Bearer /, "")
        },
        success: (resp) => {
          if (resp.status != 1) {
            this.showToast(resp.msg);
            return;
          }

          // 领取成功
          this.setState({bonusValue: 0});

          this.props.userinfo.bonus = 1;
          Cookie.setCookie("userinfo", JSON.stringify(this.props.userinfo), 7200);
          Cookie.setCookie("token", _token, 7200);

          this.dispatchMoneyChange();
        }
      });
    } else {
      this.props.needToLogin();
    }
  }

  checkInsurancePop() {
    if (this.state.insuranceGot || location.pathname != "/trade") {
      return;
    }

    let serverTime = this.props.getTimeStamp();
    if (serverTime == 0) {
      return;
    }

    let userInfo = this.props.userinfo;
    let insuranceFlag = userInfo.insurance;
    if (insuranceFlag == 1) {
      // 未参与活动的账户，每次打开交易界面，自动弹出活动界面，每天只弹1次。以格林威治时间计算每天。
      let autoPop = true;
      let lastPopTime = parseInt(localStorage.getItem("insurance_act_pop") || 0);
      if (lastPopTime > 0) {
        let lastPopDate = new Date(lastPopTime * 1000);
        lastPopDate.setHours(0, 0, 0, 0);

        let curDate = new Date(serverTime * 1000);
        curDate.setHours(0, 0, 0, 0);
        if (curDate.getTime() == lastPopDate.getTime()) {
          autoPop = false;
        }
      }

      if (autoPop) {
        this.showInsuranceActivityDialog();
      }
    } else if (insuranceFlag == 2) {
      if (sessionStorage.getItem("insurance_get_pop")) {
        sessionStorage.removeItem("insurance_get_pop");
        this.showGetInsuranceDialog();
      } else {
        this.fetchInsuranceStatus();
      }
    }
  }

  fetchInsuranceStatus(callback = null) {
    let _language = Cookie.getCookie("language");
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.needToLogin();
      return;
    }

    let _url = "//" + Config.host[Config.env] + Config.api.user.insurance_status;
    $.get(_url, {
      "access-token": _token,
      lang: _language
    }, (resp) => {
      if (resp) {
        if (callback) {
          callback(resp);
        }

        this.setState({
          insuranceExist: resp.insuranceAmount > 0
            ? true
            : false
        });
      }
    })
  }

  onPositionClosed() {
    // 每次平仓刷新一次保险金状态
    this.fetchInsuranceStatus();
  }

  onClickInsuranceBtn(flag) {
    if (flag == 1) {
      // 参与保险金活动
      this.showInsuranceActivityDialog();
    } else if (flag == 2) {
      // 领取保险金
      this.showGetInsuranceDialog();
    }
  }

  showInsuranceActivityDialog() {
    let serverTime = this.props.getTimeStamp();

    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogInsuranceActivity servertime={serverTime} doAction={this.onInsuranceAction.bind(this, 1)}/>, document.getElementById("dialogContainerId"));
  }

  showGetInsuranceDialog() {
    this.fetchInsuranceStatus((resp) => {
      this._showGetInsuranceDialog(resp);
    });
  }

  _showGetInsuranceDialog(status) {
    let serverTime = this.props.getTimeStamp();

    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogGetInsurance status={status} servertime={serverTime} onGetInsuranceResult={this.onGetInsuranceResult.bind(this)}/>, document.getElementById("dialogContainerId"));
  }

  onInsuranceAction(flag) {
    if (flag == 1) {
      // 去充值
      this.onClickRecharge(null);
    }
  }

  onGetInsuranceResult(result) {
    if (result) {
      if (result.status == 1) {
        // 领取成功
        this.setState({insuranceGot: true});
        this.dispatchMoneyChange();
      } else {
        if (!result.msg) {
          this.showToast(result.msg);
        }
      }
    }
  }

  setParentOverflow(menuShow) {
    $("div.h_1").css("overflow", menuShow
      ? "visible"
      : this.h_1OverFlow);
  }

  onClickAccount() {
    this.isMenuVisible = !this.isMenuVisible;
    this.setParentOverflow(this.isMenuVisible);
    if (this.isMenuVisible) {
      this.setState({symbol: "up"});
    } else {
      this.setState({symbol: "down"});
    }

    let pos = {
      left: $(".btn.account")[0].offsetLeft,
      top: $(".btn.account")[0].offsetTop,
      width: $(".btn.account")[0].offsetWidth - 30,
      height: $(".btn.account")[0].offsetHeight
    };

    if (this.refs.popmenu) {
      this.refs.popmenu.toggleShow(pos);
    }
  }

  onClickBalance(event) {
    event.preventDefault();
    //this.dispatchMoneyChange();
    // money info接口返回的不如user info接口信息全
    this.fetchUserInfo();
  }

  onClickRecharge(event) {
    if (event) {
      event.preventDefault();
    }

    //deposit judage full userinfo
    // if (this.isShowCplDialog()) {
    //   this.showCplUserInfoDialog();
    //   return;
    // }
    let _base_url = "/pay/deposit?access-token=";
    let _token = Cookie.getCookie("token");
    if (_token) {
      let _url = _base_url + _token.replace(/^Bearer /, "");
      setTimeout(() => {
        sessionStorage.setItem("sub_nav", -1);
        location.href = _url;
      }, 200);
    } else {
      this.props.needToLogin();
    }
  }

  onClickMenu(id) {
    this.props.onClickMenu(id);
  }

  render() {
    let _props = this.props;
    let _userinfo = _props.userinfo;
    let _state = this.state;

    // let _bonus = _userinfo.bonus == null
    //   ? 1
    //   : _userinfo.bonus;
    // let _total_deposit = _userinfo.total_deposit || 0;
    //
    // let _bonusFmt = LangClient.i18n("Get {money} BONUS");
    // let _award = (_state.currency_symbol || "") + (_state.bonusValue || 100);
    // let _awardDesc = _bonusFmt.replace("{money}", _award);
    //
    // let _awardView = "";
    // // 只有没领过启动金、没充过值的用户，并且启动金额度大于0时，才显示“领取”按钮
    // if (_bonus == 0 && _total_deposit == 0 && _state.bonusValue > 0) {
    //   _awardView = (
    //     <a href="#" className="btn award" onClick={this.onClickAward.bind(this)}>{_awardDesc}</a>
    //   );
    // }

    // 保险金按钮逻辑
    let _awardView = "";
    let _insuranceFlag = _userinfo.insurance;
    if (!this.state.insuranceGot && (_insuranceFlag == 1 || _insuranceFlag == 2)) {
      let _insuDesc = LangClient.i18n("Join the Insurance Acitivity");
      let _awardCss = "btn award";
      if (_insuranceFlag == 2) {
        _insuDesc = _state.insuranceExist
          ? LangClient.i18n("GET YOUR INSURANCE")
          : LangClient.i18n("INSURANCE");
        if (!_state.insuranceExist) {
          _awardCss = "btn award light";
        }
      }

      // 参与保险金活动
      _awardView = (
        <a href="#" className={_awardCss} onClick={this.onClickInsuranceBtn.bind(this, _insuranceFlag)}>{_insuDesc}</a>
      );
    }

    let isRealUser = Config.platform == 2
      ? true
      : false;
    let _userDesc = (isRealUser
      ? LangClient.i18n("Real account")
      : LangClient.i18n("Demo account")) + ": " + (_userinfo && _userinfo.first_name) + " " + (_userinfo && _userinfo.last_name);

    let _moneyDesc = (_state.currency_symbol || "") + " " + (_state.money || "0");
    if (_moneyDesc == " ") {
      _moneyDesc = "0";
    }

    let _arrowIconCss = "arrow_icon " + this.state.symbol;

    return (
      <div className="panel login">
        {_awardView}
        <a href="#" className="btn account" onClick={this.onClickAccount.bind(this)}>
          <span className="user_account" ref="account">{_userDesc}</span>
          <i className={_arrowIconCss}></i>
        </a>
        <span id="id_balance" className="text" onClick={this.onClickBalance.bind(this)}>{_moneyDesc}</span>
        <a href="#" className="btn recharge" onClick={this.onClickRecharge.bind(this)}>{LangClient.i18n("Deposit")}</a>
        <Menu ref="popmenu" onClickMenu={this.onClickMenu.bind(this)} resetSymbol={this.resetSymbol.bind(this)}/>
      </div>
    );
  }
}
