import React from "react";
import ChartConfig from "./chart_config";
import ChartView from "./panel_chart_disp";

export default class OptionsChart extends React.Component {
  constructor(props) {
    super(props);
    this.serverTime = 0;
  }

  componentDidMount() {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", () => {
        this.showKLineNormal();
      });
    } else if (document.attachEvent) {
      document.attachEvent("onload", () => {
        this.showKLineNormal();
      }, false);
    }
  }

  getTradeInfoInPos() {
    return this.refs.chart_view ? this.refs.chart_view.getTradeInfoInPos() : null;
  }

  //////////////////////////////////////////////////////////////////////////////
  // interface for show
  showKLineNormal() {
    let tradeCode = localStorage.getItem("curr_trade_code");
    let timePointId = 1;
    let stopTradeTime = 0;
    let revealTime = 0;
    let closeBuy = 0;

    let tradeInfo = localStorage.getItem("curr_trade_info");
    let infoArr = tradeInfo
      ? tradeInfo.split(",")
      : [];
    if (infoArr.length >= 12) {
      timePointId = infoArr[5];
      revealTime = parseInt(infoArr[8]);
      closeBuy = parseInt(infoArr[11]);
    }

    let navIndex = parseInt(sessionStorage.getItem("nav_index"));
    if (navIndex == 1) {
      stopTradeTime = 0;
      revealTime = 0;
    } else if (navIndex == 2) {
      stopTradeTime = revealTime - closeBuy;
    }

    let maxTime = this.calcMaxTime(navIndex);

    this.refs.chart_view.showCurve(tradeCode, navIndex, timePointId, maxTime, stopTradeTime, revealTime);
  }

  showKLinePositionMode(tradeInfo) {
    if (!tradeInfo) {
      return;
    }

    let tradeCode = tradeInfo.instrument;
    let tradeType = tradeInfo.tradecat;
    let timePointId = tradeInfo.time_point_id;
    let revealTime = parseInt(tradeInfo.expiretime);

    let stopTradeTime = 0;
    let maxTime = 0;

    let closeBuy = parseInt(tradeInfo.close_buy);
    if (isNaN(closeBuy) || typeof(closeBuy) == "undefined") {
      // 后台没返close_buy字段的时候，赋一个默认值，300秒
      closeBuy = 5 * 60;
    }

    if (tradeType == 1) {
      let date = new Date(revealTime * 1000);
      date.setSeconds(0, 0);
      maxTime = date.getTime() / 1000 + 60;
    } else if (tradeType == 2) {
      stopTradeTime = revealTime - closeBuy;
      maxTime = revealTime + 60;
    }

    this.refs.chart_view.showCurve(tradeCode, tradeType, timePointId, maxTime, stopTradeTime, revealTime, tradeInfo);
  }

  showTradePoint(tradeInfo) {
    this.showKLinePositionMode(tradeInfo);
  }

  calcMaxTime(tradeType) {
    if (this.serverTime <= 0) {
      this.serverTime = parseInt(localStorage.getItem("server_time"));
    }

    let curDate = new Date(this.serverTime * 1000);
    curDate.setSeconds(0, 0);
    let tickNext = curDate.getTime() / 1000 + 60;

    let tradeInfo = localStorage.getItem("curr_trade_info");
    let infoArr = tradeInfo
      ? tradeInfo.split(",")
      : [];
    if (infoArr.length < 12) {
      return 0;
    }

    if (tradeType == 1) {
      let interval = parseInt(infoArr[0]);
      return (tickNext + 2 * interval);
    } else if (tradeType == 2) {
      let expTime = parseInt(infoArr[8]);
      return (expTime + 60);
    }

    return 0;
  }

  //////////////////////////////////////////////////////////////////////////////
  // callback for chart view
  onError(error, tradeCode, tradeType, positionMode) {
    if (error == 1) {
      // 时间信息过期，可能是交易列表更新不及时
      this.props.notifyTradeList();
    }
  }

  onSignal(signal, tradeCode, tradeType, positionMode) {
    if (signal == ChartConfig.signal.PREPARE) {
      // 请求到kline数据，通知父元素隐藏loading界面
      this.props.onLoading(false);
    }
    else if (signal == ChartConfig.signal.SHOW) {
      // 图表已绘制出历史数据
      this.props.notifyRecordMode(positionMode);
    } else if (signal == ChartConfig.signal.STOP_TRADE) {
      // 停止交易
    } else if (signal == ChartConfig.signal.REVEAL) {
      // 揭晓
      if (positionMode) {
        // 持仓记录到期
        this.props.notifyRecordMode(false);
        this.showKLineNormal();
      } else {
        this.props.notifyTradeList();
      }
    } else if (signal == ChartConfig.signal.END) {
      // 到头
      if (tradeType == 1 && !positionMode) {
        // 非持仓模式短期期权玩法在走到头后只更新一下坐标轴就行
        this.refs.chart_view.updateXAxis();
      } else {
        this.props.notifyTradeList();
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // data drive
  update(data, timestamp) {
    this.serverTime = timestamp;

    // 检查图表状态
    if (this.checkDispError()) {
      return;
    }

    this.refs.chart_view.update(data, timestamp);
  }

  checkDispError() {
    let cfgTradeCode = localStorage.getItem("curr_trade_code");
    let viewTradeCode = this.refs.chart_view.getTradeCode();
    let positionMode = this.refs.chart_view.isPositionMode();
    if (!positionMode && cfgTradeCode && viewTradeCode && cfgTradeCode != viewTradeCode) {
      // 配置里显示的当前项和图表展示的当前项不一致，刷新图表
      this.showKLineNormal();
      // console.log("Current trade info in localStorage is different with chart's cur-trade-info, refresh chart.");

      return true;
    }

    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // notification from container or outer component
  // type: 1, time is up
  // type: 2, change time point
  // type: 3, table order item revealed
  listenDispatchData(data) {
    if (!data) {
      return;
    }

    let type = parseInt(data.type);
    if (type == 2) {
      this.showKLineNormal();
    } else if (type == 3) {
      this.refs.chart_view.updateTempMarker();
    }
  }

  render() {
    return (<ChartView ref="chart_view" onError={this.onError.bind(this)} onSignal={this.onSignal.bind(this)}/>);
  }
}
