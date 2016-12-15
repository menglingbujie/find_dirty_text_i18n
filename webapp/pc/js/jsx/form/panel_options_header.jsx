import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import MMap from "../tools/mmap";

export default class OptionsHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeCode: "",
      curPrice: "",
      direction: 'up'
    };

    this.hideWifi = true;

    this.curSocketData = new MMap();
    this.animTimer = 0;
    this.iconIndex = 0;
  }

  // 提供给上层调用者更新价格用
  update(data, timestamp) {
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        let infoArr = item.split(",");
        if (infoArr.length >= 3) {
          let name = infoArr[0];
          let price = infoArr[2];

          if (name == this.state.tradeCode) {
            let direction = price >= this.state.curPrice
              ? 'up'
              : 'down';
            this.setState({curPrice: price, direction: direction});
          }

          let preData = this.curSocketData.get(name);
          if (preData) {
            let direction = parseFloat(price) >= parseFloat(preData.price)
              ? "up"
              : "down";
            this.curSocketData.set(name, {
              price: price,
              direction: direction
            });
          } else {
            this.curSocketData.set(name, {
              price: price,
              direction: ""
            });
          }
        }
      }
    }
  }

  initHeader() {
    let tradeCode = localStorage.getItem("curr_trade_code");
    let curInfo = localStorage.getItem("curr_trade_info");
    if (!curInfo || !tradeCode) {
      return;
    }
    let price = curInfo.split(",")[4];
    let direction = this.props.findPriceState(tradeCode);
    this.setState({tradeCode: tradeCode, curPrice: price, direction: direction});
  }

  showTipRect(tradeInfo) {
    if (tradeInfo) {
      let tradeCode = tradeInfo.instrument;
      let data = this.curSocketData.get(tradeCode);
      if (data) {
        this.setState({tradeCode: tradeCode, curPrice: data.price, direction: data.direction});
      } else {
        this.setState({tradeCode: tradeInfo.instrument, curPrice: tradeInfo.currentprice, direction: ""});
      }
    }
  }

  componentDidMount() {
    this.initHeader();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curPrice != this.state.curPrice
      ? true
      : false;
  }

  onSocketState(connected) {
    if (connected) {
      this.stopWifiAnimation();
    } else {
      this.startWifiAnimation();
    }
  }

  startWifiAnimation() {
    if (this.animTimer > 0) {
      clearInterval(this.animTimer);
    }
    this.animTimer = setInterval(() => {
      this.iconIndex++;
      if (this.iconIndex > 2) {
        this.iconIndex = 0;
      }

      $("i.signal").removeClass("show").eq(this.iconIndex).addClass("show");
    }, 1000);
  }

  stopWifiAnimation() {
    $("i.signal").removeClass("show");
    $("i.signal").hide();
    if (this.animTimer > 0) {
      clearInterval(this.animTimer);
      this.animTimer = 0;
      this.iconIndex = 0;
    }
  }

  render() {
    let name = LangClient.i18n(this.state.tradeCode);
    let price = (typeof(name) != "undefined" && name.length > 0)
      ? this.state.curPrice
      : "";

    let arrow_state = price.length > 0
      ? "arrow"
      : "arrow hide";
    return (
      <div className="options_header">
        <div className={this.state.direction}>
          <div className="wrap">
            <i className="signal s0"></i>
            <i className="signal s1"></i>
            <i className="signal s2"></i>
            <span className="trade_name">{name}</span>
          </div>
          <div className="wrap">
            <span className={arrow_state}></span>
            <span className="trade_price">{price}</span>
          </div>
        </div>
      </div>
    );
  }
}
