import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Config from "../config/config";
import CountDown from "./count_down";

export default class TableOrderItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serverTimestamp: 0,
      socketData: ""
    }

    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };
  }

  componentWillMount() {
    this.session.old_price = this.props.tableItemInfo.openprice;
  }

  componentWillUnmount() {
    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.session = {
      old_price: 0,
      old_state: "",
      old_time: ""
    };
  }

  update(data, timestamp) {
    if (!data) {
      return;
    }

    for (var i = 0; i < data.length; i++) {
      let _str = data[i].split(",");
      let _tradeCode = _str[0]; // trade code
      if (_tradeCode == this.props.tableItemInfo.instrument) {
        this.setState({serverTimestamp: timestamp, socketData: data[i]});
        break;
      }
    }
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

  callTimeIsUp(data = null) {
    let _tableItemInfo = data || this.props.tableItemInfo;

    let _itemId = _tableItemInfo.id;
    let _tradeCode = _tableItemInfo.instrument;
    let _tradeType = _tableItemInfo.tradecat;
    let _tradeOpenTime = _tableItemInfo.opentime;
    let _tradeOpenPrice = _tableItemInfo.openprice;
    let _tradeDirection = _tableItemInfo.direction;

    let _type = 3;
    let _type_name = "Trade finish";

    this.props.callTimeIsUp({
      item_id: _itemId,
      trade_code: _tradeCode,
      trade_type: _tradeType,
      trade_open_time: _tradeOpenTime,
      trade_open_price: _tradeOpenPrice,
      trade_direction: _tradeDirection,
      type: _type,
      type_name: _type_name
    });
  }

  updateWaitingState(value) {}

  onClickItem(trade_info) {
    this.props.showTipRect(trade_info);
  }

  render() {
    let _props = this.props;
    let _state = this.state;

    let _tableItemInfo = _props.tableItemInfo;
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
      let _tradeCode = _str[0]; // trade code
      if (_tradeCode == _tableItemInfo.instrument) {
        _price = _str[2]; // price in
        this.tradePrice = _price;
        _crossPrice = _price - this.session.old_price;

        // 记录变更的价格和价格状态
        this.session.old_price = _tableItemInfo.openprice;
        this.session.old_price_state = _priceState;
      }
    }

    let _buyPrice = _tableItemInfo.openprice;
    _whatfuck_win = _tableItemInfo.amount;
    // 根据建仓方向判断涨跌
    if (_buyState == "up") {
      if (_crossPrice != -99999) {
        _priceState = (_crossPrice >= 0)
          ? "up"
          : "down";
      }

      // 如果买涨，市场价格 > 买入价格就 Win
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

      // 如果买跌，市场价格 > 买入价格就 Lose
      if (_price < _buyPrice) {
        _whatfuck_win = parseFloat(_tableItemInfo.amount) + parseFloat(_tableItemInfo.amount) * _tableItemInfo.payout;
        _whatfuck_win = Number(_whatfuck_win).toFixed(2);
      } else if (_price > _buyPrice) {
        _whatfuck_win = 0;
      } else if (_price == _buyPrice) {}
    }

    this.session.old_price = _tableItemInfo.openprice;
    this.session.old_state = _priceState;

    let _timestamp = parseInt(_tableItemInfo.expiretime) - (_state.serverTimestamp || _props.servertime);

    // 短期期权使用 optiontype 定义的时间间隔，如 60s，120s
    // 买涨买跌使用 close_buy 定义的时间间隔，如 300，600
    let _tradecat = _tableItemInfo.tradecat;
    if (_tradecat == 1 || _tradecat == "1") {
      MAX_COUNTDOWN_TIME = parseInt(_tableItemInfo.optiontype);
    } else if (_tradecat == 2 || _tradecat == "2") {
      MAX_COUNTDOWN_TIME = parseInt(_tableItemInfo.close_buy);
    }

    _times = this.formatDate(_tableItemInfo.expiretime);
    // 这里判断还是有些问题，因为不同时间段买同一个商品的话，通过上面 trade_type 判断就太单薄了。需要 trade_code + 购买的序列id才可精确地倒计时
    let waitingState = _props.isWaiting(_tableItemInfo.id) || (_timestamp <= 0);
    if (waitingState || (_timestamp <= MAX_COUNTDOWN_TIME)) {
      _times = (<CountDown waitingState={waitingState} endtime={parseInt(_tableItemInfo.expiretime)} timestamp={_timestamp} updateWaitingState={this.updateWaitingState.bind(this)} callTimeIsUp={this.callTimeIsUp.bind(this)}/>);
    }
    if (_timestamp <= 0) {
      // 已经过期了，执行过期逻辑
      setTimeout(() => {
        this.callTimeIsUp(_tableItemInfo);
      }, 500);
    }
    this.session.old_time = _times;

    let _trStyle = _priceState + " " + _props.curStyle;

    return (
      <tr className={_trStyle} onClick={this.onClickItem.bind(this, _tableItemInfo)}>
        <td>{LangClient.i18n(_tableItemInfo.tradecat_alias)}</td>
        <td>{LangClient.i18n(_tableItemInfo.instrument)}</td>
        <td>{this.formatDate(_tableItemInfo.opentime)}</td>
        <td>{_tableItemInfo.openprice}</td>
        <td>
          <i className={"arrow icon common buy " + _buyState}></i>
        </td>
        <td className="price">{_price}</td>
        <td>{_tableItemInfo.amount}</td>
        <td>{_whatfuck_win}</td>
        <td>{_times}</td>
      </tr>
    )
  }
}
