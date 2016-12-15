import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Binaryop extends React.Component{
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
      <div className="wrap_right_bo" style={{"display": "none"}}>
          <div>{LangClient.i18n("What are Binary Options?")}</div>
          <p>{LangClient.i18n("Binary Options are also called fixed payouts, binaries and digital options. They are deemed to be a simpler and more effective method of investing compared to directly trading stocks, currencies and commodities. As such, they are viewed to be the optimum choice for beginners and the less experienced trader. This is because trading binary options requires just the assessment of only two primary factors.These are selecting the market direction and the expiry time for the underlying asset of interest. Binary options possess other important advantages over other forms of trading including high payouts and pre-determined risk exposure. In addition, investors just need to make a minimum initial deposit in order to commence trading. Binary options are contracts that payout a pre-advised profit for a winning trade whereas they refund a percentage of the initial deposit in the case of losses. In addition,traders only have to focus on determining just the direction of price movements and not their size or magnitude.")}</p>

          <p> {LangClient.i18n("Simplicity is the essence of trading binary options because there can only be two possible outcomes. Youcan either win a pre-defined payout or lose a percentage of your investment. Although binary options are structured about underlying assets such as currencies, stocks, commodities or indices, you do not need to perform any due diligence on them. To activate an option, you must first decide on the amount you want to risk. You then need to assess in which direction you expect the price of your binary option to advance.")}</p>

          <p dangerouslySetInnerHTML={this.createMarkup("You should open a ‘call’ binary option if you think that it will increase in value so that its final price exceeds its opening or strike price by just one trading increment at your selected expiry time. If you are successful, you will then receive payouts as high as 80% of your invested amount. However, if the final value of your binary option is below its opening or strike price at expiration then you will receive a refund that can be as high as 15% of your deposit depending on your broker. Alternatively, if you anticipate that price will drop below your opening or strike price within a pre-selected expiry time, then you should open a ‘put’ option. Your broker will pay you exactly the same percentages as stated above for the ‘call’ option depending on your result.")}></p>
      </div>
      )
  }
}
