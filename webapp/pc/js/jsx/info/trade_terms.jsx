import React from "react";
import $ from "jquery";

import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class TradeTerms extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrap_right_glossary wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("GLOSSARY")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Call option")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("A binary option to which it's expiring price of an asset is higher than the market price, in which the trader will get profit when the market price of an asset is expiring above the current market price.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Pull option")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("A binary option that the expiring price of an asset is lower than the market price, in which the trader will get profit when the market price of an asset is expiring below the current market price.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("IN-THE-MONEY")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("This term means that the market price of the asset is currently trading or has closed and is profitable.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("OUT-OF-THE-MONEY")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">{LangClient.i18n("This term means that the market price of the asset is currently trading or has closed and is not profitable.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("AT-THE-MONEY")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Used when the market price of the asset is currently trading at or has closed at the exact target price.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Boundary Option")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The trader decides whether market price is within or beyond a given price range upon trading maturity.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("ONE-TOUCH OPTION")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">{LangClient.i18n("The trader decides whether the price of the asset will reach a boundary within a certain time frame, it will be profitable as long as the price reaches the boundary.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Market Price")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Market price is the current price of the asset based on the feed by the data provider.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Expiry rate")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The asset price of which an option expires.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Expiry date")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The time and date at which an option expires.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Early Closure")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">{LangClient.i18n("The trader has the right to close the deal before expiry date. They also are profitable if the option is in-the-money option.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Bull market and bear market")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                  {LangClient.i18n("A bull market is a financial market of a group of securities in which prices are rising or are expected to rise above 20%.")}
                      <br/>
                  {LangClient.i18n("Bear market indicates market condition in which the prices of securities are falling, and widespread pessimism causes the negative sentiment to be self-sustaining.")}

                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Centre bank")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("A central bank, is an institution authorized by state that manages a state's currency, money supply, and interest rates, controls the state’s economic situation and supervises commercial institutions.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("Economic indicator")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">{LangClient.i18n("The date that shows the economic growth, downturn or steady state including GDP, unemployment rate, total retail sales of consumer goods and etc.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("American option")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("American options allow option holders to exercise the option at any time prior to and including its maturity date. American options allow investors more opportunities to exercise the contract.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("European option")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("An European option is an option that can only be exercised at the end of its life, at its maturity.")}
                  </div>
              </li>
          </ul>
      </div>
    );
  }
}
