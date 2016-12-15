import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class DialogInsuranceActivity extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    localStorage.setItem("insurance_act_pop", this.props.servertime);
    $("#dialogContainerId").on("click", {
      that: this
    }, this.onClickEvent);
  }

  componentWillUnmount() {
    $("#dialogContainerId").off("click", {
      that: this
    }, this.onClickEvent);
  }

  onClickEvent(evt) {
    if (evt.target.className.match(/dialog/)) {
      evt.data.that.closeDialog();
    }
  }

  onClickBtn() {
    this.closeDialog();
    this.props.doAction();
  }

  closeDialog() {
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render() {
    let language = Cookie.getCookie("language");
    if (language == "zh-CN" || language == "zh-TW" || language == "zh-HK") {
      language = "cn";
    }

    let bannerCss = "nav_pro_banner " + language;

    return (
      <div className="dialog insurance activity">
        <div className="panel">
          <div className="nav_pro">
            <div className={bannerCss}>
              <div className="nav_pro_banner_det">
                <a href="/activity/insurance">{LangClient.i18n("Activity Details")}</a>
              </div>
              <div className="nav_pro_banner_cancel" onClick={this.closeDialog.bind(this)}></div>
            </div>
            <div className="nav_pro_tip">
              <div className="nav_pro_con">{LangClient.i18n("If a trader losses, Ultrabanc will share the loss with the trader.")}</div>
              <div className="nav_pro_fil">{LangClient.i18n("How it works:")}</div>
              <div className="nav_pro_ul">
                <ul>
                  <li>{LangClient.i18n("1. The Insurance Activity is available for existing traders who have not yet completed a deposit. Ultrabanc will give an insurance of the same value as traders\' very first deposit.")}</li>
                  <li>{LangClient.i18n("2. The insurance covers traders\' very first deposit and the additional deposits made until mid-night of that same day, to which it guarantees a maximum coverage of $10,000 per trader.")}</li>
                  <li dangerouslySetInnerHTML={this.createMarkup("3. Traders are entitled to obtain an insurance money worth 50% of their total net loss, when only their net loss equals to 90% of their cumulative deposited amount of that first deposit day.")}></li>
                  <li dangerouslySetInnerHTML={this.createMarkup("4. Traders who meet the above requirements for insurance coverage are entitled to obtain the reimbursement valued at 50% of their insurance coverage amount.")}></li>
                  <li>{LangClient.i18n("5. The insurance will be valid for period of one year starting from the date of traders\' first deposit after Insurance Activity Launch.")}</li>
                </ul>
              </div>
            </div>
            <div className="nav_pro_btn">
              <input type="button" value={LangClient.i18n("Deposit")} onClick={this.onClickBtn.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
