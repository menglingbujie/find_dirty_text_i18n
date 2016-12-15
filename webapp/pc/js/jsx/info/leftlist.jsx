import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";
//信息列表
export default class Infolist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="wrap_left">
        <ul className="wrap_left_ul">
          <li value="0">
            <a href="#" className="usinactive"><span>{LangClient.i18n("Information Bulletin")}</span></a>
            <ul className="wrap_left_sub" id="activity" >
            </ul>
          </li>
          <li value="-1">
            <a href="#" className="inactive usinactive"><span>{LangClient.i18n("About us")}</span></a>
            <ul className="wrap_left_sub" id="ContactUs">
              <li className="last" value="1"><a href="#">·&nbsp;{LangClient.i18n("Contact Us")}</a></li>
              {/* <li className="last" value="2"><a href="#">·&nbsp;{LangClient.i18n("Prosepcts")}</a></li> */}
              <li className="last" value="3"><a href="#">·&nbsp;{LangClient.i18n("Analysts")}</a></li>
              <li className="last" value="4"><a href="#">·&nbsp;{LangClient.i18n("About Us")}</a></li>
            </ul>
          </li>
          <li value="-1">
            <a href="#" className="inactive usinactive"><span>{LangClient.i18n("About Binary Options")}</span></a>
            <ul className="wrap_left_sub" id="features" >
              <li className="last" value="5"><a href="#">·&nbsp;{LangClient.i18n("Binary Options Introduction")}</a></li>
              <li className="last 60Seconds" value="6" ><a href="#">·&nbsp;{LangClient.i18n("60 Second Binary Options")}</a></li>
              <li className="last Signals" value="7" ><a href="#">·&nbsp;{LangClient.i18n("Binary Options Signals")}</a></li>
              <li className="last HighLow" value="8" ><a href="#">·&nbsp;{LangClient.i18n("Call/Put Binary Options")}</a></li>
              <li className="last OneTouch" value="9" ><a href="#">·&nbsp;{LangClient.i18n("Touch-to-pay")}</a></li>
            </ul>
          </li>
          {/* <li value="10">
            <a href="#" className="usinactive"><span>{LangClient.i18n("Economic Calendar")}</span></a>
          </li> */}
          <li value="11">
            <a href="#" className="usinactive"><span>{LangClient.i18n("Glossary")}</span></a>
            <ul id="Glossary"></ul>
          </li>
          <li value="-1">
            <a href="#" className="inactive usinactive"><span>{LangClient.i18n("FAQs")}</span></a>
            <ul className="wrap_left_sub" id="faqs" >
              <li className="last" value="12"><a href="#">·&nbsp;{LangClient.i18n("About Deposits")}</a></li>
              <li className="last" value="13"><a href="#">·&nbsp;{LangClient.i18n("About withdraws")}</a></li>
              <li className="last" value="14"><a href="#">·&nbsp;{LangClient.i18n("Account FAQs")}</a></li>
              <li className="last Tradingfaq" value="15"><a href="#">·&nbsp;{LangClient.i18n("Trading FAQs")}</a></li>
            </ul>
          </li>
          <li value="-1">
            <a href="#" className="inactive usinactive"><span>{LangClient.i18n("Asset Index")}</span></a>
            <ul className="wrap_left_sub" >
              <li className="last" value="16"><a href="#">·&nbsp;{LangClient.i18n("currencies")}</a></li>
              <li className="last" value="17"><a href="#">·&nbsp;{LangClient.i18n("stocks")}</a></li>
              <li className="last" value="18"><a href="#">·&nbsp;{LangClient.i18n("indices")}</a></li>
              <li className="last" value="19"><a href="#">·&nbsp;{LangClient.i18n("commodities")}</a></li>
            </ul>
          </li>
          <li value="-1">
            <a href="#" className="inactive usinactive"><span>{LangClient.i18n("Legal details")}</span></a>
            <ul className="wrap_left_sub" id="leagle">
              <li className="last Terms" value="20"><a href="#terms_conditions">·&nbsp;{LangClient.i18n("Terms & Conditions")}</a></li>
              <li className="last Security" value="21"><a href="#security_privacy">·&nbsp;{LangClient.i18n("Security & Privacy")}</a></li>
              <li className="last GeneralDisclaimer" value="22"><a href="#general_disclaimer">·&nbsp;{LangClient.i18n("General & Disclaimer")}</a></li>
              <li className="last AML" value="23"><a href="#AML">·&nbsp;{LangClient.i18n("AML")}</a></li>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}
