import React from "react";
import LangClient from "./tools/Lang-Client";
import CountDown from "./component/count_down";

export default class TradeLogItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPrice: 0,
      serverTime: 0
    };

    this.currencySymbol = "$";
    this.waiting = false;
  }

  componentDidMount() {}

  update(data, timestamp) {
    if (data) {
      let arr = data.split(",");
      if (arr && arr.length == 3) {
        let price = arr[2];
        this.setState({currentPrice: price, serverTime: timestamp});
        return;
      }
    }

    this.setState({serverTime: timestamp});
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

  onTimeOut() {
    this.props.onTimeOut();
  }

  updateWaitingState(value) {
    this.waiting = value;
  }

  onClickItem() {
    if (this.props.onClickItem) {
      this.props.onClickItem(this.props.loginfo);
    }
  }

  render() {
    let logInfo = this.props.loginfo;
    let name = logInfo.instrument || "";
    let type = logInfo.tradecat || 2;
    let status = parseInt(logInfo.status || 0); // 0: 持仓, 1: 平仓
    let result = parseInt(logInfo.result || 0); // 1: win, 2: lose
    let openPrice = logInfo.openprice || 0;
    let closePrice = parseFloat(logInfo.closeprice || 0);
    let currentPrice = this.state.currentPrice || logInfo.currentprice || 0;
    let expTime = parseInt(logInfo.expiretime || 0);
    let direction = logInfo.direction;

    let liCss = "";
    if (status == 0) {
      if (direction == "high") {
        liCss = "ing up";
      } else {
        liCss = "ing down";
      }
    } else {
      if (direction == "high") {
        liCss = "closed up";
      } else {
        liCss = "closed down";
      }
    }

    let priceCss = "price";
    if (status == 0) {
      if (direction == "up") {
        if (currentPrice >= openPrice) {
          priceCss = "price up";
        } else {
          priceCss = "price down";
        }
      } else {
        if (currentPrice <= openPrice) {
          priceCss = "price up";
        } else {
          priceCss = "price down";
        }
      }
    }

    let leftPrice = openPrice;
    let rightPrice = status == 0
      ? currentPrice
      : closePrice;

    let MAX_COUNT_DOWN = 300;

    let countDownView = (
      <span className="exp_time">{this.formatDate(expTime)}</span>
    );

    if (status == 0) {
      if (type == 1) {
        MAX_COUNT_DOWN = parseInt(logInfo.optiontype);
      } else if (type == 2) {
        MAX_COUNT_DOWN = parseInt(logInfo.close_buy || MAX_COUNT_DOWN);
      }

      let seconds = expTime - this.state.serverTime;
      if (this.waiting || (seconds > 0 && seconds <= MAX_COUNT_DOWN)) {
        countDownView = (<CountDown endtime={expTime} timestamp={seconds} callTimeIsUp={this.onTimeOut.bind(this)} updateWaitingState={this.updateWaitingState.bind(this)}/>);
      } else if (seconds <= 0) {
        setTimeout(() => {
          this.onTimeOut();
        }, 500);
      }
    }

    return (
      <li className={liCss} onClick={this.onClickItem.bind(this)}>
        <div className="content1">
          <span className="exp_label">{LangClient.i18n("Close Time")}:</span>
          {countDownView}
        </div>
        <div className="content2">
          <div className="info_icon">
            <i className="icon trade symbol"></i>
          </div>
          <div className="info_left">
            <div className="name">{LangClient.i18n(name)}</div>
            <div className="price_label">
              <span className="price">{leftPrice}</span>
              <i className="icon dir_right"></i>
              <span className={priceCss}>{rightPrice}</span>
            </div>
          </div>
          <div className="info_right">
            <span className="profit">{LangClient.i18n("Profit")}: {this.currencySymbol}{logInfo.profit}</span>
            <span className="amount">{LangClient.i18n("Investment")}: {this.currencySymbol}{logInfo.amount}</span>
            <div className="amount_wrap">
              <span className="label">{LangClient.i18n("Investment")}: </span>
              <span className="money">{this.currencySymbol}{logInfo.amount}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
