import React from "react";
import Header from "./header/header";
import Service from "./home/online_service";
import Cookie from "./tools/cookie";
import Config from "./config/config";
import $ from "jquery";
import LangClient from "./tools/Lang-Client";
import ReactServerRenderEntry from "./react_server_render_entry";

export default class Ib extends ReactServerRenderEntry{
  constructor(props){
    super(props);
    // this.state={
    //   exampleStyle:"",
    // }

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  createMarkup(text) {
   let _text = LangClient.i18n(text);
   return {__html: _text};
  }
  showSuccess(){
    $("#sucToast").css({display:"block"});
    setTimeout(()=>{
      $("#sucToast").css({display:"none"})
    },1000)
  }
  showError(ele,text){
    $(ele).parent().addClass("error");
    $(ele).parent().find(".tips").html(text);
  }
  handleInput(event){
    $("#conSpan").css({display:"none"});
    let _target = event.target;
    let _ele = $(_target);
    if(!_ele.val()){$("#conSpan").css({display:"block"})}
  }
  validField(value,regx){
    return regx.test(value);
  }
  onValidField(event){

    let _target = event.target;
    let _ele = $(_target);
    let _value = _ele.val();
    let _name =_ele.attr("name");
    let _errorMsg = "";
    let _hasError = false;
     switch(_name){
      case "email":{
        if(_value&&!this.validField(_value,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
          _errorMsg=LangClient.i18n("Enter a valid email address")
          _hasError = true;
        }
      }break;
      case "phone":{
        if(_value&&this.validField(_value,/^\s*$/)){
          _errorMsg = LangClient.i18n("Enter a valid mobile number");
          _hasError = true;
        }else if(_value&&!this.validField(_value,/^[+\-\d]+$/)){
          _errorMsg = LangClient.i18n("Invalid mobile number, please enter again");
          _hasError = true;
        }
      }break;
      // case "qq":{
      //   if(!_value){
      //     _errorMsg = LangClient.i18n("Please enter your qq/wechet/skype");
      //     _hasError = true;
      //   }
      // }break;
      // case "content":{
      //   if(!_value){
      //     _errorMsg = LangClient.i18n("Please enter the content");
      //     _hasError = true;
      //   }
      // }break;
    }
    if(_hasError){
      this.showError(_target,_errorMsg);
    }else{
      _ele.parent().removeClass('error');
    }

  }
  validFieldBeforeJoin(){
    let _name=this.refs.name.value;
    let ele_name = $(this.refs.name);
    let _email=this.refs.email.value;
    let ele_email = $(this.refs.email);
    let _phone_number=this.refs.phone.value;
    let ele_phone = $(this.refs.phone);
    let _content=this.refs.content.value;
    let ele_content = $(this.refs.content);
    let _qq=this.refs.qq.value;
    let ele_qq = $(this.refs.qq);
    if(!_name){
      let _errorMsg=LangClient.i18n("Please enter your name")
      this.showError(ele_name,_errorMsg);return false;
    }else{
      ele_name.parent().removeClass('error');
    }

    if(this.validField(_phone_number,/^\s*$/)){
      let _errorMsg = LangClient.i18n("Enter a valid mobile number");
      this.showError(ele_phone,_errorMsg);return false;
    }else if(!this.validField(_phone_number,/^[+\-\d]+$/)){
      let _errorMsg = LangClient.i18n("Invalid mobile number, please enter again");
      this.showError(ele_phone,_errorMsg);return false;
    }else{
      ele_phone.parent().removeClass('error');
    }

    if(!this.validField(_email,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
      let _errorMsg=LangClient.i18n("Enter a valid email address")
      this.showError(ele_email,_errorMsg);return false;
    }else{

      ele_email.parent().removeClass('error');
    }
    // if(!_qq){
    //   let _errorMsg = LangClient.i18n("Please enter your qq/wechat/skype");
    //   this.showError(ele_qq,_errorMsg);return false;
    // }else{
    //   ele_qq.parent().removeClass('error');
    // }
    // if(!_content){
    //   let _errorMsg = LangClient.i18n("Please enter the content");
    //   this.showError(ele_content,_errorMsg);return false;
    // }else{
    //   ele_content.parent().removeClass('error');
    // }
    return true;
  }
  showToast(text){
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }
  doJoin(){
    let _flag = this.validFieldBeforeJoin();
    if(!_flag){return;}
    $("#joinNowId").css("opacity","0.5");
    let _postData ={
      name:this.refs.name.value||"",
      email:this.refs.email.value||"",
      phone_number:this.refs.phone.value||"",
      other_code:this.refs.qq.value||"",
      content:this.refs.content.value||"",
    }
    let _url = "//"+Config.host[Config.env]+Config.api.user.join_agent;
    $.post(_url,_postData,(resp)=>{
     if(!resp||resp.status!=1){
       if(resp.msg){
         this.showToast(LangClient.i18n("Submit failure, please try again, or contact our customer service"));
         $("#joinNowId").css("opacity","1");
       }
       return;
     }else{
        this.showSuccess();
        this.refs.name.value="";
        this.refs.email.value="";
        this.refs.phone.value="";
        this.refs.qq.value="";
        this.refs.content.value="";
        $("#conSpan").css({display:"block"});
        $("#joinNowId").css("opacity","1");
     }
   })

  }
  componentDidMount(){
    // $("#joinId").on("click",function(){
    //    document.body.scrollTop = 2530;
    // });
    // $(".example_btn").on("click",function(){
    //   document.body.scrollTop = 2530;
    // });
    let _language = Cookie.getCookie("language");

    if(_language=="zh-CN"||_language=="zh-TW"||_language=="zh-HK"){
      $(".example_image").attr("src",this.urlCdn+"/pc/images/ib_example_cn.png");
      $(".example_btn").attr("src",this.urlCdn+"/pc/images/ib_exampleBtn_cn.png");
    }else if(_language =="en"){
      $(".example_image").attr("src",this.urlCdn+"/pc/images/ib_example_en.png");
      $(".example_btn").attr("src",this.urlCdn+"/pc/images/ib_exampleBtn_en.png");
    }else if(_language == 'pl'){
      $(".example_image").attr("src",this.urlCdn+"/pc/images/ib_example_pl.png");
      $(".example_btn").attr("src",this.urlCdn+"/pc/images/ib_exampleBtn_pl.png");
    }else{
      $(".example_image").attr("src",this.urlCdn+"/pc/images/ib_example_pt.png");
      $(".example_btn").attr("src",this.urlCdn+"/pc/images/ib_exampleBtn_pt.png");
    }


  }
  render(){
    let _icomImg1 = this.urlCdn+"/pc/images/icon1.png";
    let _icomImg2 = this.urlCdn+"/pc/images/icon2.png";
    let _icomImg3 = this.urlCdn+"/pc/images/icon3.png";
    let _icomImg4 = this.urlCdn+"/pc/images/icon4.png";
    let _icomImg5 = this.urlCdn+"/pc/images/icon5.png";
    let _icomImg6 = this.urlCdn+"/pc/images/icon6.png";
    let _icomImg7 = this.urlCdn+"/pc/images/icon7.png";
    let _icomImg8 = this.urlCdn+"/pc/images/icon8.png";
    let _icomImg9 = this.urlCdn+"/pc/images/icon9.png";
    let _icomImg10 = this.urlCdn+"/pc/images/icon10.png";
    let _icomImg11 = this.urlCdn+"/pc/images/icon11.png";
    let _icomImg12 = this.urlCdn+"/pc/images/icon12.png";
    let _icomImg13 = this.urlCdn+"/pc/images/icon13.png";
    let _joinCheckImg = this.urlCdn+"/pc/images/join_check.png";
    let _exampleImg = this.urlCdn+"/pc/images/ib_example_en.png";
    let _exampleBtnImg = this.urlCdn+"/pc/images/ib_exampleBtn_en.png";

    return(
      <article style={{"overflow":"hidden"}}>
        <Header ref="header"  />
            <div className="banner">
               <p>{LangClient.i18n("JOIN THE BEST, BECOME AN INTRODUCING BROKER WITH US!")}</p>

               <p dangerouslySetInnerHTML={this.createMarkup("We Have The Highest Commission, Perfect Trading Environment,Strong Market Support and an Excellent  Customer Service Team")}></p>
            </div>
            <div className="advantages">
              <div className="proAdv">{LangClient.i18n("Products' Advantages")}</div>
              <ul>
                <li>
                  <img src={_icomImg1} alt=""/>
                  <p>{LangClient.i18n("High Return")}</p>
                  <span>{LangClient.i18n("Transaction yields: 70% - 90% Quick commission")} </span>
                </li>
                <li>
                  <img src={_icomImg2} alt=""/>
                  <p>{LangClient.i18n("Simple Trade")}</p>
                  <span>{LangClient.i18n("Only need to judge the trend of prices")}</span>
                </li>
                <li>
                  <img src={_icomImg3} alt=""/>
                  <p>{LangClient.i18n("Oustanding Security Systems")}</p>
                  <span>{LangClient.i18n("Fixed profit rate Transparent and standardized")}</span>
                </li>
                <li>
                  <img src={_icomImg4} alt=""/>
                  <p>{LangClient.i18n("Diverse Assets")}</p>
                  <span>{LangClient.i18n("More than 180 assets, including forex, stocks, indices and commodities")}</span>
                </li>
                <li>
                  <img src={_icomImg5} alt=""/>
                  <p>{LangClient.i18n("Online Trading")}</p>
                  <span>{LangClient.i18n("5 * 24 trading time")}</span>
                </li>
              </ul>
              <a href="#join_delegate"><button type="button" name="button" id="joinId">{LangClient.i18n("contact us")}</button></a>
            </div>
            <div className="join_edge">
              <div>{LangClient.i18n("Joining advantages")}</div>
              <ul>
                <li>
                  <img src={_icomImg6} alt=""/>
                  <p>{LangClient.i18n("Advanced Agent System")}</p>
                  <p>{LangClient.i18n("Outstanding platform manages users' account")}</p>
                </li>
                <li>
                  <img src={_icomImg7} alt=""/>
                  <p>{LangClient.i18n("Substantial returns")}</p>
                  <p>{LangClient.i18n("Generous commission for IBs, and fast settlements")}</p>
                </li>
                <li>
                  <img src={_icomImg8} alt=""/>
                  <p>{LangClient.i18n("Diverse commission model")}</p>
                  <p>{LangClient.i18n("Diverse and flexible scheme of commissions")}</p>
                </li>
                <li>
                  <img src={_icomImg9} alt=""/>
                  <p>{LangClient.i18n("Zero cost and Risk free")}</p>
                  <p>{LangClient.i18n("Zero cost to join us and zero risk  to invest in assets")}</p>
                </li>
                <li>
                  <img src={_icomImg10} alt=""/>
                  <p>{LangClient.i18n("Multi-channel and Fast Withdrawal")}</p>
                  <p>{LangClient.i18n("Multi-channel and fast deposit/withdrawal")} </p>
                </li>
                <li>
                  <img src={_icomImg11} alt=""/>
                  <p>{LangClient.i18n("Reliable Platform")}</p>
                  <p>{LangClient.i18n("World's leading trade platform, wide coverage, fast PC/APP transactions")}</p>
                </li>
                <li>
                  <img src={_icomImg12} alt=""/>
                  <p>{LangClient.i18n("Great Support")}</p>
                  <p>{LangClient.i18n("A support team for your marketing")}</p>
                </li>
                <li>
                  <img src={_icomImg13} alt=""/>
                  <p>{LangClient.i18n("Professional Service")}</p>
                  <p>{LangClient.i18n("24 hours of online customer service")}</p>
                </li>
              </ul>
            </div>
          <div className="ib_example">
            <div className="inner">
              <img className="example_image" src={_exampleImg} />
              <a href="#join_delegate"><img className="example_btn" src={_exampleBtnImg} /></a>
            </div>
          </div>
            <div className="problems">
               <div className="title">{LangClient.i18n("FAQs")}</div>
               <div className="qusa">
                 <ul>
                     <li>
                       <p>{LangClient.i18n("Q: How to become IB?")}</p>
                       <span>{LangClient.i18n("A: Please enter the required information below and submit your application. We will contact you in time after receiving your application")}</span>
                     </li>
                     <li>
                       <p>{LangClient.i18n("Q: Is it cost-free to become an IB?")}</p>
                       <span>{LangClient.i18n("A: Yes. It is free to become an IB.")}</span>
                     </li>
                     <li>
                       <p>{LangClient.i18n("Q: How to calculate the commission?")}</p>
                       <span>{LangClient.i18n("A: Commission is calculated by your customers' trading volume. You will have a commision for each transaction done by your customer.")}</span>
                     </li>
                   </ul>
                   <ul>
                     <li>
                       <p>{LangClient.i18n("Q: Customers from which countries can I target?")}</p>
                       <span>{LangClient.i18n("A: Our platform target global customers. It is multi-language supporting Chinese, English, Polish, Portuguese, and many more which can effectively help you to expand your market.")}</span>
                     </li>

                     <li>
                       <p>{LangClient.i18n("Q: Can I have my customers' data?")}</p>
                       <span>{LangClient.i18n("A: Yes. Our advanced agent system will give you the real-time operation for your customers' trading and account. So you can arrange your business effectively.")}</span>
                     </li>
                   </ul>
                 </div>

            </div>
            <div className="join_delegate" id="join_delegate">
               <div id="sucToast">
                  <div className="sucMsg">
                      <img src={_joinCheckImg} />
                      <p>{LangClient.i18n("Send successfully")}</p>
                      <p>{LangClient.i18n("Our customer service will contact you soon!")}</p>
                  </div>
               </div>
               <div className="title">
                 {LangClient.i18n("Join The World’s Leading Binary Options Broker")}
               </div>
               <div className="be_del clearfix">
                  <div className="intro">
                     <div>{LangClient.i18n("Finance Managers Co. Limited")}</div>
                     <p>{LangClient.i18n("Address")}: Govant Building 1st Floor PO Box 1276Port Vila, Vanuatu</p>
                     <p>{LangClient.i18n("Register Number")}: 1474</p>
                     <p>{LangClient.i18n("Tel")}: (+852) 53482546</p>
                     <p>{LangClient.i18n("Mobile")}: (+86) 15340139742</p>
                     <p>{LangClient.i18n("E-mail")}: IB@ultrabanc.com</p>
                  </div>
                  <div className="reg">
                     <div className="field">
                        <input type="text" name="name" ref="name" placeholder={LangClient.i18n("Name")} onBlur={this.onValidField.bind(this)}/>
                        <i className="icon common error"></i>
                        <div className="tips"></div>
                     </div>
                     <div className="field">
                        <input type="text" name="phone" ref="phone" placeholder={LangClient.i18n("Mobile")} onBlur={this.onValidField.bind(this)}/>
                        <i className="icon common error"></i>
                        <div className="tips"></div>
                     </div>
                     <div className="field">
                        <input type="text" name="email" ref="email" placeholder={LangClient.i18n("E-mail")} onBlur={this.onValidField.bind(this)} />
                        <i className="icon common error"></i>
                        <div className="tips"></div>
                     </div>
                     <div className="field">
                        <input type="text" name="qq" ref="qq" placeholder={LangClient.i18n("QQ/WeChat/Skype")} onBlur={this.onValidField.bind(this)} />
                        <i className="icon common error"></i>
                        <div className="tips"></div>
                     </div>
                     {/* <input type="text" className="content" placeholder={LangClient.i18n("Content")}/> */}
                     <div className="text">
                       <span id='conSpan'>{LangClient.i18n("Content")}</span>
                       <textarea name="content" ref="content" onInput={this.handleInput.bind(this)} onBlur={this.onValidField.bind(this)}></textarea>
                       <i className="icon common error"></i>
                       <div className="tips"></div>
                     </div>
                     <button id="joinNowId" onClick={this.doJoin.bind(this)}>{LangClient.i18n("JOIN NOW")}</button>
                  </div>
               </div>
            </div>
        <Service/>
      </article>
    )
  }
}
