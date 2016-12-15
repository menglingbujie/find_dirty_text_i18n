import React from "react";
import $ from "jquery";
import LangClient from "../tools/Lang-Client";

export default class PanelOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPrice: 0
    };

    this.serverTime = 0;
  }

  update(data, timestamp) {
    this.serverTime = timestamp;
    if (data && data.price) {
      let price = parseFloat(data.price);
      this.setState({currentPrice: price});
    }
  }

  componentDidMount() {}

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

  onTradeAgain() {
    this.props.onTradeAgain();
  }

  render() {
    let userInfo = Cookie.getCookie("userinfo");
    let userInfoObj=null;
    try{userInfoObj = (userInfo && JSON.parse(unescape(userInfo))) || null;}catch(e){
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
    }
    let currencySymbol = (userInfoObj && userInfoObj.currency_symbol) || "$";

    let orderInfo = this.props.order_info;
    let openPrice = parseFloat(orderInfo.openprice);
    let rate = parseFloat(orderInfo.payout);

    let descDirection = LangClient.i18n("Direction") + ": ";
    let descOpenTime = LangClient.i18n("Open Time") + ": " + this.formatDate(orderInfo.opentime);
    let descOpenPrice = LangClient.i18n("Entry Price") + ": " + currencySymbol + openPrice;

    let resultMoney = parseInt(orderInfo.amount);
    let currentPrice = this.state.currentPrice || parseFloat(orderInfo.currentprice);
    let direction = orderInfo.direction;
    if (direction == "high") {
      if (currentPrice > openPrice) {
        resultMoney += resultMoney * rate;
        resultMoney = Number(resultMoney).toFixed(2);
      } else if (currentPrice < openPrice) {
        resultMoney = 0;
      }
    } else {
      if (currentPrice < openPrice) {
        resultMoney += resultMoney * rate;
        resultMoney = Number(resultMoney).toFixed(2);
      } else if (currentPrice > openPrice) {
        resultMoney = 0;
      }
    }

    let descReturn = LangClient.i18n("Expected Return") + ": " + currencySymbol + resultMoney;

    let arrowCss = direction == "high"
      ? "icon direction up"
      : "icon direction down";

    return (
      <div className="panel order">
        <div className="info">
          <div className="row">
            <span className="desc">{descDirection}</span>
            <i className={arrowCss}></i>
          </div>
          <div className="row">
            <span className="desc">{descOpenTime}</span>
          </div>
          <div className="row">
            <span className="desc">{descOpenPrice}</span>
          </div>
          <div className="row">
            <span className="desc">{descReturn}</span>
          </div>
        </div>
        <i className="seperator"></i>
        <a className="btn buy_continue" onClick={this.onTradeAgain.bind(this)}>
          <span className="btn_label">{LangClient.i18n("Trade again")}</span>
        </a>
      </div>
    );
  }
}
