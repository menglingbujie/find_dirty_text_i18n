import React from "react";
import LangClient from "../tools/Lang-Client";
import SelectBar from "../component/selectbar";
import SelectBar2 from "../component/selectbar2";
import CountDown from "../component/count_down";

export default class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      serverTime: 0
    };

    this.waiting = false;
  }

  update(data, timestamp) {
    this.setState({serverTime: timestamp});
  }

  componentDidMount() {
    if (this.state.current != this.props.current) {
      this.setState({current: this.props.current});
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.state.current != nextProps.current) {
      this.setState({current: nextProps.current});
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

  onSelectPoint(value) {
    if (!value) {
      return;
    }

    let tradeInfo = this.props.trade_info;
    let timePoints = (tradeInfo && tradeInfo.time_points) || [];

    let index = -1;
    for (var i = 0; i < timePoints.length; i++) {
      if (timePoints[i].time_point_id == value.time_point_id) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      this.setState({current: index});
      this.props.onChangeTimePoint(index);
    }
  }

  onClickBack() {
    this.props.onBackList();
  }

  onTimeOut() {
    this.props.onTimeOut();
  }

  updateWaitingState(value) {
    this.waiting = value;
  }

  render() {
    let tradeInfo = this.props.trade_info;
    let tradeCode = (tradeInfo && tradeInfo.name) || "";
    let tradeStatus = (tradeInfo && tradeInfo.trade_status) || 0;
    let timePoints = (tradeInfo && tradeInfo.time_points) || [];

    let orderInfo = this.props.order_info;
    let expTime = parseInt((orderInfo && orderInfo.expiretime) || 0);

    let name = LangClient.i18n(tradeCode);
    let selectBar = "";
    let countDown = "";

    if (timePoints && timePoints.length > 0) {
      let disabled = tradeStatus == 0
        ? true
        : false;
      if (orderInfo) {
        selectBar = (
          <span className="time_desc">{this.formatDate(expTime)}</span>
        );
      } else {
        // selectBar = (<SelectBar disabled={disabled} timePoints={timePoints} selectIdx={this.state.current} onSelectPoint={this.onSelectPoint.bind(this)}/>);
        selectBar = (<SelectBar2 disabled={disabled} timePoints={timePoints} selectIdx={this.state.current} onSelectPoint={this.onSelectPoint.bind(this)}/>);
      }

      let MAX_COUNT_DOWN = 300;

      if (orderInfo) {
        if (orderInfo.tradecat == 1) {
          MAX_COUNT_DOWN = parseInt(orderInfo.optiontype);
        } else if (orderInfo.tradecat == 2) {
          MAX_COUNT_DOWN = parseInt(orderInfo.close_buy || MAX_COUNT_DOWN);
        }

        let seconds = expTime - this.state.serverTime;
        if (this.waiting || (seconds > 0 && seconds <= MAX_COUNT_DOWN)) {
          countDown = (<CountDown endtime={expTime} timestamp={seconds} callTimeIsUp={this.onTimeOut.bind(this)} updateWaitingState={this.updateWaitingState.bind(this)}/>);
        } else if (seconds <= 0) {
          setTimeout(() => {
            this.onTimeOut();
          }, 500);
        }
      } else if (tradeInfo.cat == 2) {
        let curTimePoint = timePoints[this.state.current];
        let stopTradeTime = parseInt(curTimePoint.expire_time) - parseInt(tradeInfo.close_buy);
        let seconds = stopTradeTime - this.state.serverTime;
        if (!disabled && (this.waiting || (seconds > 0 && seconds <= MAX_COUNT_DOWN))) {
          countDown = (<CountDown endtime={stopTradeTime} timestamp={seconds} callTimeIsUp={this.onTimeOut.bind(this)} updateWaitingState={this.updateWaitingState.bind(this)}/>);
        } else if (seconds <= 0) {
          setTimeout(() => {
            this.onTimeOut();
          }, 500);
        }
      }
    }

    return (
      <div id="id_trade_info" className="info">
        <div className="left">
          <a className="btn back" onClick={this.onClickBack.bind(this)}>
            {/* <a className="btn back" href="javascript:history.back(-1)"> */}
            <i className="icon back"></i>
          </a>
          <span className="name" onClick={this.onClickBack.bind(this)}>{name}</span>
        </div>
        <i className="seperator"></i>
        <div className="right">
          <div className="select_wrap">
            {selectBar}
          </div>
          <div className="countdown_wrap">
            {countDown}
          </div>
        </div>
      </div>
    );
  }
}
