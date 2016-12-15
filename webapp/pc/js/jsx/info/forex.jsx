import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Forex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrap_right_asset_current wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("CURRENCY")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/ZAR：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar and the South African Rand.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 07:00 – 14:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : ZAR=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/TRY：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar currency and the Turkish New Lira currency.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 7:30 – 14:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : TRY=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/SGD：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar and the Singapore Dollar.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 1:00 – 9:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : SGD=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/RUB：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar and the Russian Ruble.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: Mon – Fri 8:00 – 13:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code RUB =")}
                      <br/>
                      {LangClient.i18n("Expiry Rule: (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/JPY：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar currency and the Japanese yen currency.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 7:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : JPY=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/CHF：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange level of United States Dollar and the Swiss Franc.")}
                      <br/>
                      {LangClient.i18n("Trading Time : Mon – Fri 02:00 – 20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : CHF=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("USD/CAD：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the United States Dollar currency and the Canadian Dollar currency.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 7:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : CAD=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("NZD/USD：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange level of the the New Zealand Dollar and the United States Dollar.")}
                      <br/>
                      {LangClient.i18n("Trading Time : Mon – Thu 00:00 – 23:59")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : NZD=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("GBP/USD：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the British Pound currency and the United States Dollar currency.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 02:00 – 20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : GBP=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("EUR/USD：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the Euro and the United States Dollar.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: Mon – Fri 00:00 – 23:59")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code: EUR=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule: (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("EUR/GBP：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the Euro and the British Pound.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 01:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : EURGBP=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("EUR/JPY：")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The exchange rate of the Euro and the Japanese Yen.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 00:00 – 23:59")}
                      {/* <br/>
                      {LangClient.i18n("Reuters code : EURJPY=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
          </ul>
      </div>
    );
  }
}
