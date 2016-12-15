import React from "react";
import ReactDOM from "react-dom";
import Cookie from "../tools/cookie";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class Service extends React.Component{
  constructor(props){
    super(props);
    this.lang = "";
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
      this.lang = global.process.env.language;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
      this.lang = LangClient.states.lang;
    }
  }
  handleClick(){
    let _language=this.lang||Cookie.getCookie("language");
    if(_language=="zh-CN"){
      function e(e, t) {
          var n = window.screen.availWidth, i = window.screen.availHeight;
          return {
              left: Math.ceil((n - e) / 2),
              top: Math.ceil((i - t) / 2)
          };
      }
      var p = 590, m = 550, g = e(p, m);
      var h = "left=" + g.left + ",top=" + g.top + ",resizable=1,width=" + p + ",height=" + m;
      var kf="http://p.qiao.baidu.com/cps/chat?siteId=10145885&userId=22744194";
      window.open( kf, "newwindow", h);
    }
  }
  handleClickEn(){
    parent.LC_API.open_chat_window();
  }
  insertLink(){
    let _language=this.lang||Cookie.getCookie("language");
    if(_language!="zh-CN"){
      window.__lc = window.__lc || {};
      window.__lc.license = 8479607;
      (function() {
        var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
        lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
      })();
    }
  }
  init(){
    let _language=this.lang||Cookie.getCookie("language");
    if(_language=="zh-CN"){
      $(".online_service.cn").css({"display":"block"});
      $(".online_service.en").css({"display":"none"});
    }else{
      $(".online_service.en").css({"display":"block"});
      $(".online_service.cn").css({"display":"none"});
    }
    $(".weixin").mouseenter(function(){
			$(this).find(".code").fadeIn("fast");
		});
		$(".weixin").mouseleave(function(){
			$(this).find(".code").fadeOut("fast");
		});
  }
  componentDidMount(){
    this.init();
    this.insertLink();
  }
  render(){
    return (
      <div className="online">
        <div className="online_service cn">
          <a onClick={this.handleClick.bind(this)}></a>
          <a href="tencent://message/?uin=3470283592\&Site\;=友邦期权&Menu=yes"></a>
          <a className="weixin">
            <div className="code">
              <i></i>
              <img className="pic" src={this.urlCdn+"/pc/images/online_weixin.png"}/>
              <p className="text1">官方微信</p>
              <p className="text2">扫描上方官方微信公众号；惊喜不断。</p>
            </div>
          </a>
          <a href="tencent://message/?uin=1353743790\&Site\;=友邦期权&Menu=yes"></a>
          <a href="tencent://message/?uin=1353743790\&Site\;=友邦期权&Menu=yes"></a>
        </div>
        <div className="online_service en">
          <a onClick={this.handleClickEn.bind(this)}></a>
          <a href="skype:ultrabanc@hotmail.com?chat"></a>
          <a className="weixin">
            <div className="code phone">
              <i></i>
              <p className="text1">WhatsApp: +85253482546</p>
            </div>
          </a>
          <a href="skype:ib@ultrabanc.com?chat"></a>
          <a href="https://www.facebook.com/ultrabanc" target="_blank"></a>
        </div>
      </div>
    );
  }
}
