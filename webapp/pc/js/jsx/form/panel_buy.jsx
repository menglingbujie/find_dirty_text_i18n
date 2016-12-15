import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie"
import SelectBar from "../slider/selectbar";
import CountDown from "../table/count_down";
import DialogWithTitleMessage from "../dialog/dg_msg_with_title";

export default class OptionsBuyForm extends React.Component {
  constructor(props) {
    super(props);

    this.serverTimestramp = 0;
    this.isCanClick = true;
    this.MAX_MONEY = 1000;
    this.MIN_MONEY = 10;

    this.state = {
      title: {
        trade_type: "",
        trade_per: ""
      },
      form_description: "",
      price: "",
      default_money: this.MIN_MONEY,
      serverTime: 0
    };

    this.btnContinueCss = "btn buy_continue hide";
  }

  initBuyFormTitleInfo() {
    //如果有计时器需要清除
    if (this.countTimer) {
      clearTimeout(this.countTimer)
    }

    let _buyFormTitleInfo = localStorage.getItem("curr_trade_info");
    if (!_buyFormTitleInfo) {
      return;
    }

    // console.log("===initBuyFormTitleInfo==",_buyFormTitleInfo);
    let _obj = _buyFormTitleInfo.split(",");
    let _time = _obj[0];
    let _per = _obj[1] + "%";
    let _type = _obj[3];
    let _price = _obj[4];
    let _invtervalTime = _obj[9];
    //存储type code为图标更新数据
    localStorage.setItem("curr_trade_code", _type);
    //根据当前时间算下一次交易结束时间
    let _date = new Date(+ new Date() + _time * 1000);
    let _nextHour = _date.getHours();
    let _nextMinute = _date.getMinutes();

    let _nextCloseTime = (_nextHour > 9
      ? _nextHour
      : "0" + _nextHour) + ":" + (_nextMinute > 9
      ? _nextMinute
      : "0" + _nextMinute);
    let _formDesp = LangClient.i18n("Will the") + LangClient.i18n(_type) + LangClient.i18n("at") + _nextCloseTime + LangClient.i18n("close Higher or Lower than the current strike price?");

    let lastAmount = parseInt(localStorage.getItem("last_amount") || 0);
    lastAmount = lastAmount < this.MIN_MONEY ? this.MIN_MONEY : lastAmount;
    lastAmount = lastAmount > this.MAX_MONEY ? this.MAX_MONEY : lastAmount;

    this.setState({trade_type: _type, trade_per: _per, trade_close_time: _nextCloseTime, form_description: _formDesp, price: _price, default_money: lastAmount});
  }

  update(data, timestamp) {
    this.setState({serverTime: timestamp});
  }

  shouldComponentUpdate(nextProps, nextState) {
    let _props = this.props;
    let _state = this.state;
    //检查state里的trade_type,trade_close_time,price,default_money
    //如果这些数据有变动，那么就重新渲染
    // let _isUpdate = (_props.tradeinfo !== nextProps.tradeinfo) || (_props.selectIdx != nextProps.selectIdx) || (_state.trade_type != nextState.trade_type) || (_state.trade_close_time != nextState.trade_close_time) || (_state.price != nextState.price) || (_state.default_money != nextState.default_money);
    // return _isUpdate;

    return true;
  }

