import React from "react";
import Header from "./header/header";
import Service from "./home/online_service";
import Cookie from "./tools/cookie";
import Config from "./config/config";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

export default class Insurance extends ReactServerRenderEntry {
  constructor(props){
    super(props);
    this.state={
      bannerStyle:"",
      moneyinfo:false,
    }
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  // 获取是否领取保险金状态
  onClickJoin() {
    let _token = Cookie.getCookie("token");
    let _userinfo = Cookie.getCookie("userinfo");
    let _linkUrl="";
    let _userinfoObj={};
    let _base_url = "/pay/withdraw?access-token=";
    if(!_token){
      this.refs.header.needToLogin();
      return;
    }
    if(_userinfo){
      _userinfoObj=JSON.parse(_userinfo)
    }
    if(_userinfoObj&&_userinfoObj.insurance==1){
      _linkUrl=_base_url + _token.replace(/^Bearer /, "");
    }else{
      _linkUrl="/trade";
    }
    setTimeout(() => {
      sessionStorage.setItem("sub_nav", -1);
      location.href = _linkUrl;
    }, 200);
  };
  componentDidMount(){
    let _bannerStyle = "insu_free "+Cookie.getCookie("language");
    this.setState({bannerStyle:_bannerStyle})
  }
  render(){
    return(
      <article style={{"overflow":"hidden"}}>
        <Header ref="header"/>
          <div className="insu">
              <div className={this.state.bannerStyle}>
              </div>
              <div className="insu_statement">
                  <div className="insu_statement_sub">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            {LangClient.i18n("Ultrabanc aims at providing users with a perfect trading platform environment where traders are able to maximize their earnings. Therefore, Ultrabanc presents you with a new Insurance Activity: if a trader losses, Ultrabanc will share the loss with the trader.")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div  className="insu_statement_btn" onClick={this.onClickJoin.bind(this)}>{LangClient.i18n("JOIN NOW")}</div>
                  <div className="insu_statement_rule">{LangClient.i18n("How it works:")}</div>
                  <div className="insu_statement_cre">
                    <ul>
                      <li>{LangClient.i18n("1. The Insurance Activity is available for existing traders who have not yet completed a deposit. Ultrabanc will give an insurance of the same value as traders\' very first deposit.")}</li>
                      <li>{LangClient.i18n("2. The insurance covers traders\' very first deposit and the additional deposits made until mid-night of that same day, to which it guarantees a maximum coverage of $10,000 per trader.")}</li>
                      <li dangerouslySetInnerHTML={this.createMarkup("3. Traders are entitled to obtain an insurance money worth 50% of their total net loss, when only their net loss equals to 90% of their cumulative deposited amount of that first deposit day.")}></li>
                      <li dangerouslySetInnerHTML={this.createMarkup("4. There aren’t any deposits or withdrawals restrictions for traders participating in the Insurance Activity.")}></li>
                      <li dangerouslySetInnerHTML={this.createMarkup("5. Each trader is entitled to receive the insurance money once.")}></li>
                      {/* <li>{LangClient.i18n("6. The Insurance will be valid for period of one year starting from the date of traders’ first deposit.")}</li> */}
                      <br/>
                      <li>{LangClient.i18n("Example: Marco decides to participate in the Insurance Activity and deposits $100. He then opens 9 positions for $10 each, but his fundamental analysis proves wrong and all his trades ended out-of-the-money.")}</li>
                    </ul>
                  </div>
                  <div className="insu_statement_tip">
                      <div className="insu_statement_tip_t">「 {LangClient.i18n("Notice:")} 」</div>
                      <div className="insu_statement_tip_y">{LangClient.i18n("We reserve the right to contact you and offer further explanations regarding the above stated terms of activity and your behavior towards it.")}</div>
                      <div className="insu_statement_tip_c" dangerouslySetInnerHTML={this.createMarkup("We also reserve the right to cancel any illegal gains resulted by wrong doings performed while participating in this Insurance Activity.")}></div>
                  </div>
              </div>
          </div>
        <Service/>
      </article>
    )
  }

}
