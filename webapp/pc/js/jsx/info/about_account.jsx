import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class AboutAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render() {
    return (
      <div className="wrap_right_commonQ_account wrap_right_common_yl" style={{"display": "none"}}>
        <div>{LangClient.i18n("About Account")}</div>
        <ul>
          {/* <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("1. How to manage my account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Log into your account, click MY ACCOUNT, you can change information and manage your account easily.")}
            </div>
          </li> */}
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("1. Can I register more than one account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("No. The same name and the same credit card number can only be used to register one account.")}
            </div>
          </li>
          {/* <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("3. What are the different types of accounts available?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("Eaglets: for first deposits of less than $2,000 Premium: for first deposits ranging from $2,000 - $4,999 Royal: for first deposits of more than $5,000 and up to $10,000 Different accounts enjoy different policies as well and different withdrawal fees.")}/>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("4. Can I add a credit card into my account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("You can add, delete or change your credit card information at anytime. You can also use your bank card to deposit and/or pay for online services.")}
            </div>
          </li> */}
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("2. How to edit my bank account information?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Please contact us as soon as possible by email at account@ultrabanc.com or by phone at (+1) 631 437 0789.")}

            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("3. How to view my trading history?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Log into your account, go to 'Trade', under the graph you are able to see the tabs for 'Open trades' and  'Closed trades'.")}

            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("4. How often are transactions updated in my account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Transactions are updated in real time as your binary options trades are actioned.")}
            </div>
          </li>
          {/* <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("7. Do I receive a confirmation for each transaction?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Every time you activate a binary options trade, you will see an on-screen message confirming that your trade has been placed. You will also receive a confirmation by e-mail with the details of your trade.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("8. Where can I view my past banking transactions?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("To view your past transactions simply click on the \"DEPOSITS AND WITHDRAWALS HISTORY\" tab, located in the \"MY ACCOUNT\" or \"TRADE\".")}
            </div>
          </li> */}
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("5. Is it possible to withdraw my bonus?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans" dangerouslySetInnerHTML={this.createMarkup("Withdrawing your bonus is possible after you have fulfilled the terms and conditions related to the bonus. For further clarification, see the \"PROMOTIONS\" section under \"MARKETING\".")}></div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("6. How are my banking transactions secured?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Financial security is the biggest concern of users engaged in internet finance, but you can rest assure that when trading binary options with Ultrabanc, your financial security is our priority. All transactions are protected with a combination of security systems and firewalls, ensuring that your account and banking details are safe and secure. Our transaction security uses SSL (including both ClickSSL and Thawte) that goes above the industry standard. In addition, Eagle's Banc provides full transparency of the service fee and commission as an important part of its operation. We guarantee you that no additional brokerage fee or hiden commission will be charged. To learn more information about how we protect financial security, please contact us by e-mail cashcrusaders@ultrabanc.com or by phone number (+852) 53482546.")}
            </div>
          </li>
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("7. How do I close my account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("If you wish to close your account, please contact your account manager or send an email request to: info@Ultrabanc.com.")}
            </div>
          </li>
          {/* <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("12. How are my bank transactions secured?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("Ultrabanc regards your transaction security as our top priority. All transactions are protected with a combination of security systems and firewalls, ensuring that your account and banking details are safe and secure. We use SSL (including both ClickSSL and Thawte) that goes above the industry standard to ensure that your sensitive information is protected when conducting transactions with ultrabanc.")}
            </div>
          </li> */}
          <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("8. What is a Swift Code?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("A SWIFT code is the unique identification code of a particular bank that is used when transferring money between banks. Your bank can tell you what its SWIFT code is. If the SWIFT code comprises only eight digits, you will have to insert XXX at the end.")}
            </div>
          </li>
          {/* <li>
            <span className="wrap_right_span">&nbsp;{LangClient.i18n("9. What is the difference between REAL and DEMO account?")}<span className="wrap_right_simg"></span></span>
            <div className="wrap_right_ans">
              {LangClient.i18n("The DEMO account is a demonstration account exactly like the REAL account exept that it serves an educational purpose, meaning that it is the perfect account to not only gain trading practice, but also a good opportunity to familiarize yourself with Ultrabanc's platform. It does not require any deposits and come with a balance of $1000 for you to play, given that no amount is available for withdrawal.")}
              <br/>
              <br/>
              {LangClient.i18n("In order to place real trade transactions at the REAL account, users are required to make at least one deposit. The REAL account also offers different promotional activities from time to time.")}
              <br/>
              <br/>
              {LangClient.i18n("Users can freely switch from DEMO to REAL and vice versa as they wish. To do so, click on the drop menu option right by your name on site's top right corner.")}

            </div>
          </li> */}
        </ul>
      </div>
    );
  }
}
