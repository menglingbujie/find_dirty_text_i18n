import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Onebtnoption extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  render(){
    return (
      <div className="wrap_right_otbo" style={{"display": "none"}}>
          <div>{LangClient.i18n("One Touch Binary Options")}</div>


          <p dangerouslySetInnerHTML={this.createMarkup("One Touch Binary Options are similar to standard Call/Put Binary Options in that you must decide whether a particular asset will go up or go down within in given time frame. One Touch Options are much riskier than Call/Put options in that the asset must actually trade at or “Touch” a certain price in order to win the trade as opposed to just ending higher or lower than the original price. The risk is diminished somewhat by the fact that once the asset touches the strike price you win the trade no matter how much time is left on the contract. If the time expires before the asset reaches the strike price than you lose the investment. Since One Touch Options entail more, risk the payouts are substantially higher than with other types of Binary Options. Payouts range anywhere between 150 – 500% depending on the broker.It is the allure of such high returns that make One Touch Binary Options attractive to some traders.One-touch binary options time frames vary depending on the broker. Some have standard 15 minute to 1 hour ranges, while others offer 3 hour to end of day expirations. You can also activate them over the weekend with the following Friday as expiration. If the target value is above the opening price then you need to open a ‘CALL’ one-touch option. Alternatively, if the target price is below the opening value, then you must activate a PUT one-touch option.")}></p>

          <p><span className="wrap_right_fw" style={{fontWeight:"normal"}}>{LangClient.i18n("One Touch Binary Options Example")}</span></p>

          <p>
        {LangClient.i18n("Germany has just posted an important economic indicator which is much stronger -than-expected. Consequently, you conclude that the Euro will appreciate in value against the US dollar during the current trading day.Click the ‘one-touch’ tab on your binary options broker’s platform.Select the EUR/USD underlying asset. The present value of this currency pair is 1.2800. Your broker displays a target, or Strike, price of 1.2870 with a payout of 500%. The day is Tuesday and the time is 6.00 GMT. The expiry time is 5.00pm GMT, the same day.Select investment amount of $100. Activate a CALL one-touch binary option.If the EUR/USD touched the 1.2870 strike price at least once before the expiry time you are in-the-money and receive a payout of $500. If the EUR/USD had failed to touch 1.2870, then you would have been out-of-the-money and lost your deposit.")}</p>

          {/* <p> {LangClient.i18n("You are presented with a strike price. You can then choose whether the asset will “Touch” the strike price within the time frame or you can choose “No Touch” if you think asset won’t reach the strike price in the time period. If you choose a Touch option then you win the trade the moment the asset reaches the strike price. In the case of a No Touch option if the option expires and the asset did not reach the strike price you win the trade.")}
          </p> */}
      </div>

      )
  }
}
