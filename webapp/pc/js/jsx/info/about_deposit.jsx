import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class AboutDeposit extends React.Component {
  constructor(props) {
    super(props);
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render() {
    return (
      <div className="wrap_right_commonQ_deposit wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("About Deposit")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("1. How do I make a deposit?")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                  {LangClient.i18n("After you have registered as a member of Ultrabanc, log in to your account, click 'DEPOSITS' and follow the steps displayed. It is safe to deposit funds into your account as well as hassle free, it only takes a few minutes to complete.")}
                  {/* <br/>
                  {LangClient.i18n("If you have any questions and problems, please contact us by e-mail info@eaglesbanc.com or by phone number (+852) 53482546.")}
                  <br/>
                  {LangClient.i18n("Ultrabanc currently accepts payments from a variety of methods including credit/debit cards, bank wire transfers, Skrill, Neteller, WeChat Pay, Union Pay, Paysafecard, CodePay and PayU for deposit.")} */}

                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("2. Support Currency?")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">{LangClient.i18n("currently we accept USD. Please choose the currency carefully as it cannot be further changed thereafter.")}

                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("3. Minimum Deposit?")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">{LangClient.i18n("Ultrabanc does require a minimum deposit amount of $100 or currency equivalent and reserves the right right to change these limits without prior notice and may request proof of ID for security reasons.")}
                  </div>
              </li>
              {/* <li>
                  <span className="wrap_right_span">4.&nbsp;{LangClient.i18n("Maximum Deposit")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("The maximum deposit amount is $100,000 per transaction or currency equivalent. Ultrabanc reserves the right to change these limits without prior notice and may request proof of ID for security reasons.")}
                  </div>
              </li> */}
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("4. Maximum Deposit")}<span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans">{LangClient.i18n("The maximum deposit amount is $100,000 per transaction or currency equivalent. Ultrabanc reserves the right to change these limits without prior notice and may request proof of ID for security reasons.")}</div>
              </li>
              <li><span className="wrap_right_span">&nbsp;{LangClient.i18n("5. Which payment methods can I use?")}<span className="wrap_right_simg"></span></span>
              <div className="wrap_right_ans">{LangClient.i18n("Ultrabanc allows you to make payments through the method of your choice be it credit card, debit card, wire transfer. The following credit/debit cards are accepted:VISA, MASTERCARD, Carte Bleue, or MAESTRO The lowest amount of payment by credit card is 100 USD.")}</div>
              </li>
              <li><span className="wrap_right_span">&nbsp;{LangClient.i18n("6. How soon after making a deposit can I start trading?")}<span className="wrap_right_simg"></span></span>
              <div className="wrap_right_ans">
              {LangClient.i18n("Some payment transactions are completed instantly while others can take up to 3 days to be received by Ultrabanc. You are free to trade the minute we receive the deposit and funds are credited in your Ultrabanc account. Thus please allow up to 3 working days for the deposit to appear in your balance.")}
              <br/>
              {LangClient.i18n("If you have any questions regarding deposits, please contact us by email at account@ultrabanc.com or by phone at (+1) 631 437 0789.")}
              </div>
              </li>
              <li><span className="wrap_right_span">&nbsp;{LangClient.i18n("7. Why can't I complete a deposit transaction?")}<span className="wrap_right_simg"></span></span>
              <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("Please certify that you are making a deposit in the same language you have registered an account with Ultrabanc, in order to avoid deposit failures. Our platform caters clients globally, to which payment options vary accordingly to the language choosen. You are able to switch languages as you wish when navigating Ultrabanc's website, it is only for deposits that we strongly recommend that you keep the page in the same language you opened an account with.")}></div>
              </li>
          </ul>
      </div>
    );
  }
}
