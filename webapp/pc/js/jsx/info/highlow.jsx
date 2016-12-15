import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Highlow extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
      <div className="wrap_right_bocp" style={{"display": "none"}}>
          <div>{LangClient.i18n("Call/Put Binary Options")}</div>
          <p>{LangClient.i18n("The standard Binary Option allows speculation on whether the price of an underlying asset will finish above or below its opening price within a specified period.")}
              <br/>
              {LangClient.i18n("If you conclude that the price of an asset will rise within a specified period then open a CALL binary option. Alternatively, if you think that the price of an asset is set to drop then activate a PUT binary option.")}
          </p>

          <p>
              <span className="wrap_right_fw">{LangClient.i18n("Example of a PUT Binary Option")}</span>
          </p>

          <p> {LangClient.i18n("CITI Group has just posted an earnings report that badly missed analysts’ expectations. You deduce that this bank’s shares will plummet over the day. Select the CITI as your underlying asset for your binary option. Choose the daily expiry time. Select investment amount of $100. A payout ratio of 70% and a refund of 15% are displayed. Activate a PUT binary option. An opening price of $40 is recorded. At expiration, CITI’s shares are $39 and you are in-the-money. You receive a payout of $70. (70% of $100 Investment) Alternatively, if CITI’s share price had finished above $40, then you would have been out-of-the-money and would have received a refund of $15. (15% of $500 Investment)")}
          </p>

          <p>
              <span className="wrap_right_fw">{LangClient.i18n("Example of a CALL Binary Option")}</span>
          </p>

          <p> {LangClient.i18n("The EUR/USD has been trading a strong bullish trend for many weeks and has just bounced against a major support level sending it back higher. Select the EURUSD as your underlying asset for your Binary Option.Choose the hourly expiry time.Select investment amount of $100. A payout ratio of 80% and a refund of 10% are displayed. Activate a CALL binary option.An opening price of 1.2700 is recorded.One hour later, the EUR/USD is 1.2710 and you are in-the-money.You receive a payout of $80. (80% of your $100 investment) Alternatively, if the EUR/USD had finished below 1.2700 then you would have been out-of-the-money and would have received a refund of $10. (10% of your $100 investment)")}

          </p>

      </div>
      )
  }
}
