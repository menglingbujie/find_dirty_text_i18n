import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class HowToTrade extends React.Component {
  constructor(props) {
    super(props);
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render() {
    return (
      <div className="wrap_right_commonQ_trade wrap_right_common_yl" style={{"display": "none"}}>
        <div>{LangClient.i18n("About trade")}</div>
        <ul>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("1. How can I make a trade?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Once you have deposited funds, you can make a trade by clicking on \“high\” if you believe that the price of the chosen asset will rise by expiry, or by clicking on “low” if you believe that the asset price will fall by the expiry time. You will then be asked the amount you wish to ivest, and to approve the trade. The selection may be canceled by clicking on \"X\" at any time before the approval of the trade. Please note that the rate keeps updating in the investment box.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("2. What are the rates displayed in the trading boxes?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Rates are the quoted prices of the underlying assets. The rate is the price offered by ultrabanc, based on live feeds from Reuters. Please not that rates offered by ultrabanc are not always reflective of exact market prices – they can vary up to a few pips. The rates we present in the trading boxes on our home page are those at which ultrabanc is willing to sell the options for.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("3. What is the expiration rate?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("The expiry rate is the price of the underlying asset at the time of expiry according to feed providers such as Reuters. This is the determining factor in if the option has expired in-the-money or out-of-the-money.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("4. What is a Call Option?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("\"Call\" represents the “up” direction that a price may take. If you believe that the price of the asset will rise by the expiry, then “call” is the button to click.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("5. What is a Put Option?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Put represents the “down” direction that a price may take. If you believe that the price of the asset will fall by the expiry time, then “put” is the button to click.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("6. What return will I get in case of a successful investment?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("A successful investment will be in accordance to the percentage displayed for the particular offer you wish to trade. Each option displays its own payout percentage, and optioncc usually offers between 70% - 85% for traditional binary options, but you can trade One Touch options for payouts as high as 550%!")}></div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("7. What is the expiration time?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("The expiration time is the time and date at which an option expires.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("8. Why do the rates continue to change before I make a decision?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Like the market, rates at optioncc are dynamic and change every second. The market fluctuations affect our automatic pricing engine, which displays rates at real-time. However, here at optioncc, rate capturing is as good as technology allows. Additionally, you have the option to cancel your trade if you did not receive the exact rate you wished to trade on. For your convenience, optioncc makes rate analysis as easy as possible, by showing a blinking movement every time the price fluctuates, and by the color indicator, which turns the price green upon upward movement, or red upon downward movement.")}
              {/* <br/>
              {LangClient.i18n("For your convenience, optioncc makes rate analysis as easy as possible, by showing a blinking movement every time the price fluctuates, and by the color indicator, which turns the price green upon upward movement, or red upon downward movement.")} */}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("9. What is Double Up?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans"  dangerouslySetInnerHTML={this.createMarkup("If you are close to your expiry time, and you think that the direction you predicted is on a roll, then you have the chance to “do it again” by clicking on Double Up. By doing this, you can create a new trade with the same conditions, for the current price of the asset. In a nutshell, when things look good, Double Up gives you the opportunity to increase your investment and thus, double your profits. Double Up Benefits: Increase your investment on open positions IMake double the profit on expiry IImmediately capitalize on a strong position")}/>


          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("10. Why am I unable to make a trade?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Unsuccessful trades are usually a result of insufficient funds, or if you are attempting a trade on an asset outside of the market trading hours. If neither of these reasons are the case, please contact us by mail to info@ultrabanc.com, or by phone.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("11. Why the expiry level is different with the chart above showed?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("This is due to market price of the assets changes in a very short time during calculation. And also the delay of the chart due to the speed of internet will also make this difference, especially in short-term options like 60s, 120s. This is due to market price of the assets changes in a very short time, and 60 seconds options’ trading time is very short, the price with very small fluctuations will be amplified. As the web speed factors may cause the delay of trend graph, if you can not accept this price volatility, we do not recommend to trade 60 seconds, 120 seconds and 300 seconds, these short-term options.")}/>

          </li>
        </ul>
      </div>
    );
  }
}
