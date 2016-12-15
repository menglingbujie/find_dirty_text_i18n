import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import LangClient from "./tools/Lang-Client";

import OptionsChart from "./charts/panel_charts";
import OptionsBuyForm from "./form/panel_buy";
import OptionsHeader from "./form/panel_options_header";
import OrderInfo from "./form/panel_order_info";

const PT_STR_ARR = ["", ".", "..", "..."];

export default class OptionsListBuyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tradeCode: "",
      orderInfo: null
    };

    this.loadingTimer = 0; // loading动画的timer
    this.loadingIdx = 0;
  }

  // 更新header
  reloadFormHeader() {
    if (this.refs.header) {
      this.refs.header.initHeader();
    }
  }

  //重置购买表单title信息
  reloadBuyFormTitleInfo() {
    let _buyform = this.refs.buyform;
    if (_buyform) {
      _buyform.initBuyFormTitleInfo();
    }
  }

  //重置图表
  reloadCharts() {
    let _charts = this.refs.charts;
    if (_charts) {
      this.showTopLoading();
      _charts.showKLineNormal();
    }
  }

  //给图表发数据，除了socketData的其他数据
  dispatchDataToCharts(data) {
    if (data && data.type == 2) {
      // 切换时间点
      this.showTopLoading();
    }

    let _charts = this.refs.charts;
    if (_charts) {
      _charts.listenDispatchData(data);
    }
  }

  checkUnloginState() {
    this.props.needToLogin();
  }

  componentDidMount() {
    this.state.tradeCode = localStorage.getItem("curr_trade_code");
    this.showTopLoading();
  }

  doBuySuccess(orderInfo) {
    this.notifyNewLog(orderInfo);
    this.props.doBuySuccess();
  }

  onBuyError(error) {
    this.props.onBuyError(error);
  }

  update(data, timestamp) {
    if (this.refs.charts) {
      this.refs.charts.update(data, timestamp);
    }

    if (this.refs.header) {
      this.refs.header.update(data, timestamp);
    }

    if (this.refs.buyform) {
      this.refs.buyform.update(data, timestamp);
    }

    if (this.refs.orderinfo) {
      this.refs.orderinfo.update(data, timestamp);
    }
  }

  showTipRect(tradeInfo) {
    if (!tradeInfo) {
      return;
    }

    if (this.refs.charts) {
      this.showTopLoading();
      this.refs.charts.showKLinePositionMode(tradeInfo);
    }

    if (this.refs.header) {
      this.refs.header.showTipRect(tradeInfo);
    }

    this.setState({orderInfo: tradeInfo});
  }

  notifyRecordMode(recordMode) {
    if (this.refs.buyform) {
      this.refs.buyform.notifyRecordMode(recordMode);
    }

    if (!recordMode) {
      this.reloadFormHeader();
      this.setState({orderInfo: null});
      this.props.cancelPositionMode();
    }
  }

  notifyNewLog(data) {
    if (this.refs.charts) {
      this.refs.charts.showTradePoint(data);
    }

    this.setState({orderInfo: data});
  }

  onItemSelected(data) {
    let tradeCode = localStorage.getItem("curr_trade_code");
    this.setState({tradeCode: tradeCode});
  }

  findPriceState(tradeCode) {
    return this.props.findPriceState(tradeCode);
  }

  onClickTimePoint(value) {
    this.props.onClickTimePoint(value);
  }

  updateBuyPanel() {
    let tradeCode = localStorage.getItem("curr_trade_code");
    this.setState({tradeCode: tradeCode});
  }

  notifyTradeList() {
    this.props.notifyTradeList();
  }

  onBuy(finish) {
    if (!finish) {
      this.showTopLoading();
    } else {
      this.hideTopLoading();
    }
  }

  onTradeAgain() {
    this.reloadCharts();
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

  onSocketState(connected) {
    if (this.refs.header) {
      this.refs.header.onSocketState(connected);
    }
  }

  getTradeInfoInPos() {
    return this.refs.charts
      ? this.refs.charts.getTradeInfoInPos()
      : null;
  }

  render() {
    let tradeinfo = this.props.getTradeInfo(this.state.tradeCode);
    let timePointIdx = this.props.getTimePointIdx(this.state.tradeCode);
    let _right_panel = this.state.orderInfo
      ? (<OrderInfo ref="orderinfo" order_info={this.state.orderInfo} onTradeAgain={this.onTradeAgain.bind(this)}/>)
      : (<OptionsBuyForm ref="buyform" tradeinfo={tradeinfo} selectIdx={timePointIdx} onClickTimePoint={this.onClickTimePoint.bind(this)} onBuyError={this.onBuyError.bind(this)} doBuySuccess={this.doBuySuccess.bind(this)} updateLogTable={this.props.updateLogTable} checkUnloginState={this.checkUnloginState.bind(this)} notifyTradeList={this.notifyTradeList.bind(this)} onBuy={this.onBuy.bind(this)}/>);

    return (
      <div className="panel control">
        <OptionsHeader ref="header" findPriceState={this.findPriceState.bind(this)}/> {_right_panel}
        <OptionsChart ref="charts" notifyTradeList={this.notifyTradeList.bind(this)} notifyRecordMode={this.notifyRecordMode.bind(this)} onLoading={this.onLoading.bind(this)}/>
        <div ref="loading" id="loading" className="loading">
          <span>{LangClient.i18n("Loading")}</span>
          <span id="loading_text">...</span>
        </div>
      </div>
    );
  }
}

OptionsListBuyForm.propTypes = {
  findPriceState: React.PropTypes.func,
  updateLogTable: React.PropTypes.func,
  doBuySuccess: React.PropTypes.func,
  unLogin: React.PropTypes.func,
  notifyRecordMode: React.PropTypes.func
}
