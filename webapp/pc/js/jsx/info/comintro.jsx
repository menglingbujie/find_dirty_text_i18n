import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

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
      <div className="wrap_right_aboutUs" style={{"display":"none"}}>
          <div>{LangClient.i18n("About Us")}</div>
          <p>{LangClient.i18n("Ultrabanc.com trading platform is operated independently by Eagle's Banc, who is a leading provider of internet financial services. Eagle's Banc has a strong financial background, an excellent technical operation team and is committed to building a world's leading online platform for binary options trading.")}</p>

          <p>{LangClient.i18n("Ultrabanc mainly provides online trading platform for binary option derivatives. Traders could trade on their computers with Windows, OS or through mobile apps. On our website, traders could invest in multiple assets including stocks, currency pairs, commodities and indices by predicting the price of the underlying asset.")}</p>

          <p dangerouslySetInnerHTML={this.createMarkup("While dedicated to making our customers profit, Ultrabanc also strives to provide our customers with the most satisfying and user-friendly trading experience! Our professional technical team makes constant efforts to bring in the newest and most advanced trading tools to fascilitate easy trading; our online tutorials and up-to-date industry analysis serve the purpose of allowing customers of all levels trade with confidence. In addition to our world-className platform, Ultrabanc also provides quality services. Our customer service team will give professional answers to your questions within a reasonable time frame.")}></p>
      </div>
      )
  }
}
