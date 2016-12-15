import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";
//信息列表
export default class Infolist extends React.Component{
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
      <div className="wrap_right_botsal" style={{"display": "none"}}>
          <div>{LangClient.i18n("Binary Options Trading Signals")}</div>
          <p dangerouslySetInnerHTML={this.createMarkup("Binary Options Signals are alerts that expert traders will provide at the beginning of each trading day which a trader can use to activate trades. There are many different signals services available. There are several ways to diffentiate between the signal providers.")}></p>
              {/* <br/>
              <br/>
              {LangClient.i18n("Success Rate")}
              <br/>
              {LangClient.i18n("Amount of Signals Provided Per Day")}
              <br/>
              {LangClient.i18n("Level of Detail offered with each Signal")}
              <br/>
              {LangClient.i18n("Monthly Subscription Price")}
              <br/>
              {LangClient.i18n("Trial Offer")} */}
          <p dangerouslySetInnerHTML={this.createMarkup("Most providers will have a success rate between 70-80%. Ideally you should test several different signal services with a demo account using the signal trial period and decide which one works best for you;")}></p>
      </div>
      )
  }
}
