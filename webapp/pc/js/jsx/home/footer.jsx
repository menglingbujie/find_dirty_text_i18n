import React from "react";
import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class Footer extends React.Component{
  constructor(props){
    super(props);
    this.copyRightInfo = {
      "en":[
        "The site is owned and managed by Finance Managers Co. Limited based at Govant Building 1st Floor PO Box 1276 Port Vila in Vanuatu",
        "Regulated by the Vanuatu authorities under License 14745",
      ],
      "zh-CN":[
        "Business enterprise regulated under the laws of Saint Vincent",
        "Finance Managers Co. Limited, Govant Building 1st Floor, PO Box 1276, Port Vila, Vanuatu",
        "Securities Dealer License Number: 14745",
      ],
      "pl":[
        "The site is owned and managed by Finance Managers Co. Limited based at Govant Building 1st Floor PO Box 1276 Port Vila in Vanuatu",
        "Regulated by the Vanuatu authorities under License 14745",
      ],
      "pt":[
        "The site is owned and managed by Finance Managers Co. Limited based at Govant Building 1st Floor PO Box 1276 Port Vila in Vanuatu",
        "Regulated by the Vanuatu authorities under License 14745",
      ]
    }
    this.state={
      copyright:[],
      lang:""
    }
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  componentDidMount(){
    let _copyright=this.copyRightInfo[LangClient.states.lang];
    let _tpl = "";
    // if( == "zh-CN"){
    //     _tpl = '()';
    // }
    this.setState({
      copyright:this.copyRightInfo[LangClient.states.lang],
      lang:Cookie.getCookie("language")
    });
  }
  render(){
    let _lang = this.state.lang;

    return (<div className="footer">
      <div className="wrap">
        <div className="item aboutus">
          <h2>{LangClient.i18n("ULTRABANC")}</h2>
          <ul className="list">
            <li><a href="/info?ContactUs">{LangClient.i18n("Contact Us")}</a></li>
            <li><a href="/guide">{LangClient.i18n("User guide")}</a></li>
            <li><a href="/info?Glossary">{LangClient.i18n("Terminologies")}</a></li>
            <li><a href="/info?faqs#Tradingfaq">{LangClient.i18n("Trading FAQs")}</a></li>
            <li><a href="/coop">{LangClient.i18n("Cooperation")}</a></li>
            <li><a href="http://sensecent.com/login#register" target="_blank" style={{color: '#ffc900'}}>{LangClient.i18n("Affiliate Program")}</a></li>    
          </ul>
        </div>
        <div className="item info_trade">
          <h2>{LangClient.i18n("EDUCATION")}</h2>
          <ul className="list">
            <li><a href="/info?features#60Seconds">{LangClient.i18n("60 Seconds")}</a></li>
            <li><a href="/info?features#HighLow">{LangClient.i18n("High/Low")}</a></li>
            <li><a href="/info?features#OneTouch">{LangClient.i18n("One Touch")}</a></li>
            <li><a href="/info?features#Signals">{LangClient.i18n("Signals")}</a></li>
          </ul>
        </div>
        <div className="item info_law">
          <h2>{LangClient.i18n("LEGAL DETAILS")}</h2>
          <ul className="list">
            <li><a href="/info?leagle#Terms">{LangClient.i18n("Terms and Conditions")}</a></li>
            <li><a href="/info?leagle#Security">{LangClient.i18n("Security & Privacy")}</a></li>
            <li><a href="/info?leagle#GeneralDisclaimer">{LangClient.i18n("General Disclaimer")}</a></li>
            <li><a href="/info?leagle#AML">{LangClient.i18n("AML")}</a></li>
          </ul>
        </div>
        <div className="item description">{LangClient.i18n("Ultrabanc trading platform, is a leading provider of internet financial services. Ultrabanc has a strong financial background, an excellent technical operation team and it is committed to building a world's leading online platform for binary options trading. Traders can trade from their computers through Windows and can invest in multiple assets including stocks, currency pairs, commodities and indices by predicting the price of the underlying asset.")}</div>
        <div className="item qrcode">
          <i className="qrcode"></i>
          <em>{LangClient.i18n("Trade")}</em>
        </div>
      </div>
      <div className="footer_risk">
        {
          this.state.copyright.map((val,index)=>{
            if(index<=1){
              return (<p key={index}>{LangClient.i18n(val)}</p>);
            }else{
              if(_lang=="zh-CN"){
                let _licenseImg = this.urlCdn+"/pc/images/license.png";
                return (<p key={index}><img src={_licenseImg} id="lisenceLogo" /><a id="lisenceLink" target="_blank" href="https://www.vfsc.vu/wp-content/uploads/2015/12/List-of-Licensees-under-Dealers-in-Securities-Licensing-Act-CAP-70-19.09.2016.pdf">{LangClient.i18n(val)}</a></p>);
              }else{
                return (<p key={index}>{LangClient.i18n(val)}</p>);
              }
            }
           }
          )
        }

        <p>{LangClient.i18n("Copyright @ 2016 Ultrabanc")}</p>
        <div className="risk_content">{LangClient.i18n("RISK WARNING: Trading Binary Options is highly speculative and carries a high level of risk and may not be suitable for all investors. You may lose some or all of your invested capital; therefore you should not speculate with capital that you cannot afford to lose. You should be aware of all the risks associated with trading Binary Options.")}</div>
      </div>
    </div>)
  }
}
