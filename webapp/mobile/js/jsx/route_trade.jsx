import React from "react";
import $ from "jquery";
import Config from "./config/config";
import Cookie from "./tools/cookie";
import LangClient from "./tools/Lang-Client";

import Header from "./trade/header";
import Info from "./trade/info";
import Carousel from "./trade/carousel";
import PanelBuy from "./trade/panel_buy";
import PanelOrder from "./trade/panel_order";
import PanelChart from "./trade/charts/panel_chart";

const PT_STR_ARR = ["", ".", "..", "..."];

export default class Trade extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeInfo: null,
      orderInfo: null,
      currentPoint: 0
    };

    this.tradeCode = "";
    this.tradeType = "";
    this.currentPointId = -1;
    this.orderId = "";

    this.timestamp = 0;
    this.dateTimer = 0;
    this.socketData = null;

    this.loadingTimer = 0; // loading动画的timer
    this.loadingIdx = 0;

    this.positionMode = false;
  }

  getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {
    this.tradeCode = this.getParameterByName("code") || "";
    this.tradeType = this.getParameterByName("type") || 2;
    this.orderId = this.getParameterByName("order") || 0;

    this.connectSocket();
    this.checkServerTime();
    this.fetchTradeInfo();
    this.showTopLoading();

    this.calcChartHeight();
  }

  calcChartHeight() {
    let totalHeight = $("div.footer").offset().top;
    let panelHeight = 0;
    let headerHeight = 0;
    let infoHeight = 0;
    let caroHeight = 0;

    if (window.getComputedStyle) {
      headerHeight = parseFloat(window.getComputedStyle(document.getElementById("id_trade_header")).height);
      infoHeight = parseFloat(window.getComputedStyle(document.getElementById("id_trade_info")).height);
      caroHeight = parseFloat(window.getComputedStyle(document.getElementById("lb_container")).height);
    } else {
      headerHeight = $("#id_trade_header").height() + 1;
      infoHeight = $("#id_trade_info").height() + 1;
      caroHeight = $("#lb_container").height() + 1;
    }

    panelHeight = totalHeight - headerHeight - infoHeight - caroHeight;
    $("div.panelroot").height(panelHeight + "px");
  }

  connectSocket() {
    if (!this.tradeCode || !io) {
      return;
    }

    let socket = io.connect(Config.socket[Config.env]);
    socket.on('connect', () => {
      socket.emit("subscribe", this.tradeCode);
    });

    socket.on('reconnect', () => {
      // this.stopCheckSocketState();
    });

    socket.on('disconnect', (e) => {
      console.log("on socket disconnect, return: " + e);
      // this.startCheckSocketState();
    });

    socket.on('error', (error) => {
      console.log("on socket error, return: ", error);
      // this.startCheckSocketState();
    });

    socket.on('message', (data) => {
      // parse socket data
      this.socketData = null;
      if (data) {
        let arr = data.split(",");
        if (arr.length == 3 && arr[0] == this.tradeCode && !isNaN(arr[1]) && !isNaN(arr[2])) {
          this.socketData = {
            code: arr[0],
            timestamp: arr[1],
            price: arr[2]
          };

          this.timestamp = parseInt(arr[1]);
        }
      }
    });
  }

  fetchTradeInfo() {
    if (!this.tradeType) {
      // 如果跳转页面时没有type参数，默认买涨/买跌类型
      this.tradeType = 2;
    }

    let _url = "//" + Config.host[Config.env] + Config.api.trade.trade_by_cate;
    let _postData = {
      cat: this.tradeType,
      "lang": Cookie.getCookie("language") || "en",
      "time": this.timestamp
    }

    $.get(_url, _postData, (data, state, resp) => {
      if (data.status != 1) {
        this.setStateEx(null, null, 0);
        return;
      }

      let tradeInfo = null;
      if (!this.tradeCode && data.data.length > 0) {
        // 如果跳转页面时没有code参数，默认第一个
        tradeInfo = data.data[0];
        this.tradeCode = tradeInfo.name;
      } else {
        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].name == this.tradeCode) {
            tradeInfo = data.data[i];
            break;
          }
        }
      }

      let currentPoint = this.state.currentPoint;
      if (tradeInfo) {
        let timePoints = tradeInfo.time_points || [];
        for (var i = 0; i < timePoints.length; i++) {
          if (timePoints[i].time_point_id == this.currentPointId) {
            currentPoint = i;
            break;
          }
        }

        this.currentPointId = (timePoints.length > 0 && timePoints[currentPoint].time_point_id) || -1;
      }

      if (this.orderId > 0 && !this.state.orderInfo) {
        this.fetchOrderInfo(tradeInfo, currentPoint);
      } else {
        let orderInfo = this.positionMode
          ? this.state.orderInfo
          : null;
        this.setStateEx(tradeInfo, orderInfo, currentPoint);
      }
    });
  }

  fetchOrderInfo(tradeInfo, index) {
    let token = Cookie.getCookie("token");
    if (!token) {
      this.setStateEx(tradeInfo, null, index);
      return;
    }

    let _url = "//" + Config.host[Config.env] + Config.api.trade.get_trade_order;
    let _postData = {
      id: this.orderId,
      "access-token": token,
      lang: Cookie.getCookie("language") || "en"
    }

    $.get(_url, _postData, (data, state, resp) => {
      let orderInfo = null;
      if (data.status == 1) {
        orderInfo = data.data;
        let expTime = parseInt(orderInfo.expiretime || 0);
        if (this.timestamp > 0 && expTime <= this.timestamp) {
          // 已完结
          orderInfo = null;
        }

        let tpId = parseInt(orderInfo && orderInfo.time_point_id || -1);
        if (tpId >= 0) {
          let timePoints = tradeInfo.time_points || [];
          for (var i = 0; i < timePoints.length; i++) {
            if (timePoints[i].time_point_id == tpId) {
              index = i;
              this.currentPointId = tpId;
              break;
            }
          }
        }
      }

      this.setStateEx(tradeInfo, orderInfo, index);
    });
  }

  setStateEx(tradeInfo, orderInfo, index) {
    this.setState({tradeInfo: tradeInfo, orderInfo: orderInfo, currentPoint: index});
    this.showKLine(index);
  }

  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.time > this.timestamp) {
          this.timestamp = resp.time;
        }
        localStorage.setItem("server_time", this.timestamp);

        if (this.dateTimer) {
          clearTimeout(this.dateTimer);
        }

        this.updateDate();
      }
    });

    // 每隔30钟校准一下服务器时间
    setTimeout(() => {
      this.checkServerTime();
    }, 30000);
  }

  updateDate() {
    let timestamp = this.timestamp++;
    this.refs.info.update(this.socketData, timestamp);
    this.refs.chart.update(this.socketData, timestamp);
    if (this.refs.buyform) {
      this.refs.buyform.update(this.socketData, timestamp);
    }
    if (this.refs.order) {
      this.refs.order.update(this.socketData, timestamp);
    }

    this.checkExpired();

    this.dateTimer = setTimeout(() => {
      this.updateDate();
    }, 1000);
  }

  checkExpired() {
    let tradeInfo = this.state.tradeInfo;
    if (tradeInfo && this.tradeType == 2 && this.timestamp > 0) {
      let closeBuy = parseInt(tradeInfo.close_buy || 300);
      let timePoints = tradeInfo.time_points || [];

      for (var i = 0; i < timePoints.length; i++) {
        let expTime = parseInt(timePoints[i].expire_time || 0);
        let stopTradeTime = expTime - closeBuy;
        if (this.timestamp >= stopTradeTime) {
          // 到时间了，需要刷新
          this.onRefresh();
          break;
        }
      }
    }
  }

  showKLine(index) {
    this.showTopLoading();
    this.refs.chart.showKLine(this.state.tradeInfo, index, this.serverTime, this.state.orderInfo);
  }

  onBackList() {
    location.href = "/mobile/index?code=" + this.tradeCode;
  }

  onChangeTimePoint(index) {
    if (this.state.currentPoint == index) {
      return;
    }

    this.currentPointId = this.state.tradeInfo.time_points[index].time_point_id;
    this.onPositionMode(false);
    this.setStateEx(this.state.tradeInfo, null, index);
  }

  onTimeOut() {
    this.fetchTradeInfo();
  }

  onRefresh() {
    this.fetchTradeInfo();
  }

  onPositionMode(positionMode) {
    if (this.positionMode == positionMode) {
      return;
    }

    this.positionMode = positionMode;
    if (!positionMode) {
      this.state.orderInfo = null;
      this.orderId = "";
    }
  }

  showTopLoading() {
    $("div#loading").show();

    if (this.loadingTimer > 0) {
      clearInterval(this.loadingTimer);
      this.loadingIdx = 0;
    }

    this.loadingTimer = setInterval(() => {
      this.loadingIdx++;
      if (this.loadingIdx > 3) {
        this.loadingIdx = 0;
      }

      let text = PT_STR_ARR[this.loadingIdx];
      $("span#loading_text").text(text);
    }, 300);
  }

  hideTopLoading() {
    $("div#loading").hide();
    if (this.loadingTimer > 0) {
      clearInterval(this.loadingTimer);
    }
    this.loadingIdx = 0;
  }

  onLoading(show) {
    if (show) {
      this.showTopLoading();
    } else {
      this.hideTopLoading();
    }
  }

  onBuyResult(code, msg) {
    if (code == 1) {
      // buy success
      // 由于购买成功要进行跳转，所以loading页面一直显示着，直到跳走
      location.href = "/mobile/trade_log";
    } else {
      this.hideTopLoading();
    }
  }

  onTradeAgain() {
    location.href = "/mobile/trade?code=" + this.tradeCode + "&type=" + this.tradeType;
  }

  toLogin() {
    location.href = "/mobile/user/login?backurl=trade";
  }

  render() {
    let botPanel = this.state.orderInfo
      ? (<PanelOrder ref="order" trade_info={this.state.tradeInfo} order_info={this.state.orderInfo} current={this.state.currentPoint} onTradeAgain={this.onTradeAgain.bind(this)}/>)
      : (<PanelBuy ref="buyform" trade_info={this.state.tradeInfo} current={this.state.currentPoint} onBuyResult={this.onBuyResult.bind(this)} onLoading={this.onLoading.bind(this)} needToLogin={this.toLogin.bind(this)}/>);
    return (
      <article>
        <Header ref="header"/>
        <div className="content_wrap">
          <Info ref="info" trade_info={this.state.tradeInfo} order_info={this.state.orderInfo} current={this.state.currentPoint} onBackList={this.onBackList.bind(this)} onChangeTimePoint={this.onChangeTimePoint.bind(this)} onTimeOut={this.onTimeOut.bind(this)}/>
          <Carousel ref="carousel"/>
          <div className="panelroot">
            <div className="panel info">
              <PanelChart ref="chart" trade_info={this.state.tradeInfo} order_info={this.state.orderInfo} current={this.state.currentPoint} onRefresh={this.onRefresh.bind(this)} onPositionMode={this.onPositionMode.bind(this)} onLoading={this.onLoading.bind(this)}/> {botPanel}
            </div>
            <div ref="loading" id="loading" className="panel loading">
              <span>{LangClient.i18n("Loading")}</span>
              <span id="loading_text">...</span>
            </div>
          </div>
        </div>
      </article>
    );
  }
}
