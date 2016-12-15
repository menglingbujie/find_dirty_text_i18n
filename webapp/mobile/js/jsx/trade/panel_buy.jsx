import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import Config from "../config/config";
import LangClient from "../tools/Lang-Client";
import SelectBar from "../component/selectbar";
import CountDown from "../component/count_down";
import DialogBaseTip from "../dialog/dg_base_tip";

const MIN_MONEY = 10;
const MAX_MONEY = 1000;

export default class PanelBuy extends React.Component {
  constructor(props) {
    super(props);

    this.serverTime = 0;
    this.canClick = true;

    this.state = {
      money: MIN_MONEY
    };

    this.debug = true;
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  testLog(text) {
    if (window && window.enableTestLog) {
      console.log(text);
    }
  }

  update(data, timestamp) {
    this.serverTime = timestamp;
  }

  doBuy(type, event) {
    event.preventDefault();

    // 防止快速点击导致购买出现问题，每隔1秒才可购买一次
    if (!this.checkCanClick()) {
      return;
    }

    if (!this.checkCanBuy()) {
      return;
    }

    let _tradeInfo = this.props.trade_info;
    let _timePointObj = _tradeInfo.time_points[this.props.current];

    let _timePoint = parseInt(_timePointObj.time_point);
    let _rate = _timePointObj.win_rate;
    let _tradeCode = _tradeInfo.name;
    let _pid = _timePointObj.time_point_id;
    let _instrumentid = _tradeInfo.instrumentid;
    let _tradeState = _tradeInfo.trade_status;
    let _expireTime = parseInt(_timePointObj.expire_time || 0);
    let _tradeProductId = parseInt(_timePointObj.trade_product_id);

    // 如果没有expire time那么目前来说只能是短期齐全类型
    // 短期齐全的过期时间计算为：当前服务器时间 + timepoint
    if (!_expireTime || _expireTime == "undefined") {
      _expireTime = this.serverTime + _timePoint;
    }

    // let _tradeCate = sessionStorage.getItem("nav_index");
    let _tradeCate = _tradeInfo.cat;

    let _postData = {
      amount: this.refs.money.value, //money
      direction: type, // high, low
      instrumentid: _instrumentid, //instrumentid
      instrument: _tradeCode, //trade_code
      time_point_id: _pid, //time point id
      tradecategory: _tradeCate,
      opentime: this.serverTime,
      expiretime: _expireTime,
      payout: _rate,
      optiontype: _timePoint,
      trade_product_id: _tradeProductId,
      "access-token": Cookie.getCookie("token"),
      "lang": Cookie.getCookie("language") || 'en'
    };

    this.props.onLoading(true);

    this.testLog("===doBuy===");

    let _url = "//" + Config.host[Config.env] + Config.api.trade.trade_create;
    $.ajax({
      url: _url,
      method: "get",
      data: _postData,
      success: (resp) => {
        if (resp.status != 1) {
          this.testLog("===doBuy===error: " + resp.status);

          this.onBuyError(resp.status, resp.msg);

          if (resp.status == 401) {
            Cookie.deleteCookie("token");
            Cookie.deleteCookie("userinfo");
            this.setState({isLogin: false});
          }
          return;
        }

        this.testLog("===doBuy===success");
        this.onBuySuccess();
      },
      error: (e) => {
        this.onHttpError();
      }
    })
  }

  checkCanClick() {
    if (!this.canClick) {
      return false;
    }

    this.canClick = false;
    let timer = setTimeout(() => {
      this.canClick = true;
    }, 1000);

    return true;
  }

  checkCanBuy() {
    this.checkServerTime();

    let _tradeInfo = this.props.trade_info;
    let _timePoint = (_tradeInfo && _tradeInfo.time_points[this.props.current]) || null;
    if (!_tradeInfo || !_timePoint) {
      this.testLog("===checkCanBuy===time info not valid");
      this.props.needToLogin();
      return false;
    }

    if (_tradeInfo.trade_status == 0) {
      this.showToast("Trade ban time")
      return false;
    }

    // let _tradeCate = sessionStorage.getItem("nav_index");
    let _tradeCate = _tradeInfo.cat;
    if (_tradeCate == 2) {
      let _closeTime = parseInt(_timePoint.expire_time) - parseInt(_tradeInfo.close_buy);
      if (this.serverTime >= _closeTime) {
        this.showToast("This expiry time is no longer available, please select another one.");
        return false;
      }
    }

    let _token = Cookie.getCookie("token");
    let _userInfo = Cookie.getCookie("userinfo");
    let _userInfoObj = null;
    try {
      _userInfoObj = (_userInfo && JSON.parse(unescape(_userInfo))) || null;
    } catch (e) {
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
    }
    if (!_token || !_userInfo || !_userInfoObj) {
      this.testLog("===checkCanBuy===token or userinfo empty");
      this.props.needToLogin();
      return false;
    }

    let _amount = this.refs.money.value;
    if (!_amount || _amount < MIN_MONEY) {
      this.showToast("The lowest trade amount is $10");
      return false;
    }

    let _balance = parseFloat(_userInfoObj.balance || 0);
    if (_balance < _amount) {
      this.testLog("===checkCanBuy===balance not enough");
      this.showTipDialog();
      return false;
    }

    return true;
  }

  onBuySuccess() {
    this.props.onBuyResult(1, "");
  }

  onBuyError(code, msg) {
    if (code == 401) {
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");

      setTimeout(() => {
        location.href = "/";
      }, 2e2);
    } else {
      this.props.onBuyResult(code, msg);
      this.showToast(resp.msg);
    }
  }

  onHttpError() {
    this.props.onBuyResult(0, "");
  }

  onMoneyValueChanged(evt) {
    let _ele = $(evt.target);
    let _money = _ele.val();
    if (_money <= MIN_MONEY) {
      // 用户修改价格的过程中可能会把数字清零再输入，这个时候不能限制这个条件
      //_money = 10;
    } else if (_money >= MAX_MONEY) {
      _money = MAX_MONEY;
    }

    this.setState({money: _money})
    _ele.attr("step", this.countMoneyStep(_money));
  }

  onMoneyKillFocused(event) {
    //向下取整
    let _target = event.target;
    let _money = _target.value;
    let _iMoney = Math.floor(_money);
    if (_iMoney < MIN_MONEY) {
      _iMoney = MIN_MONEY;
    } else if (_iMoney > MAX_MONEY) {
      _iMoney = MAX_MONEY;
    }

    this.setState({money: Math.floor(_iMoney)});
  }

  onClickMoneyBtn(type) {
    let _currMoney = Math.floor(this.state.money);
    let _step = this.countMoneyStep(_currMoney);

    if (type == 0) {
      _currMoney -= _step;
    } else if (type == 1) {
      _currMoney += _step;
    }

    if (_currMoney <= MIN_MONEY) {
      _currMoney = MIN_MONEY;
    } else if (_currMoney >= MAX_MONEY) {
      _currMoney = MAX_MONEY;
    }

    //向下取整
    this.setState({money: Math.floor(_currMoney)})
  }

  countMoneyStep(money) {
    let _step = 10;
    let _money = parseFloat(money);
    if (_money >= 100 && _money < 200) {
      _step = 20;
    } else if (_money >= 200 && _money < 500) {
      _step = 50;
    } else if (_money >= 500 && _money < 1000) {
      _step = 100;
    } else if (_money >= 1000 && _money < 2000) {
      _step = 200;
    } else if (_money >= 2000 && _money < 5000) {
      _step = 500;
    } else if (_money >= 5000 && _money < 10000) {
      _step = 1000;
    }

    return _step;
  }

  //同步服务器时间
  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      // async: false,
      success: (resp) => {
        if (!resp) {
          return;
        }
        this.serverTime = resp.time;
      }
    });
  }

  showTipDialog() {
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogBaseTip title={LangClient.i18n("Warm Tips")} btnDesc={LangClient.i18n("Deposit")} content={LangClient.i18n("Your account balance is insufficient, please make a deposit.")} onClickBtn={this.goDeposit.bind(this)}/>, document.getElementById("dialogContainerId"));
  }

  goDeposit() {
    let _base_url = "/pay/deposit?access-token=";
    let _token = Cookie.getCookie("token");
    if (_token) {
      let _url = _base_url + _token;
      setTimeout(() => {
        location.href = _url;
      }, 200);
    } else {
      this.props.needToLogin();
    }
  }

  render() {
    let _state = this.state;
    let _props = this.props;

    let _userInfo = Cookie.getCookie("userinfo") || "";

    let _userInfoObj = null;
    try {
      _userInfoObj = _userInfo
        ? JSON.parse(unescape(_userInfo))
        : null;
    } catch (e) {
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
    }
    // console.log("==="+_userInfoObj);
    let _currencySymbol = (_userInfoObj && _userInfoObj.currency_symbol) || "$";

    let _tradeInfo = _props.trade_info;
    let _tradeStatus = (_tradeInfo && _tradeInfo.trade_status) || 0;
    let _timePoints = (_tradeInfo && _tradeInfo.time_points) || [];
    let _winRate = (_timePoints.length > 0 && _timePoints[_props.current].win_rate) || 0;

    let _winRateDesc = LangClient.i18n("Payout") + " " + _winRate + "%";

    let _earnMoney = Math.floor(_state.money) + Math.floor(_state.money) * (parseInt(_winRate) / 100);
    let _earnMoneyEx = Math.floor(_earnMoney);
    if (_earnMoneyEx != _earnMoney) {
      _earnMoney = _earnMoney.toFixed(1);
    }
    _earnMoney = _currencySymbol + _earnMoney;

    let _btnBuyUpCss = _tradeStatus == 0
      ? "btn buy_up disable"
      : "btn buy_up";
    let _btnBuyDownCss = _tradeStatus == 0
      ? "btn buy_down disable"
      : "btn buy_down";

    return (
      <div className="panel buy">
        <div className="top_rect">
          <div className="label">
            <span className="rate">{_winRateDesc}</span>
            <span className="earn">{_earnMoney}</span>
          </div>
          <div className="operation">
            <a href="#" className="btn plus" onClick={this.onClickMoneyBtn.bind(this, 0)}>
              <i className="icon opt_symbol"></i>
            </a>
            <a href="#" className="btn add" onClick={this.onClickMoneyBtn.bind(this, 1)}>
              <i className="icon opt_symbol"></i>
            </a>
            <div className="money">
              <i className="symbol">{_currencySymbol}</i>
              <input type="number" value={_state.money} ref="money" onChange={this.onMoneyValueChanged.bind(this)} onBlur={this.onMoneyKillFocused.bind(this)} step="10" min={MIN_MONEY} max={MAX_MONEY} placeholder="500"/>
            </div>
          </div>
        </div>
        <div className="bot_rect">
          <div className="btn_wrap">
            <a href="#" className={_btnBuyUpCss} onClick={this.doBuy.bind(this, "high")}>
              <i className="icon common buy_symbol"></i>
              <span className="text">{LangClient.i18n("High")}</span>
            </a>
          </div>
          <div className="btn_wrap">
            <a href="#" className={_btnBuyDownCss} onClick={this.doBuy.bind(this, "low")}>
              <i className="icon common buy_symbol"></i>
              <span className="text">{LangClient.i18n("Low")}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
