import React from "react";
import $ from "jquery";
import Config from "../../config/config";
import ChartConfig from "./chart_config";
import ChartView from "./panel_chart_disp";

export default class PanelChart extends React.Component {
  constructor(props) {
    super(props);

    this.tradeInfo = null;
    this.current = 0;
    this.serverTime = 0;
    this.orderInfo = null;
  }

  componentDidMount() {}

  update(data, timestamp) {
    this.serverTime = timestamp;
    this.refs.chart_view.update(data, timestamp);
  }

  checkServerTime(tradeInfo, index, orderInfo) {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      success: (resp) => {
        if (!resp) {
          return;
        }

        this.showKLine(tradeInfo, index, resp.time, orderInfo);
      }
    });
  }

  showKLine(tradeInfo, index, serverTime, orderInfo) {
    if (!tradeInfo) {
      return;
    }

    if (!serverTime) {
      this.checkServerTime(tradeInfo, index, orderInfo);
      return;
    }

    this.tradeInfo = tradeInfo;
    this.current = index;
    this.serverTime = serverTime;
    this.orderInfo = orderInfo;

    let tradeCode = this.tradeInfo.name;
    let tradeType = parseInt(this.tradeInfo.cat);

    let timePointId = 0;
    let maxTime = 0;
    let stopTradeTime = 0;
    let revealTime = 0;

    if (this.orderInfo) {
      timePointId = parseInt(this.orderInfo.time_point_id);
      revealTime = parseInt(this.orderInfo.expiretime);
      let closeBuy = parseInt(this.orderInfo.close_buy || 300);
      if (tradeType == 1) {
        let date = new Date(revealTime * 1000);
        date.setSeconds(0, 0);
        maxTime = date.getTime() / 1000 + 60;
      } else {
        stopTradeTime = revealTime - closeBuy;
        maxTime = revealTime + 60;
      }
    } else {
      let timePoints = this.tradeInfo.time_points;
      let timePointObj = (timePoints && timePoints.length > 0 && timePoints[this.current]) || null;
      timePointId = parseInt((timePointObj && timePointObj.time_point_id) || 1);

      let closeBuy = parseInt(this.tradeInfo.close_buy);
      if (tradeType == 2) {
        revealTime = parseInt(timePointObj.expire_time);
        stopTradeTime = revealTime - closeBuy;
      }

      let timePoint = parseInt((timePointObj && timePointObj.time_point) || 0);
      maxTime = tradeType == 1
        ? this.calcMaxTime(timePoint)
        : (revealTime + 60);
    }

    this.refs.chart_view.showCurve(tradeCode, tradeType, timePointId, maxTime, stopTradeTime, revealTime, orderInfo);
  }

  showTradePoint(tradeInfo) {
    this.refs.chart_view.addTempTradePoint(tradeInfo);
  }

  calcMaxTime(timePoint) {
    let curDate = new Date(this.serverTime * 1000);
    curDate.setSeconds(0, 0);
    let tickNext = curDate.getTime() / 1000 + 60;
    return (tickNext + 2 * timePoint);
  }

  //////////////////////////////////////////////////////////////////////////////
  // callback for chart view
  onError(error, tradeCode, tradeType, positionMode) {
    if (error == 1) {
      // 时间信息过期，可能是交易列表更新不及时
      this.props.onRefresh();
    }
  }

  onSignal(signal, tradeCode, tradeType, positionMode) {
    if (signal == ChartConfig.signal.PREPARE) {
      // 请求到kline数据，通知父元素隐藏loading界面
      this.props.onLoading(false);
    } else if (signal == ChartConfig.signal.SHOW) {
      // 图表已绘制出历史数据
      this.props.onPositionMode(positionMode);
    } else if (signal == ChartConfig.signal.STOP_TRADE) {
      // 停止交易
    } else if (signal == ChartConfig.signal.REVEAL) {
      // 揭晓
      if (positionMode) {
        // 持仓记录到期
        this.props.onPositionMode(false);
      }

      this.props.onRefresh();
    } else if (signal == ChartConfig.signal.END) {
      // 到头
      if (tradeType == 1 && !positionMode) {
        // 非持仓模式短期期权玩法在走到头后只更新一下坐标轴就行
        this.refs.chart_view.updateXAxis();
      } else {
        this.props.onRefresh();
      }
    }
  }

  render() {
    return (<ChartView ref="chart_view" onError={this.onError.bind(this)} onSignal={this.onSignal.bind(this)}/>);
  }
}
