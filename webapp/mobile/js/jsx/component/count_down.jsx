import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from "../tools/Lang-Client";

export default class CountDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      text: ""
    };

    this.counttime = 0;
    this.updateTimer = null; //倒计时imer
    this.callTimeIsUp = null; //延迟调time up的timer
  }

  formatTime(timestamp) {
    let _m = Math.floor(timestamp / 60);
    let _s = timestamp % 60;
    let _rm = (_m < 10)
      ? ("0" + _m)
      : _m;
    let _rs = (_s < 10)
      ? ("0" + _s)
      : _s;
    return _rm + ":" + _rs;
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

        if (this.callTimeIsUp) {
          clearTimeout(this.callTimeIsUp)
        }

        let _servertime = resp.time;
        localStorage.setItem("server_time", _servertime);

        let _errorCrossTime = this.props.endtime - _servertime; //服务器时间与截止时间的差值
        if (_errorCrossTime <= 0) {
          _errorCrossTime = 0;
        }
        // console.log(_servertime+"---"+this.props.endtime+"==error timer=="+_errorCrossTime);
        if (_errorCrossTime > 0) {
          this.callTimeIsUp = setTimeout(() => {
            this.props.callTimeIsUp();
          }, (_errorCrossTime + 1) * 1000)
        } else {
          this.callTimeIsUp = setTimeout(() => {
            this.props.callTimeIsUp();
          }, 1e3);
        }
      }
    });
  }

  updateTime() {
    this.setState({
      timestamp: this.counttime--
    });

    if (this.counttime < 0) {
      // console.log('count_down should call time is up ');
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      this.setState({text: LangClient.i18n("Wait")})
      this.props.updateWaitingState(true);
      this.checkServerTime(); //与服务器校准时间，等待误差时间到
    } else {
      this.updateTimer = setTimeout(() => {
        this.updateTime();
      }, 1e3);
    }
  }

  componentWillReceiveProps(nextProps) {
    let waitingState = nextProps.waitingState;
    if (waitingState) {
      this.setState({text: LangClient.i18n("Wait")});
    } else {
      this.clearTimer();
      this.state.text = "";
      this.counttime = nextProps.timestamp;
      this.updateTime();
    }
  }

  componentDidMount() {
    let waitingState = this.props.waitingState;
    if (waitingState) {
      this.setState({text: LangClient.i18n("Wait")});
    } else {
      this.clearTimer();
      this.counttime = this.props.timestamp;
      this.updateTime();
    }
  }

  componentWillUpdate() {
    //实时校准时间戳
    this.state.timestamp = this.counttime;
  }

  componentWillMount() {
    //组件将mount时校准时间戳
    this.state.timestamp = this.counttime;
    this.state.text = "";
  }

  componentWillUnmount() {
    this.clearTimer();
    this.counttime = 0;

    this.state = {
      timestamp: 0,
      text: ""
    };
  }

  clearTimer() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null; //倒计时imer
    }

    if (this.callTimeIsUp) {
      clearTimeout(this.callTimeIsUp);
      this.callTimeIsUp = null; //延迟调time up的timer
    }
  }

  render() {
    let _text = this.state.text != ""
      ? this.state.text
      : this.formatTime(this.state.timestamp);

    return (
      <time>
        <i className="icon common clock empty"></i>
        <span className="counttime">{_text}</span>
      </time>
    );
  }
}
