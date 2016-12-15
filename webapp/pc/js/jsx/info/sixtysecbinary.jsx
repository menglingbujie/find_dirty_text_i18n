import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class SixtyBinary extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
      <div className="wrap_right_bots" style={{"display": "none"}}>
          <div>{LangClient.i18n("The 60 Second Binary")}</div>
          <p>{LangClient.i18n("The 60 Second Binary Option is similar to standard Call/Put Binary Options in that you need only predict whether the asset will go higher or lower.")}</p>
          <p>{LangClient.i18n("60 Seconds Binary Options Example:")}</p>
          <p>
             {LangClient.i18n("The US labor department will to release its all-important non-farm payroll figures today at precisely 8:30am EST. Your fundamental analysis indicates that this figure will be better-than-expected and supportive of riskier assets, such as stocks. You therefore plan to execute a 60 second CALL binary option using the Dow Jones Index as the underlying asset to exploit the ensuing volatility.")}
              {/* <br/>
              {LangClient.i18n("Click the \"60 seconds\" tab on your binary options broker’s platform.")}
              <br/>
              {LangClient.i18n("Select the Dow Jones Index asset. The current value of this asset is 13,020.")}
              <br/>
              {LangClient.i18n("Your broker displays a payout ratio of 85% and a refund of 10%.")} */}
              {/* <br/>
              {LangClient.i18n("The current time is 8.29.30 EST.")}
              <br/>
              {LangClient.i18n("The expiry time is 8.30.30 EST.")}
              <br/>
              {LangClient.i18n("Select investment amount of $100.")}
              <br/>
              {LangClient.i18n("You activate a CALL 60 seconds binary option.")}
              <br/>
              {LangClient.i18n("At expiry time, the Dow Jones Index had, indeed, surged to 13,150 and you are in-the-money. You receive a payout of $85.")}
              <br/>
              {LangClient.i18n("If the Dow Jones Index had dropped below 13,020, then you would have been out-of-the-money and received a refund of $10.")} */}

          </p>
      </div>
      )
  }
}
