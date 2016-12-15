import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class AboutWithdrawal extends React.Component {
  constructor(props) {
    super(props);
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render() {
    return (
      <div className="wrap_right_commonQ_withdraw wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("About Withdrawal")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("1. How to make a withdrawal?")}<span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("After logging into your account, click \"WITHDRAWALS\" and follow the steps displayed. An account verification is required every time you use a new payment method, but once you have done this you will not need to verify that particular card in order to make a withdrawal again. Please make sure that all your documentations are correct including your ID, bank account and bank card information. If you have any questions and/or problems regarding withdrawals, please contact us by e-mail info@ultrabanc.com or by phone number (+852) 53482546. Documents required for authentication are as follow: 1. Proof of Identity: Driver's license/passport/any other form of government issued identity card with photo. 2. Proof of residence (if proof of identity cannot be provided): Bank or credit card statement, recent utility bill, (water, electricity or telephone bill), municipal tax receipt, etc. 3. If you are using a credit card or debit card, please send a picture of both sides of your bank card, displaying the last four digits of your bank card. We require this additional information as proof of ownership of your credit card. Once your account is verified, click \"WITHDRAWALS\", enter the amount you would like to withdraw, then click \"Send\". We will process all withdrawal requests within three working days.")}/>


              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("2. What is the minimum withdrawal amount?")}<span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("The minimum withdrawal amount is $100.")}></div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp; {LangClient.i18n("3. What Payment methods can I use for withdrawing funds?")}<span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans">
                     {LangClient.i18n("Currently Ultrabanc only offers one method for withdrawals being direct wire transfers. Withdrawal requests will only be paid after all documents are received and passed through the authentication process.")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("4. Can I cancel a withdrawal? How so?")}<span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("Of course! Even if your withdrawal request is being processed, you can still cancel the withdrawal and return the money to your Ultrabanc account. The withdrawal cancellation option is especially useful when you do not have sufficient funds in your account, but you wish to continue trading. You can simply cancel your withdrawal by contacting us by phone or email.")}></div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("5. Is there a maximum withdrawal amount?")} <span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("No. You may withdraw all of your funds at any time.")}></div>
              </li>
              <li>
              <span className="wrap_right_span">&nbsp;{LangClient.i18n("6. What Payment methods can I use for withdrawing funds?")} <span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("Currently Ultrabanc offers two method for withdrawals being:1. Credit card - We operate a \"return to source\" policy which means that credit card withdrawals will have funds only returned back to the same card used to fund the trading account, in 3 to 5 working days.  2. Bank Transfers - all other withdrawal requests are paid through bank transfers in 1 to 3 working  days. * Requests for withdrawals will only be paid after all documents have been received and after they have passed the authentication process.* ULTRABANC platform strictly abides by the Anti-Money Laundering Policy. Please ensure that any payment you make to us is made from a card and account in YOUR name and not from another party. Any remittances from/to third party sources will be rejected.")}></div>
              </li>
              <li>
                  <span className="wrap_right_span">&nbsp;{LangClient.i18n("7. Can I cancel a withdrawal?")} <span className="wrap_right_simg"></span></span>
                  <div className="wrap_right_ans">{LangClient.i18n("You are able to cancel a withdrawal request only if the money has not yet been processed by the bank. To do so, go to 'Trade', and then 'Account', your deposit/withdrawal history will show the available 'Cancel' button. If the money has already been processed by the bank, the withdrawal cancelation button will not be available. The withdrawal cancellation option is especially useful when you do not have sufficient funds in your account, but you wish to continue trading.")}</div>
              </li>
          </ul>
      </div>
    );
  }
}
