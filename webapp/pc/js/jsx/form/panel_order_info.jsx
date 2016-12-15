import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import LangClient from '../tools/Lang-Client';

import Config from "../config/config";
import Cookie from "../tools/cookie";
import CountDown from "../table/count_down";

export default class OrderInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serverTimestramp: 0,
      timestamp: 0,
      socketData: ""
    }

    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };

    this.waitingState = false;
    this.currency_symbol = "";
  }

  update(data, timestamp) {
    if (!data) {
      return;
    }

    for (var i = 0; i < data.length; i++) {
      let _str = data[i].split(",");
      let _tradeCode = _str[0]; //trade code
      if (_tradeCode == this.props.order_info.instrument) {
        this.setState({serverTimestramp: timestamp, socketData: data[i]});
        break;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };
  }

  componentWillMount() {
    this.session.old_price = this.props.order_info.openprice;
  }

  componentWillUnmount() {
    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };
    this.waitingState = false;
  }

  formatDate(timestamp) {
    let _date = new Date(timestamp * 1000);
    let __month = _date.getMonth() + 1;
    let _month = (__month < 10)
      ? "0" + __month
      : __month;
    let _day = (_date.getDate() < 10)
      ? "0" + _date.getDate()
      : _date.getDate();
    let _h = (_date.getHours() < 10)
      ? "0" + _date.getHours()
      : _date.getHours();
    let _m = (_date.getMinutes() < 10)
      ? "0" + _date.getMinutes()
      : _date.getMinutes();
    let _s = (_date.getSeconds() < 10)
      ? "0" + _date.getSeconds()
      : _date.getSeconds();
    return _month + "/" + _day + " " + _h + ":" + _m + ":" + _s;
  }

  callTimeIsUp() {
    this.waitingState = false;
  }

  updateWaitingState(value) {
    this.waitingState = value;
  }

  tradeAgain() {
    this.props.onTradeAgain();
  }

  render() {
    let _props = this.props;
    let _state = this.state;

    if (!this.currency_symbol) {
      let userinfo = Cookie.getCookie("userinfo");
      let userinfoObj = userinfo
        ? JSON.parse(userinfo)
        : null;
      if (userinfoObj) {
        this.currency_symbol = userinfoObj.currency_symbol || "$";
      }
    }

    let _tableItemInfo = _props.order_info;
    var MAX_COUNTDOWN_TIME = 300;
    let _buyState = (_tableItemInfo.direction == "high")
      ? "up"
      : "down";

    let _price = this.session.old_price || _tableItemInfo.currentprice;
    let _priceState = this.session.old_state || "";
    let _times = this.session.old_time || this.formatDate(_tableItemInfo.expiretime);
    let _selectValue = "";
    let _whatfuck_win = 0;
    let _crossPrice = -99999;

    if (_state.socketData && _state.socketData.length > 0) {
      let _str = _state.socketData.split(",");
      let _tradeCode = _str[0]; //trade code
      if (_tradeCode == _tableItemInfo.instrument) { //只更新指定tradecode的数据
        _price = _str[2]; //price in
        this.tradePrice = _price;
        _crossPrice = _price - this.session.old_price;

        //记录变更的价格和价格状态
        this.session.old_price = _tableItemInfo.openprice;
        this.session.old_price_state = _priceState;
      }
    }

    let _buyPrice = _tableItemInfo.openprice;
    _whatfuck_win = _tableItemInfo.amount;
    //根据建仓方向判断涨跌
    if (_buyState == "up") {
      if (_crossPrice != -99999) {
        _priceState = (_crossPrice >= 0)
          ? "up"
          : "down";
      }

      //如果买涨，市场价格>买入价格就Win
      if (_price > _buyPrice) {
        _whatfuck_win = parseFloat(_tableItemInfo.amount) + parseFloat(_tableItemInfo.amount) * _tableItemInfo.payout;
        _whatfuck_win = Number(_whatfuck_win).toFixed(2);
      } else if (_price < _buyPrice) {
        _whatfuck_win = 0;
      } else if (_price == _buyPrice) {}
    } else {
      if (_crossPrice != -99999) {
        _priceState = (_crossPrice <= 0)
          ? "up"
          : "down";
      }

      //如果买跌，市场价格>买入价格就Lose
      if (_price < _buyPrice) {
        _whatfuck_win = parseFloat(_tableItemInfo.amount) + parseFloat(_tableItemInfo.amount) * _tableItemInfo.payout;
        _whatfuck_win = Number(_whatfuck_win).toFixed(2);
      } else if (_price > _buyPrice) {
        _whatfuck_win = 0;
      } else if (_price == _buyPrice) {}
    }

    this.session.old_price = _tableItemInfo.openprice;
    this.session.old_state = _priceState;

    let _timestamp = parseInt(_tableItemInfo.expiretime) - _state.serverTimestramp;

    // 短期期权使用optiontype定义的时间间隔，如60s，120s
    // 买涨买跌使用close_buy定义的时间间隔，如300，600
    let _tradecat = _tableItemInfo.tradecat;
    if (_tradecat == 1 || _tradecat == "1") {
      MAX_COUNTDOWN_TIME = parseInt(_tableItemInfo.optiontype);
    } else if (_tradecat == 2 || _tradecat == "2") {
      MAX_COUNTDOWN_TIME = parseInt(_tableItemInfo.close_buy);
    }

    _times = this.formatDate(_tableItemInfo.expiretime);
    let _times_view = (
      <span className="desc">{_times}</span>
    );
    //这里判断还是有些问题，因为不同时间段买同一个商品的话，通过上面trade_type判断就太单薄了。需要trade_code+购买的序列id才可精确地倒计时
    if (this.waitingState || (_timestamp <= MAX_COUNTDOWN_TIME && _timestamp >= 0)) {
      _times_view = (<CountDown waitingState={this.waitingState} endtime={parseInt(_tableItemInfo.expiretime)} timestamp={_timestamp} updateWaitingState={this.updateWaitingState.bind(this)} callTimeIsUp={this.callTimeIsUp.bind(this)}/>);
    } else if (_timestamp < 0) {
      // 已经过期了，执行过期逻辑
      setTimeout(() => {
        this.callTimeIsUp();
      }, 500);
    }
    this.session.old_time = _times;

    let _jcjg = LangClient.i18n("Entry Price") + ":";
    let _jyfx = LangClient.i18n("Direction") + ":";
    let _tzje = LangClient.i18n("Amount") + ":";
    let _jcsj = LangClient.i18n("Open Time") + ":";
    let _dqjg = LangClient.i18n("Strike Price") + ":";
    let _yqsy = LangClient.i18n("Expected Return") + ":";
    let _dqsj = LangClient.i18n("Close Time") + ":";

    let _priceCss = "desc price " + _priceState;
    let _amount = this.currency_symbol + _tableItemInfo.amount;
    _whatfuck_win = this.currency_symbol + _whatfuck_win;

    return (
      <div className="panel order_info">
        <span className="name">{LangClient.i18n(_tableItemInfo.instrument)}</span>
        <span className="type">{LangClient.i18n(_tableItemInfo.tradecat_alias)}</span>
        {/* 建仓价格 */}
        <div className="row">
          <span className="desc">{_jcjg}</span>
          <span className="desc">{_tableItemInfo.openprice}</span>
        </div>
        {/* 交易方向 */}
        <div className="row">
          <span className="desc">{_jyfx}</span>
          <i className={"arrow icon common buy " + _buyState}></i>
        </div>
        {/* 投资金额 */}
        <div className="row">
          <span className="desc">{_tzje}</span>
          <span className="desc money">{_amount}</span>
        </div>
        {/* 建仓时间 */}
        <div className="row">
          <span className="desc">{_jcsj}</span>
          <span className="desc">{this.formatDate(_tableItemInfo.opentime)}</span>
        </div>
        <i className="seperator"></i>
        {/* 当前价格 */}
        <div className="row">
          <span className="desc">{_dqjg}</span>
          <span className={_priceCss}>{_price}</span>
        </div>
        {/* 预期收益 */}
        <div className="row">
          <span className="desc">{_yqsy}</span>
          <span className="desc money">{_whatfuck_win}</span>
        </div>
        {/* 到期时间 */}
        <div className="row">
          <span className="desc">{_dqsj}</span>
          {_times_view}
        </div>
        <a href="#" className="btn buy_continue" onClick={this.tradeAgain.bind(this)}>
          {LangClient.i18n("Trade Again")}
        </a>
      </div>
    );
  }
}
