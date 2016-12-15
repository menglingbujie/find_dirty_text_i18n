import React from "react";
import $ from "jquery";

import Config from "./config/config";
import Cookie from "./tools/cookie";

import Header from "./header/header";
import OptionsListSlider from "./slider/panel_slider";
import OptionsListBuyForm from "./panel_buyform";
import OptionsListLogTable from "./panel_options_logs";
import Carousel from "./components/carousel";

import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

let OPTIONS_ENV = (Config && Config.env)
  ? Config.env
  : "release";

const DEF_OVER_TIME = 15;

export default class Trade extends ReactServerRenderEntry {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      is_login: false
    }

    this.timestamp = 0;
    this.errTimeStamp = 0;
    this.dateTimer = null;
    this.checkServerTimeTime = null;
    this.socketData = [];

    this.socketStateTimer = 0;
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  // 去除socketData重复的数据，只留最新的不重复数据
  arrayUniq(arr) {
    let newArr = [];
    let obj = {};
    for (let i = arr.length - 1; i >= 0; i--) {
      let _d = arr[i];
      let _first = _d.split(",")[0];
      if (!obj[_first]) {
        newArr.push(_d);
        obj[_first] = true;
      }
    }
    return newArr;
  }

  checkTokenExist() {
    //如果token不存在就更新header
    let _token = Cookie.getCookie("token");
    if (!_token) {
      if (this.refs.header) {
        this.refs.header.doLogout();
      }
    }
  }

  updateDate() {
    let timestamp = this.timestamp++;
    let _socketData = this.arrayUniq(this.socketData); // 数组去重

    this.refs.logTable.updateDate(_socketData, timestamp);
    this.refs.silderList.update(_socketData, timestamp);
    this.refs.buyform.update(_socketData, timestamp);

    this.dateTimer = setTimeout(() => {
      this.updateDate();
    }, 1e3);
  }

  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      async: false,
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.time > this.timestamp) {
          this.timestamp = resp.time;
        }
        localStorage.setItem("server_time", this.timestamp);

        //检查token是否过期
        this.checkTokenExist();

        if (this.dateTimer) {
          clearTimeout(this.dateTimer);
        }
        this.updateDate();
        this.checkErrTime();
      }
    });

    //每隔30钟校准一下服务器时间
    this.checkServerTimeTime = setTimeout(() => {
      this.checkServerTime();
    }, 3e4);
  }

  startCheckSocketState() {
    if (this.socketStateTimer > 0) {
      return;
    }

    this.errTimeStamp = this.timestamp;
    this.refs.buyform.onSocketState(false);

    this.socketStateTimer = setInterval(() => {
      let socket = this.state.socket;
      if (socket && socket.io) {
        if (!socket.connected) {
          // 重连
          socket.io.reconnect();
        } else {
          this.stopCheckSocketState();
        }
      }
    }, 3000);
  }

  stopCheckSocketState() {
    this.refs.buyform.onSocketState(true);
    if (this.socketStateTimer > 0) {
      clearInterval(this.socketStateTimer);
      this.socketStateTimer = 0;
    }
  }

  checkErrTime() {
    if (this.errTimeStamp > 0) {
      let overTime = this.timestamp - this.errTimeStamp;
      if (overTime >= DEF_OVER_TIME) {
        console.log("Disconnection time is " + overTime + " (over than " + DEF_OVER_TIME + ") seconds, refresh chart.");
        this.forceUpdateChart();
      }

      this.errTimeStamp = 0;
    }
  }

  componentDidMount() {
    let socket = io.connect(Config.socket[Config.env]);
    this.setState({socket: socket});

    let _that = this;

    socket.on('connect', function() {
      // 订阅
      this.emit("subscribe", "activelist");
    });

    socket.on('reconnect', function() {
      _that.stopCheckSocketState();
    });

    socket.on('disconnect', function(e) {
      // 订阅
      console.log("on socket disconnect, return: " + e);
      _that.startCheckSocketState();
    });

    socket.on('error', function(error) {
      console.log("on socket error, return: ", error);
      _that.startCheckSocketState();
    });

    //同步服务器时间
    this.checkServerTime();
    socket.on('message', (data) => {
      let obj = JSON.parse(data);
      if (obj) {
        let time = parseFloat(obj.t || 0);
        this.timestamp = this.timestamp < time
          ? time
          : this.timestamp;

        this.socketData = []; // 在重新赋值前才清空
        for (var key in obj) {
          if (key == "t") {
            continue;
          }

          let item = key + "," + time + "," + obj[key];
          this.socketData.push(item);
        }

        this.checkErrTime();
      }
    });
  }

  componentWillUnmount() {
    if (this.dateTimer) {
      clearTimeout(this.dateTimer);
    }
    this.timestamp = 0;
    this.dateTimer = null;
    this.checkServerTimeTime = null;
    this.socketData = [];
  }

  forceUpdateChart() {
    if (this.refs.buyform) {
      this.refs.buyform.reloadCharts();
    }
  }

  //选择不同的交易条目的时候通知图表，根据该tradeCode重新加载图表（重新刷k-line）
  onTradeTypeChange() {
    let _buyform = this.refs.buyform;
    if (!_buyform) {
      return;
    }

    _buyform.reloadFormHeader();
    _buyform.reloadBuyFormTitleInfo();
    _buyform.reloadCharts();
  }

  dispatchDataToCharts(data) {
    if (this.refs.header) {
      this.refs.header.onPositionClosed();
    }

    if (this.refs.buyform) {
      this.refs.buyform.dispatchDataToCharts(data);
    }
  }

  //交易时间到期了需要通知图表，告诉它下一个交易到期的时间点也用此方法
  //选择不同的时间点则通知图表，根据该tradeCode的timepoint，发送给图表
  onChangeTimePoint(timePointInfo) {
    this.dispatchDataToCharts(timePointInfo);

    if (this.refs.buyform) {
      this.refs.buyform.updateBuyPanel();
    }
  }

  onItemSelected(data) {
    if (this.refs.buyform) {
      this.refs.buyform.onItemSelected(data);
    }
  }

  updateLogsTable(buyNew = false) {
    if (this.refs.logTable) {
      this.refs.logTable.forceUpdateTable(buyNew);
    }
  }

  dispatchDataToHeader() {
    if (this.refs.header) {
      this.refs.header.dispatchMoneyChange();
    }
  }

  doLoginSuccess() {
    //登录成功刷新日志列表
    this.updateLogsTable();
  }

  needToLogin() {
    this.unLogin();
    this.refs.header.needToLogin(); //弹出登录框
  }

  unLogin() {
    //退出重置日志列表
    this.forceUpdateChart();
    this.updateLogsTable();
    this.setState({is_login: false});
  }

  doBuySuccess() {
    //通知login变更money
    this.dispatchDataToHeader();
    this.updateLogsTable();
  }

  onBuyError(error) {
    let errCode = error.code || 0;
    if (errCode == 999 || errCode == '999') {
      // trade item was closed on server, tip user and refresh the trade-list
      if (this.refs.silderList) {
        this.refs.silderList.refreshTradeList();
      }
    }
  }

  doShowTipRect(tradeInfo) {
    if (this.refs.buyform) {
      this.refs.buyform.showTipRect(tradeInfo);
    }
  }

  notifyNewLog(data) {
    if (this.refs.buyform) {
      this.refs.buyform.notifyNewLog(data);
    }
  }

  getTradeInfo(tradeCode) {
    if (this.refs.silderList) {
      return this.refs.silderList.getTradeInfo(tradeCode);
    }

    return null;
  }

  getTimePointIdx(tradeCode) {
    if (this.refs.silderList) {
      return this.refs.silderList.getTimePointIdx(tradeCode);
    }

    return 0;
  }

  findPriceState(tradeCode) {
    if (this.refs.silderList) {
      return this.refs.silderList.findPriceState(tradeCode);
    }

    return "";
  }

  onClickTimePoint(value) {
    if (this.refs.silderList) {
      this.refs.silderList.onClickTimePoint(value);
    }
  }

  notifyTradeList() {
    if (this.refs.silderList) {
      this.refs.silderList.refreshTradeList();
    }
  }

  cancelPositionMode() {
    if (this.refs.logTable) {
      this.refs.logTable.cancelPositionMode();
    }
  }

  getTradeInfoInPos() {
    return this.refs.buyform
      ? this.refs.buyform.getTradeInfoInPos()
      : null;
  }

  getTimeStamp() {
    return this.timestamp;
  }

  render() {
    return (
      <article>
        <Header ref="header" isLogin={this.state.is_login} doLoginSuccess={this.doLoginSuccess.bind(this)} doLoginout={this.unLogin.bind(this)} getTimeStamp={this.getTimeStamp.bind(this)}/>
        <Carousel/>
        <div className="container">
          <OptionsListSlider ref="silderList" socketObj={this.state.socket} onTradeTypeChange={this.onTradeTypeChange.bind(this)} onItemSelected={this.onItemSelected.bind(this)} onChangeTimePoint={this.onChangeTimePoint.bind(this)} onFocusUpdateChart={this.forceUpdateChart.bind(this)}/>
          <div className="content">
            <OptionsListBuyForm ref="buyform" notifyTradeList={this.notifyTradeList.bind(this)} onBuyError={this.onBuyError.bind(this)} doBuySuccess={this.doBuySuccess.bind(this)} getTradeInfo={this.getTradeInfo.bind(this)} getTimePointIdx={this.getTimePointIdx.bind(this)} findPriceState={this.findPriceState.bind(this)} onClickTimePoint={this.onClickTimePoint.bind(this)} updateLogTable={this.updateLogsTable.bind(this)} needToLogin={this.needToLogin.bind(this)} cancelPositionMode={this.cancelPositionMode.bind(this)}/>
            <OptionsListLogTable ref="logTable" doShowTipRect={this.doShowTipRect.bind(this)} dispatchDataToCharts={this.dispatchDataToCharts.bind(this)} dispatchToUpdateMoney={this.dispatchDataToHeader.bind(this)} notifyNewLog={this.notifyNewLog.bind(this)} getTradeInfoInPos={this.getTradeInfoInPos.bind(this)}/>
          </div>
        </div>
      </article>
    );
  }
}
