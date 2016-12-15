import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class DialogGetInsurance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      overTime: false
    };

    this.requesting = false;
    this.timer = 0;
  }

  componentDidMount() {
    $("#dialogContainerId").on("click", {
      that: this
    }, this.onClickEvent);

    this.state.timestamp = this.props.servertime;
    if (this.state.timestamp == 0) {
      this.checkServerTime();
    }
    this.startCountDown();
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.state.timestamp = nextProps.servertime;
    if (this.state.timestamp == 0) {
      this.checkServerTime();
    }
    this.startCountDown();
  }

  componentWillUnmount() {
    $("#dialogContainerId").off("click", {
      that: this
    }, this.onClickEvent);

    this.stopCountDown();
  }

  startCountDown() {
    let status = this.props.status;
    let firstDepositTime = (status && status.firstDepositTime) || 0;
    let overTime = this.state.timestamp >= (firstDepositTime + 24 * 3600);
    if (status && status.showFirstDayNotice && !overTime) {
      this.stopCountDown();

      this.timer = setInterval(() => {
        let timestamp = this.state.timestamp + 1;
        let overTime = timestamp >= (firstDepositTime + 24 * 3600);
        this.setState({timestamp: timestamp, overTime: overTime});

        if (overTime) {
          this.stopCountDown();
        }
      }, 1000);
    }
  }

  stopCountDown() {
    if (this.timer > 0) {
      clearInterval(this.timer);
    }
  }

  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.time > this.state.timestamp) {
          this.setState({timestamp: resp.time});
        }
      }
    });
  }

  onClickEvent(evt) {
    if (evt.target.className.match(/dialog/)) {
      evt.data.that.closeDialog();
    }
  }

  onClickBtn() {
    if ($("#btn_accept").hasClass("disabled")) {
      return;
    }

    this.requesting = true;

    let _language = Cookie.getCookie("language");
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.onResult(99999, "");
      return;
    }

    let _url = "//" + Config.host[Config.env] + Config.api.user.get_insurance;
    $.get(_url, {
      "access-token": _token,
      language: _language
    }, (resp) => {
      this.onResult(resp.status, resp.msg);
    });
  }

  onResult(status, msg) {
    this.requesting = false;
    this.closeDialog();
    this.props.onGetInsuranceResult({status: status, msg: msg});
  }

  closeDialog() {
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }

  formatDate(timestamp) {
    let _date = new Date(timestamp * 1000);
    let _year = _date.getFullYear();
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
    return _month + "/" + _day + "/" + _year + " " + _h + ":" + _m;
  }

  getCountDown(endTime) {
    let totalSeconds = endTime - (this.state.timestamp || this.props.servertime);
    if (totalSeconds <= 0 || totalSeconds > 24 * 60 * 60) {
      return "";
    }

    let hours = Math.floor(totalSeconds / 3600);
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return hours + ":" + minutes + ":" + seconds;
  }

  render() {
    let status = this.props.status;

    let countDownView = "";
    let noticeView = "";
    if (status.showFirstDayNotice && !this.state.overTime) {
      countDownView = (
        <div className="nav_countdown">{this.getCountDown(status.firstDepositTime + 24 * 3600)}</div>
      );

      let noticeDesc = LangClient.i18n("Insurance covers your deposits made in the first 24 hours. The more you deposit, the more you can get.");
      noticeView = (
        <div className="nav_pro2_cont_t" dangerouslySetInnerHTML={{
          __html: noticeDesc
        }}></div>
      );
    }

    let depositDesc = "$" + status.firstDayDeposit;

    let lossDesc = "$" + status.totalLoss;
    if (parseInt(status.totalLoss) < 0) {
      lossDesc = "$0";
    }

    let targetAmount = status.currentAmount + "/" + status.targetAmount;
    let targetStyle = status.currentAmount >= status.targetAmount ? {color: "#ffc900"} : {};

    let insuranceAmount = "$" + status.insuranceAmount;

    let tip = status.insuranceAmount == 0
      ? LangClient.i18n("Your total net loss does not yet qualify to be insured")
      : LangClient.i18n("A trader can only participate in the Insurance Activity once");

    let firstDepositTimeDesc = this.formatDate(status.firstDepositTime || 0);

    let btnCss = status.insuranceAmount == 0
      ? "disabled"
      : "";

    return (
      <div className="dialog insurance get">
        <div className="panel">
          <div className="nav_pro2">
            <div className="nav_pro2_head">
              <div className="nav_pro2_head_in">
                <div>{LangClient.i18n("Get Your Insurance")}
                  <span className="nav_pro2_head_in_cancel" onClick={this.closeDialog.bind(this)}></span>
                </div>
              </div>
              <div className="nav_pro2_cont">
                <div className="nav_pro2_activedet">
                  <a href="/activity/insurance">{LangClient.i18n("Activity Details")}</a>
                </div>
                {countDownView}
                {noticeView}
                <div className="nav_pro2_activedet_cont">
                  <ul>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Total deposit available for insurance:")}</div>
                      <div className="nav_pro2_activedet_conts">{depositDesc}</div>
                    </li>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Net Loss Amount:")}</div>
                      <div className="nav_pro2_activedet_conts">{lossDesc}</div>
                    </li>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Required Trading Amount:")}</div>
                      <div className="nav_pro2_activedet_conts" style={targetStyle}>{targetAmount}</div>
                    </li>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Insurance Coverage Ratio:")}</div>
                      <div className="nav_pro2_activedet_conts">50%</div>
                    </li>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Insurance Compensation Pay-outs:")}</div>
                      <div className="nav_pro2_activedet_conts" style={{color: "#ffc900"}}>{insuranceAmount}</div>
                    </li>
                    <li>
                      <div className="nav_pro2_activedet_contf">{LangClient.i18n("Participation Time:")}</div>
                      <div className="nav_pro2_activedet_conts" style={{"font-size": "12px"}}>{firstDepositTimeDesc}</div>
                    </li>
                  </ul>
                </div>
                <div style={{
                  clear: "both"
                }}></div>
                <div className="nav_pro2_cont_tip">{tip}</div>
                <div className="nav_pro2_cont_btn">
                  <input id="btn_accept" className={btnCss} type="button" value={LangClient.i18n("Accept")} onClick={this.onClickBtn.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