  componentDidMount() {
    //初始化form表单数据
    this.initBuyFormTitleInfo();
    let _tradeInfo = localStorage.getItem("curr_trade_info");
    if (!_tradeInfo) {
      return;
    }
    let _tradeInfoArr = _tradeInfo.split(",");
    this.state.price = _tradeInfoArr[4];
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

  moneyValueChange(evt) {
    let _ele = $(evt.target);
    let _money = _ele.val();
    if (_money <= this.MIN_MONEY) {
      // 用户修改价格的过程中可能会把数字清零再输入，这个时候不能限制这个条件
      //_money = 10;
    } else if (_money >= this.MAX_MONEY) {
      _money = this.MAX_MONEY;
    }
    this.setState({default_money: _money})
    _ele.attr("step", this.countMoneyStep(_money));
  }

  changeMoney(type) {
    let _currMoney = Math.floor(this.state.default_money);
    let _step = this.countMoneyStep(_currMoney);

    if (type == 0) {
      _currMoney -= _step;
    } else if (type == 1) {
      _currMoney += _step;
    }
    if (_currMoney <= this.MIN_MONEY) {
      _currMoney = this.MIN_MONEY;
    } else if (_currMoney >= this.MAX_MONEY) {
      _currMoney = this.MAX_MONEY;
    }
    //向下取整
    this.setState({default_money: Math.floor(_currMoney)})
  }

  //同步服务器时间
  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      async: false,
      success: (resp) => {
        if (!resp) {
          return;
        }
        this.serverTimestramp = resp.time;
      }
    });
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  notifyRecordMode(recordMode) {
    this.btnContinueCss = recordMode
      ? "btn buy_continue"
      : "btn buy_continue hide";
    $(".btn.buy_continue").attr("class", this.btnContinueCss);

    this.updateBtnState(!recordMode);
  }

  updateBtnState(enabled) {
    let tradeStoped = false;
    if (this.props.tradeinfo && this.props.tradeinfo.trade_status == 0) {
      tradeStoped = true;
    }

    if (!enabled || tradeStoped) {
      $(".btn.buy_up").addClass("disable");
      $(".btn.buy_down").addClass("disable");
    } else {
      $(".btn.buy_up").removeClass("disable");
      $(".btn.buy_down").removeClass("disable");
    }
  }

  refreshTradeList() {
    this.props.notifyTradeList();
  }

  getStopTradeTime() {
    let _tradeCate = sessionStorage.getItem("nav_index");
    if (_tradeCate == 1) {
      return Number.MAX_VALUE;
    }

    let _tradeinfo = this.props.tradeinfo;
    if (!_tradeinfo) {
      return 0;
    }

    let _closeBuy = parseInt(_tradeinfo.close_buy);
    let _timePoints = _tradeinfo.time_points;
    if (!_timePoints || _timePoints.length == 0) {
      return 0;
    }

    let _selectIdx = this.props.selectIdx;
    if ((_timePoints.length - 1) < _selectIdx) {
      _selectIdx = 0;
    }

    let _currTimePoint = _timePoints[_selectIdx];
    let _currExpireTime = _currTimePoint
      ? (_currTimePoint.expire_time - _closeBuy)
      : 0; //交易时间更新点

    return _currExpireTime;
  }

  doBuy(type, event) {
    if ($(event.target).hasClass("disable") || $(event.target.parentNode).hasClass("disable")) {
      return;
    }

    event.preventDefault();
    try {
      ga("send", "event", "buy", type);
    } catch (e) {}
    //防止快速点击导致购买出现问题，每隔1秒才可购买一次
    if (!this.isCanClick) {
      return;
    }

    this.isCanClick = false;
    let timer = setTimeout(() => {
      this.isCanClick = true;
    }, 1000);

    let _token = Cookie.getCookie("token");
    if (!_token) {
      //this.showToast(LangClient.i18n("Please login!"));
      //未登录，需要弹出登录框
      this.props.checkUnloginState();
      return;
    }

    let _amount = this.refs.money.value;
    if (!_amount) {
      let tempMSG = LangClient.i18n("The lowest trade amount is $10");
      // alert(tempMSG);
      this.showToast(tempMSG);
      return;
    }

    let _tradeInfo = localStorage.getItem("curr_trade_info");
    if (!_tradeInfo) {
      return;
    }

    let _tradeInfoArr = _tradeInfo.split(",");
    let _timePoint = parseInt(_tradeInfoArr[0]);
    let _rate = _tradeInfoArr[1];
    let _tradeCode = _tradeInfoArr[3];
    let _price = this.state.price;
    let _pid = _tradeInfoArr[5];
    let _instrumentid = _tradeInfoArr[6];
    let _tradeState = _tradeInfoArr[7];
    let _expireTime = parseInt(_tradeInfoArr[8]);
    let _tradeProductId = parseInt(_tradeInfoArr[10]);

    if (_tradeState == 0 || _tradeState == "0") {
      let tempMSG = LangClient.i18n("Trade ban time");
      // alert(tempMSG);
      this.showToast(tempMSG)
      return;
    }

    //获取服务器时间，通过time_point算过去时间
    this.checkServerTime();

    // 获取当前产品当前期的交易截止时间，并判断是否还能继续购买
    let curCloseBuyTime = this.getStopTradeTime();
    if (this.serverTimestramp >= curCloseBuyTime) {
      let tip = LangClient.i18n("This expiry time is no longer available, please select another one.");
      this.showToast(tip)
      return;
    }

    // 判断余额是否充足，不够则弹窗
    let _userInfo = Cookie.getCookie("userinfo");
    if (!_userInfo) {
      this.props.needToLogin();
      return;
    }
    let _userInfoObj = JSON.parse(_userInfo);
    if (!_userInfoObj) {
      return;
    }

    let _balance = parseFloat(_userInfoObj.balance || 0);
    if (_balance < _amount) {
      this.showTipDialog();
      return;
    }

    //如果买的时候，正好价格变了，要刷新左侧列表
    let _curr_trade_info = localStorage.getItem("curr_trade_info");
    if (_curr_trade_info) {
      let _curr_rate = _curr_trade_info.split(',')[1] + "%";
      let _leftShowRate = $('#mCSB_1_container .current .rate').text();
      if (_leftShowRate != _curr_rate) {
        this.refreshTradeList();
      }
    }

    //如果没有expire time那么目前来说只能是短期齐全类型
    //短期齐全的过期时间计算为：当前服务器时间+timepoint
    if (!_expireTime || _expireTime == "undefined") {
      _expireTime = this.serverTimestramp + _timePoint;
    }

    let _tradeCate = sessionStorage.getItem("nav_index");

    //0:up ,1:down
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.trade_create;

    //post data
    //amount, direction, instrumentid,openprice,tradecategory,opentime,expiretime,payout,optiontype
    let _postData = {
      amount: _amount, //money
      direction: type, // high, low
      instrumentid: _instrumentid, //instrumentid
      instrument: _tradeCode, //trade_code
      time_point_id: _pid, //time point id
      tradecategory: _tradeCate,
      opentime: this.serverTimestramp,
      expiretime: _expireTime,
      payout: _rate,
      optiontype: _timePoint,
      trade_product_id: _tradeProductId,
      "access-token": _token.replace(/^Bearer /, ""),
      "lang": Cookie.getCookie("language") || 'en',
      trade_product_id: _tradeProductId
    }

    if (_tradeCate == 2) {
      // 带上当前的停止交易时间，给后台判断是否继续购买用
      _postData.stoptime = curCloseBuyTime;
    }

    this.showLoading();

    $.ajax({
      url: _url,
      method: "get",
      data: _postData,
      success: (resp) => {
        if (!resp) {
          this.hideLoading();
          return;
        }

        if (resp.status != 1) {
          this.hideLoading();

          let errorMsg = resp.msg;

          if (resp.status == 401) {
            Cookie.deleteCookie("token");
            Cookie.deleteCookie("userinfo");
            setTimeout(() => {
              location.href = "/";
            }, 2e2);
            return;
          } else if (resp.status == 2) {
            // 当前余额达到启动金2倍，并且没充过值，弹窗
            this.showTipDialog2();
            return;
          } else if (resp.status == 998) {
            errorMsg = "This expiry time is no longer available, please select another one.";
          } else {
            this.props.onBuyError({code: resp.status});
          }

          this.showToast(LangClient.i18n(errorMsg));
          return;
        }

        localStorage.setItem("last_amount", _amount);

        let orderInfo = resp.data;
        orderInfo.close_buy = resp.close_buy || 300;
        orderInfo.currentprice = resp.currentprice || "";
        orderInfo.tradecat_alias = resp.tradecat_alias || "";
        this.props.doBuySuccess(orderInfo);
      },
      error: (e) => {
        this.hideLoading();
      }
    })
  }

  checkMoneyLegal(event) {
    //向下取整
    let _target = event.target;
    let _money = _target.value;
    let _iMoney = Math.floor(_money);
    if (_iMoney < this.MIN_MONEY) {
      _iMoney = this.MIN_MONEY;
    } else if (_iMoney > this.MAX_MONEY) {
      _iMoney = this.MAX_MONEY;
    }
    //_target.value = _iMoney;
    this.setState({default_money: Math.floor(_iMoney)});
  }

  clickTimePoint(timePoint) {
    this.props.onClickTimePoint(timePoint);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.tradeinfo !== nextProps.tradeinfo) {}
  }

  callTimeIsUp() {}

  updateWaitingState(isWait) {}

  showTipDialog() {
    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogWithTitleMessage title={LangClient.i18n("Warm Tips")} btn_text={LangClient.i18n("Deposit")} msg={LangClient.i18n("Your account balance is insufficient, please make a deposit.")} onClickBtn={this.goDeposit.bind(this)}/>, document.getElementById("dialogContainerId"));
  }

  showTipDialog2() {
    $("#containerId").addClass("gaussianblur");
    $("#dialogContainerId").show();
    ReactDOM.render(
      <DialogWithTitleMessage title={LangClient.i18n("Warm Tips")} btn_text={LangClient.i18n("Deposit")} msg={LangClient.i18n("Congratulations! Your current balance exceeds your BONUS twice. You seem to be very familiar with binary options trading now. Please continue trading after making a deposit and enjoy profiting starting now!")} onClickBtn={this.goDeposit.bind(this)}/>, document.getElementById("dialogContainerId"));
  }

  showLoading() {
    this.props.onBuy(false);
    this.updateBtnState(false);
  }

  hideLoading() {
    this.props.onBuy(true);
  }

  goDeposit() {
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

  render() {
    let _state = this.state;
    let _ownMoney = Math.floor(_state.default_money) + Math.floor(_state.default_money) * (parseInt(_state.trade_per) / 100);
    let _ownMoneyEx = Math.floor(_ownMoney);
    if (_ownMoneyEx != _ownMoney) {
      _ownMoney = _ownMoney.toFixed(1);
    }

    let _tradeinfo = this.props.tradeinfo;
    let _trade_status = _tradeinfo
      ? _tradeinfo.trade_status
      : 0;
    let _closeBuy = _tradeinfo
      ? parseInt(_tradeinfo.close_buy)
      : 0;

    let _timePoints = _tradeinfo
      ? _tradeinfo.time_points
      : null;
    let _selectIdx = this.props.selectIdx;
    if (_timePoints && ((_timePoints.length - 1) < _selectIdx)) {
      _selectIdx = 0;
    }

    let _disabled = _trade_status == 0
      ? true
      : false;
    let _selectview = (_timePoints && _timePoints.length > 0)
      ? (<SelectBar disabled={_disabled} timePoints={_timePoints} selectIdx={_selectIdx} onSelectPoint={this.clickTimePoint.bind(this)}/>)
      : null;

    let _currTimePoint = (_timePoints && _timePoints.length > 0)
      ? _timePoints[_selectIdx]
      : null;
    let _currExpireTime = _currTimePoint
      ? (_currTimePoint.expire_time - _closeBuy)
      : 0; //交易时间更新点
    let _crossTime = _currExpireTime - _state.serverTime; //当前时间距离时间更新点的描述
    let _countDownView = "";

    if (_trade_status != 0 && _crossTime > 0 && _crossTime <= 300) { //时间更新点的前5分钟开始倒计时
      _countDownView = (<CountDown endtime={_currExpireTime} timestamp={_crossTime} callTimeIsUp={this.callTimeIsUp.bind(this)} updateWaitingState={this.updateWaitingState.bind(this)}/>);
    }

    let _btnBuyUpCss = _trade_status == 0
      ? "btn buy_up disable"
      : "btn buy_up";
    let _btnBuyDownCss = _trade_status == 0
      ? "btn buy_down disable"
      : "btn buy_down";

    return (
      <div className="panel form">
        {/* <header>
                    <span className="money">{LangClient.i18n(_state.trade_type)}</span>
                </header> */}
        <div className="buy_info">
          <div className="label">
            <em className="income">{LangClient.i18n("Payout")}</em>
            <span className="per">{_state.trade_per}</span>
          </div>
          <em className="label total_income">${_ownMoney}</em>
        </div>
        <div className="form">
          <div className="field">
            <div className="wrap">
              <span className="exp_time">{LangClient.i18n("Expire Time")}</span>{_countDownView}
            </div>
            <div className="select_wrap">
              {_selectview}
            </div>
          </div>
          <div className="field">
            <a href="#" className="btn plus" onClick={this.changeMoney.bind(this, 0)}>-</a>
            <a href="#" className="btn add" onClick={this.changeMoney.bind(this, 1)}>+</a>
            <div className="money">
              <i className="symbol">$</i>
              <input type="number" value={_state.default_money} ref="money" onChange={this.moneyValueChange.bind(this)} onBlur={this.checkMoneyLegal.bind(this)} step="10" min={this.MIN_MONEY} max={this.MAX_MONEY} placeholder="500"/>
            </div>
          </div>
          <div className="field">
            <a href="#" className={_btnBuyUpCss} onClick={this.doBuy.bind(this, "high")}>
              <i className="icon common buy_symbol"></i>{LangClient.i18n("High")}</a>
            <a href="#" className={_btnBuyDownCss} onClick={this.doBuy.bind(this, "low")}>
              <i className="icon common buy_symbol"></i>{LangClient.i18n("Low")}</a>
          </div>
        </div>
        {/* <p>{this.state.form_description}</p> */}
      </div>
    );
  }
}
