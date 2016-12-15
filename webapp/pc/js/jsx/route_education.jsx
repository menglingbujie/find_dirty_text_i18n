import React from "react";
import $ from "jquery";
import Header from "./header/header";
import Service from "./home/online_service";
import Cookie from "./tools/cookie";
import Config from "./config/config";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

export default class  Education extends ReactServerRenderEntry {
  constructor(props){
    super(props);
    this.state={
      titleStyle:"",
    }
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  createMarkup(text) {
   let _text = LangClient.i18n( text );
   return {__html: _text};
  }
  getScrollTop(){
    window.onscroll=function(){
      let scrollTop = document.body.scrollTop||document.documentElement.scrollTop;
      let findText=$(".edu_find .text");
      let successText=$(".edu_success .text");
      let eduSuccessPic=$(".edu_success img");
      if(scrollTop>340){
        successText.addClass("fadeInRight animated");
        eduSuccessPic.eq(0).addClass("fadeInLeft animated");
      }
    };
  }
  setTitleStyle(){
    let _titleStyle=Cookie.getCookie("language");
    this.setState({
      titleStyle:_titleStyle,
    })
  }
  setImageSrc(){
    let _language=Cookie.getCookie("language");
    if(_language=="zh-CN"||_language=="zh-TW"||_language=="zh-HK"){
      $(".edu_how_p1").attr("src",this.urlCdn+"/pc/images/edu_how_p1_cn.png");
      $(".edu_how_p2").attr("src",this.urlCdn+"/pc/images/edu_how_p2_cn.png");
      $(".edu_how_p3").attr("src",this.urlCdn+"/pc/images/edu_how_p3_cn.png");
      $(".edu_find_peple").attr("src",this.urlCdn+"/pc/images/edu_find_peple_cn.png");
      $(".edu_find_p1").attr("src",this.urlCdn+"/pc/images/edu_find_p1_cn.png");
      $(".edu_find_p2").attr("src",this.urlCdn+"/pc/images/edu_find_p2_cn.png");
    }else if(_language =="en"){
      $(".edu_how_p1").attr("src",this.urlCdn+"/pc/images/edu_how_p1_en.png");
      $(".edu_how_p2").attr("src",this.urlCdn+"/pc/images/edu_how_p2_en.png");
      $(".edu_how_p3").attr("src",this.urlCdn+"/pc/images/edu_how_p3_en.png");
      $(".edu_find_peple").attr("src",this.urlCdn+"/pc/images/edu_find_peple_en.png");
      $(".edu_find_p1").attr("src",this.urlCdn+"/pc/images/edu_find_p1_en.png");
      $(".edu_find_p2").attr("src",this.urlCdn+"/pc/images/edu_find_p2_en.png");

    }else if(_language == 'pl'){
      $(".edu_how_p1").attr("src",this.urlCdn+"/pc/images/edu_how_p1_pl.png");
      $(".edu_how_p2").attr("src",this.urlCdn+"/pc/images/edu_how_p2_pl.png");
      $(".edu_how_p3").attr("src",this.urlCdn+"/pc/images/edu_how_p3_pl.png");
      $(".edu_find_peple").attr("src",this.urlCdn+"/pc/images/edu_find_peple_en.png");
      $(".edu_find_p1").attr("src",this.urlCdn+"/pc/images/edu_find_p1_pl.png");
      $(".edu_find_p2").attr("src",this.urlCdn+"/pc/images/edu_find_p2_pl.png");

    }else{
      $(".edu_how_p1").attr("src",this.urlCdn+"/pc/images/edu_how_p1_pt.png");
      $(".edu_how_p2").attr("src",this.urlCdn+"/pc/images/edu_how_p2_pt.png");
      $(".edu_how_p3").attr("src",this.urlCdn+"/pc/images/edu_how_p3_pt.png");
      $(".edu_find_peple").attr("src",this.urlCdn+"/pc/images/edu_find_peple_en.png");
      $(".edu_find_p1").attr("src",this.urlCdn+"/pc/images/edu_find_p1_pt.png");
      $(".edu_find_p2").attr("src",this.urlCdn+"/pc/images/edu_find_p2_pt.png");
    }
  }
  componentDidMount(){
    this.getScrollTop();
    this.setTitleStyle();
    this.setImageSrc();
  }
  render(){
    let _icomImg1 = this.urlCdn+"/pc/images/edu_how_p1_en.png";
    let _icomImg2 = this.urlCdn+"/pc/images/edu_how_p2_en.png";
    let _icomImg3 = this.urlCdn+"/pc/images/edu_how_p3_en.png";
    let _icomImg4 = this.urlCdn+"/pc/images/edu_find_peple_en.png";
    let _icomImg5 = this.urlCdn+"/pc/images/edu_find_p1_en.png";
    let _icomImg6 = this.urlCdn+"/pc/images/edu_find_p2_en.png";

    return(
      <article style={{"overflow":"hidden"}}>
        <Header/>
          <div className="education">
              <div className="edu_how">
                <div className="wrap">
                  <h2 className={this.state.titleStyle}><span>{LangClient.i18n("EDUCATION CENTER:")}</span>{LangClient.i18n("Teach You How To Become An Outstanding Agent")}</h2>
                  <div>
                    <div className="left picture">
                      <img className="edu_how_peple fadeInLeft animated" src={this.urlCdn+"/pc/images/edu_how_peple.png"}/>
                      <img className="edu_how_p1 bounceIn dalay3 animated" src={_icomImg1}/>
                      <img className="edu_how_p2 bounceIn dalay5 animated" src={_icomImg2}/>
                      <img className="edu_how_p3 bounceIn dalay4 animated" src={_icomImg3}/>
                    </div>
                    <ul className="right text ">
                      <li className="fadeInRight dalay1 animated">{LangClient.i18n("Mike wants to work as a financial agent")}</li>
                      <li className="fadeInRight dalay2 animated">{LangClient.i18n("however")}</li>
                      <li className="fadeInRight dalay3 animated" dangerouslySetInnerHTML={this.createMarkup("He doesn't know how to start")}></li>
                      <li className="fadeInRight dalay4 animated">{LangClient.i18n("keeps trying, but always fail")}</li>
                      <li className="fadeInRight dalay5 animated">{LangClient.i18n("inexperienced")}</li>
                      <li className="fadeInRight dalay4 animated">{LangClient.i18n("no reliable platform")}</li>
                      <li className="fadeInRight dalay3 animated">{LangClient.i18n("lack of")}<span>&nbsp;{LangClient.i18n("Expertise")}</span></li>
                      <li className="fadeInRight dalay2 animated">{LangClient.i18n("as a")}<span>&nbsp;{LangClient.i18n("Beginner")}&nbsp;&nbsp;</span>{LangClient.i18n("he doesn\'t know where to get support from")}</li>
                      <li className="fadeInRight dalay1 animated" dangerouslySetInnerHTML={this.createMarkup("then he thought...if brokers could give him Support...")}></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="edu_find">
                <div className="wrap">
                  <div className="left text dalay2 fadeInUp animated">
                    <table >
                      <tbody>
                        <tr>
                          <td>
                            <p><span><i></i></span><span>{LangClient.i18n("Through a friend, Mike joined Ultrabanc")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Ultrabanc\'s unique agent program allowed him to make money easier")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Customized commission plans helped him improve quickly")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Mike had a week-long financial course with Ultrabanc")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Ultrabanc provided a wonderful promotion plan for him")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Mike gradually established his own extension system and confidently looks at his future")}</span></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="right picture">
                    <img className="edu_find_peple fadeInUp animated" src={_icomImg4}/>
                    <img className={"edu_find_p1 dalay2 bounceIn animated "+this.state.titleStyle} src={_icomImg5}/>
                    <img className={"edu_find_p2 dalay3 bounceIn animated "+this.state.titleStyle} src={_icomImg6}/>
                  </div>
                </div>
              </div>
              <div className="edu_success">
                <div className="wrap">
                  <div className="left picture">
                    <img className="edu_success_peple" src={this.urlCdn+"/pc/images/edu_success_peple.png"}/>
                  </div>
                  <div className="right text">
                    <table >
                      <tbody>
                        <tr>
                          <td>
                            <p><span><i></i></span><span>{LangClient.i18n("Through his efforts, Mike gets his first batch of users")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Mike\'s good management skills together with Ultrabanc\'s support, allows him to earn his first fortune")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Mike continues to expand his team and upgrades his agent level")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Income grows with his efforts")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("And the whole experience allows Mike to flourish in imaginable ways")}</span></p>
                            <p><span><i></i></span><span>{LangClient.i18n("Want to become another Mike?")}&nbsp;<a href="/activity/ib#join_delegate">{LangClient.i18n("Join Ultrabanc now!")}</a></span></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="edu_concat">
                <a href="/activity/ib#join_delegate">
                  <div className="wrap">
                    <h3>{LangClient.i18n("Join Ultrabanc")}</h3>
                    <ul>
                      <li>{LangClient.i18n("Contact US")}</li>
                      <li>{LangClient.i18n("Submit Information")}</li>
                      <li>{LangClient.i18n("Sign Contract")}</li>
                      <li>{LangClient.i18n("Become an Agent")}</li>
                    </ul>
                  </div>
                </a>
              </div>
          </div>
          <Service/>
      </article>
    )
  }

}
