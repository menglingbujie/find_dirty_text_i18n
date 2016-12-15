import React from "react";
import LangClient from "../tools/Lang-Client";

export default class ProfHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  switchBtn(idx) {
    if (idx == this.props.current) {
      return;
    }

    this.props.onSwitch(idx);
  }

  render() {
    let userInfo = this.props.userinfo;

    let helloDesc = LangClient.i18n("Hi");
    if (userInfo) {
      helloDesc += ", " + userInfo.first_name;
    }

    let balanceDesc = userInfo
      ? ((userInfo.currency_symbol || "$") + (userInfo.balance || 0))
      : "$0";
    let totalTrade = userInfo
      ? (userInfo.total_amount || 0)
      : 0;
    let winTimes = userInfo
      ? (userInfo.win_times || 0)
      : 0;
    let totalTimes = userInfo
      ? (userInfo.total_times || 0)
      : 0;

    let btnProfCss = this.props.current == 0
      ? "btn profile select"
      : "btn profile";
    let btnCardCss = this.props.current == 1
      ? "btn card select"
      : "btn card";

    return (
      <div className="panel header">
        <div className="wrap">
          <i className="avatar"></i>
          <span className="hello">{helloDesc}</span>
          <div className="info">
            <div className="field">
              <span className="number">{balanceDesc}</span>
              <span className="label">{LangClient.i18n("Balance")}</span>
            </div>
            <div className="seperator"></div>
            <div className="field">
              <span className="number">{totalTrade}</span>
              <span className="label">{LangClient.i18n("Total Trading Volume")}</span>
            </div>
            <div className="seperator"></div>
            <div className="field">
              <span className="number">{winTimes}</span>
              <span className="label">{LangClient.i18n("Profitable Trading Times")}</span>
            </div>
            <div className="seperator"></div>
            <div className="field">
              <span className="number">{totalTimes}</span>
              <span className="label">{LangClient.i18n("Total Transaction Times")}</span>
            </div>
          </div>
          <div className="switches">
            <a className={btnProfCss} onClick={this.switchBtn.bind(this, 0)}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      {LangClient.i18n("Profile")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </a>
            <a className={btnCardCss} onClick={this.switchBtn.bind(this, 1)}>
              <table>
                <tbody>
                  <tr>
                    <td>{LangClient.i18n("Bank Card")}</td>
                  </tr>
                </tbody>
              </table>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
