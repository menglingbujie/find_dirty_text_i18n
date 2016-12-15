import React from "react";
import $ from "jquery";

import Config from "../config/config";
import Dropdown from "../components/dropdown";
import HeaderReg from "../header/header_reg";
import Country from "../data/country_all";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

export default class Register extends React.Component
{
  constructor(props){
    super(props);

    var _isDev = Config.env;
    var _host = Config.host[_isDev];

    this.state={
      areacode:"",
      code:"",
      login_google:"//"+_host+Config.api.user.login_google,
      login_facebook:"//"+_host+Config.api.user.login_facebook,
    };
    this.codeTimer = null;
    this.currency ='';
    this.currency_symbol="";
  }
  showToast(text){
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }
  hideError(ele){
    let _parentNode = $(ele).parent();
    _parentNode.removeClass("error");
    _parentNode.find(".tips").html("");
  }
  showError(ele,text){
    // console.log($(ele).parent());
    let _parentNode = $(ele).parent();
    _parentNode.addClass("error");
    _parentNode.find(".tips").html(text);
  }
  selDefaultCountry(){
    let _countryData = [];
    for(let key in Country){
      _countryData.push({key:key,nation:Country[key].name,name:"+"+Country[key].callingcode});
    }
    _countryData = _countryData.sort(this.sortJson("asc","nation","string"));

    let index =0 ;
    let _lang = Cookie.getCookie("language")||"en";

    if(_lang =="zh-CN"){

      let _langCode = 'CN';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+"+_callingCode;
      this.setState({areacode:_areacode,code:_langCode});

      for(let i=0; i<_countryData.length;i++){
        if(_countryData[i].name==_areacode){
          index = i;
          this.refs.country_dropdown.setState({index:index});
          break;
        }
      }
      return;
    }
    if(_lang =="en"){
      let _langCode = 'US';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+"+_callingCode;
      this.setState({areacode:_areacode,code:_langCode});
      for(let i=0; i<_countryData.length;i++){
        if(_countryData[i].key==_langCode){
          index = i;
          this.refs.country_dropdown.setState({index:index});
          break;
        }
      }
      return;
    }
    if(_lang =="pt"){
      let _langCode = 'BR';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+"+_callingCode;
      this.setState({areacode:_areacode,code:_langCode});
      for(let i=0; i<_countryData.length;i++){
        if(_countryData[i].key==_langCode){
          index = i;
          this.refs.country_dropdown.setState({index:index});
          break;
        }
      }
      return;
    }
    if(_lang =="pl"){
      let _langCode = 'PL';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+"+_callingCode;
      this.setState({areacode:_areacode,code:_langCode});
      for(let i=0; i<_countryData.length;i++){
        if(_countryData[i].key==_langCode){
          index = i;
          this.refs.country_dropdown.setState({index:index});
          break;
        }
      }
    }
    return;
  }
  componentDidMount(){
    // $(".panel").mCustomScrollbar({
    //   axis:"y",
    //   mouseWheel:{axis:"y"},
    //   // scrollButtons:{enable:true}
    // });

    //close dropdown when click body
    $(document.body).on("click",(event)=>{
      let _parents = $(event.target).parents();
      let _isOnDropdown = false;
      //如果点击的是dropdown则不需要close。因为select的onClick无法阻止事件冒泡
      _parents.map((index,val)=>{
        if(val.className.match(/dropdown|code_label/)){_isOnDropdown=true;return;}
      })
      if(_isOnDropdown){return;}

      // this.refs.dollar_dropdown.hideDropdown();
     this.refs.country_dropdown.hideDropdown();
    })
    this.selDefaultCountry();
  }

  getCountry(code,lang){
    this.setState({areacode:lang,code:code})
  }
  setCookie(key,value,expire_timestamp){
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime()+expire_timestamp*1000);
    document.cookie=key+"="+escape(value)+((!expire_timestamp)?"":";expires="+expireDate.toGMTString())+";path=/";
  }
  validFieldBeforeRegister(){
    this.hideError($(".icon.error.system"));
    let _fnameValue = this.refs.ELE_fname.value||"";
    let _lnameValue = this.refs.ELE_lname.value||"";
    let _phoneValue= this.refs.ELE_phone.value||"";
    let _emailValue=this.refs.ELE_email.value||"";
    let _passwdValue=this.refs.ELE_password.value||"";
    // let _codeValue=this.refs.ELE_code.value||0;
    let _isAgree = $(this.refs.checkbox).is(":checked");

    if(!_isAgree){
      this.showError($(this.refs.label),LangClient.i18n("You must read and agree to the our terms!"));
      return false;
    }

    if(this.validField(_fnameValue,/^\s*$/)){
      this.showError($(this.refs.ELE_fname),LangClient.i18n("Enter your first name"));
      return false;
    }else{
      this.hideError($(this.refs.ELE_fname));
    }
    if(this.validField(_lnameValue,/^\s*$/)){
      this.showError($(this.refs.ELE_lname),LangClient.i18n("Enter your last name"));
      return false;
    }else{
      this.hideError($(this.refs.ELE_lname));
    }
    if(this.validField(_phoneValue,/^\s*$/)){
      this.showError($(this.refs.ELE_phone),LangClient.i18n("Enter a valid mobile number"));
      return false;
    }else if(!this.validField(_phoneValue,/^[+\-\d]+$/)){
      this.showError($(this.refs.ELE_phone),LangClient.i18n("Invalid mobile number, please enter again"));
      return false;
    }else{
      this.hideError($(this.refs.ELE_phone));
    }

    // if(this.validField(_codeValue,/^\s*$/)||!this.validField(_codeValue,/\w+/)){
    //   this.showError($(this.refs.ELE_code),LangClient.i18n("SMS code is required"));
    //   return false;
    // }else if(!this.validField(_codeValue,(/\d{6}/))){
    //   this.showError($(this.refs.ELE_code),LangClient.i18n("Enter sms code you received"));
    //   return false;
    // }
    if(this.validField(_emailValue,/^\s*$/)){
      this.showError($(this.refs.ELE_email),LangClient.i18n("Enter your email address"));
      return false;
    }else if(!this.validField(_emailValue,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
      this.showError($(this.refs.ELE_email),LangClient.i18n("Enter a valid email address"));
      return false;
    }
    if(this.validField(_passwdValue,/^\s*$/)){
      this.showError($(this.refs.ELE_password),LangClient.i18n("Password is required"));
      return false;
    }else if(_passwdValue.length<6||_passwdValue.length>14){
      this.showError($(this.refs.ELE_password),LangClient.i18n("password must be between 6 and 14 characters"));
      return false;
    }

    if(!this.state.code){
      // alert(LangClient.i18n("Enter your coutry"));
      this.showError($(this.refs.ELE_country),LangClient.i18n("Enter your coutry"));
      return false;
    }

    return true;
  }
  //输出多个注册错误
  showRegError(errors){
    for(var i in errors){
      switch(i){
        case "phone_number":{
          this.showError($(this.refs.ELE_phone),LangClient.i18n(errors[i]));
        }
        break;
        case "email":{
          this.showError($(this.refs.ELE_email),LangClient.i18n(errors[i]));
        }
        break;
        case "password":{
          this.showError($(this.refs.ELE_password),LangClient.i18n(errors[i]));
        }
        break;
      }
    }
  }
  doRegister(){
    try{ga("send","event","btn_reg");}catch(e){}
    //对所有项进行验证
    let _ret = this.validFieldBeforeRegister();
    if(!_ret){return;}

    let _postData = {
      "SignupForm[first_name]":this.refs.ELE_fname.value||"",
      "SignupForm[last_name]":this.refs.ELE_lname.value||"",
      "SignupForm[country]":this.state.code||"",
      "SignupForm[phone_number]":this.state.areacode+this.refs.ELE_phone.value||0,
      "SignupForm[email]":this.refs.ELE_email.value||"",
      "SignupForm[password]":this.refs.ELE_password.value||"",
      //"SignupForm[smscode]":this.refs.ELE_code.value||0,
      // "SignupForm[currency]":this.currency||"",
    //  "SignupForm[currency_symbol]":this.currency_symbol||"",
      "SignupForm[currency]":"USD",
      "SignupForm[currency_symbol]":"$",
      "lang":Cookie.getCookie("language")||"en",
      "SignupForm[utm_source]":Cookie.getCookie("utm_source")||"",
    };

    let _url = "//"+Config.host[Config.env]+Config.api.user.reg;
   	$.post(_url,_postData,(resp)=>{
      if(!resp||resp.status!=1){
        if(resp.data){
          this.showRegError(resp.data);
        }else if(resp.msg){
          this.showError($(".icon.error.system"),LangClient.i18n(resp.msg));
        }return;}
     	this.setCookie("token",resp.data.token,7200);
     // 	localStorage.setItem("userinfo",JSON.stringify(resp.data.userinfo))	;
      this.setCookie("userinfo", JSON.stringify(resp.data.userinfo), 7200);
      //goto demo trade
      let _demoTradeUrl = "//"+Config.host[Config.env+"_host"]+"/trade?token="+resp.data.token+"&lang="+Cookie.getCookie("language")||"en";
      try{fbq('track', 'CompleteRegistration')}catch(e){};
      setTimeout(()=>{location.href=_demoTradeUrl;},300);

      // setTimeout(()=>{location.href="/trade";},300);
    });
  }

  sendSMSCode(){
    try{ga("send","event","smscode");}catch(e){}
    // let _phone = this.state.areacode+this.refs.ELE_phone.value;
    let _phone = this.refs.ELE_phone.value;
    var isPhoneValid = (/^[+\-\d]+$/).test(_phone);
    if(!isPhoneValid){
      // alert(LangClient.i18n("Invalid mobile number, please enter again"));
      this.showError(LangClient.i18n("Invalid mobile number, please enter again"));
      return;
    }

    let _url = "//"+Config.host[Config.env]+Config.api.user.send_reg_sms_code;
    if($(".btn.send_code").hasClass("disable")){
      return;
    }
    let _postData = {
      phonenumber:_phone,
      area_code:this.state.areacode,
      "lang":Cookie.getCookie("language")||"en"
    }

    $.post(_url,_postData,(resp)=>{
      // console.log(resp);
      if(!resp||resp.status!=1){
        // alert(resp.msg);
        this.showToast(LangClient.i18n(resp.msg));
        return;
      }

      let CODE_TIMEOUT = 120;
      let _btnText = $(".btn.send_code").val();
      $(".btn.send_code").val(CODE_TIMEOUT);
      $(".btn.send_code").attr("disable",true);
      $(".btn.send_code").addClass("disable");
      //开始计时
      if(this.codeTimer){clearInterval(this.codeTimer)}
      this.codeTimer = setInterval(function(){
        CODE_TIMEOUT--;
        $(".btn.send_code").val(CODE_TIMEOUT);
        if(CODE_TIMEOUT<=0){
          clearInterval(this.codeTimer);
          $(".btn.send_code").attr("disable","");
          $(".btn.send_code").removeClass("disable");
          $(".btn.send_code").val(_btnText);
        }
      },1000);
    });
  }
  getDollar(code,lang){
  	// console.log(lang);
  	this.currency = lang.split(",")[0];
    this.currency_symbol=lang.split(",")[1];
  }

  callSelectCountry(){
  	if(this.refs.country_dropdown){
  		this.refs.country_dropdown.openDropdown();
  	}
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
      case "phone":{
      if(!_value||_value.length<0){return;}
      if(this.validField(_value,/^\s*$/)){
          _errorMsg = LangClient.i18n("Enter a valid mobile number");
          _hasError = true;
        }else if(_value.length>0){
            let _url = "//"+Config.host[Config.env]+Config.api.user.verify_phone_exist;
            let _postData = {
            "phone_number":this.state.areacode+this.refs.ELE_phone.value,
            "lang":Cookie.getCookie("language")||"en"
          }
          $.post(_url,_postData,(resp)=>{
            if(!resp||resp.status!=0){
              _errorMsg=LangClient.i18n(resp.msg);
              _hasError = true;
              this.showError($("input[name=phone]"),_errorMsg);
            //  this.showError($("input[name=phone]"),_errorMsg);
            //  $("input[name=phone]").parent().css("margin-top","25px");
          }else{
            this.hideError($("input[name=phone]"));
          }
          });
        }
      }break;
      // case "smscode":{
      //  if(!_value){return;}
      //  if(this.validField(_value,/^\s*$/)){
      //    _errorMsg = LangClient.i18n("SMS code is required");
      //    _hasError = true;
      //  }else if(!this.validField(_value,(/\d{6}/))){
      //    _errorMsg = LangClient.i18n("Enter sms code you received");
      //    _hasError = true;
      //  }
      // }break;
      case "email":{
        if(!_value){return;}
        if(!this.validField(_value,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
          _errorMsg = LangClient.i18n("Enter a valid email address");
          _hasError = true;
        }else{
          let _url = "//"+Config.host[Config.env]+Config.api.user.verify_email_exist;
          let _postData = {
            "email":this.refs.ELE_email.value,
            "lang":Cookie.getCookie("language")||"en"
          }
          $.post(_url,_postData,(resp)=>{
            if(!resp||resp.status!=0){
              _errorMsg=LangClient.i18n(resp.msg);
              _hasError = true;
              this.showError($("input[name=email]"),_errorMsg);
            }else{
              this.hideError($("input[name=email]"));
            }
          });
        }
      }break;
      case "password":{
         if(!_value){return;}
         if(_value.length<6||_value.length>14){
          _errorMsg = LangClient.i18n("password must be between 6 and 14 characters");
          _hasError = true;
        }
      }break;
    }
    if(_hasError){
      this.showError(_target,_errorMsg);
    }else{
      _ele.parent().removeClass('error');
    }
  }
  gotoLogin(event){
    event.preventDefault();
    sessionStorage.setItem("need_to_login",1);
    location.href="/";
  }
  sortJson(order, key,type) {
      var ordAlpah = (order == 'asc') ? '>' : '<';
      var sortFun = new Function("alert('empty function')");
      if(type==="string"){
        sortFun = new Function('a', 'b', 'return a.' + key + ordAlpah + 'b.' + key + '?1:-1');
      }else if(type==="number"){
        sortFun = new Function('a', 'b', 'return parseInt(a.' + key+")" + ordAlpah + 'parseInt(b.' + key + ')?1:-1');
      }
      return sortFun;
  }
  render(){
    let _countryData = [];
    // let _dollorData = [];
    for(let key in Country){
      _countryData.push({key:key,nation:Country[key].name,name:"+"+Country[key].callingcode});
      // _dollorData.push({key:key,name:Country[key].currency+","+Country[key].currency_symbol});
    }
    _countryData =  _countryData.sort(this.sortJson("asc","nation","string"));
    this.state.code = this.state.code || _countryData[0].key;
    this.state.areacode = this.state.areacode||_countryData[0].name;
    // this.currency = _dollorData[0].name.split(",")[0];
    // this.currency_symbol=_dollorData[0].name.split(",")[1];
    return (
      <article className="page reg">
        <HeaderReg />
        <h1>{LangClient.i18n("Log in with Ultra Banc")}</h1>
        <div className="panel">
          <div className="content">
            <div className="form">
              <div className="field real_info">{LangClient.i18n("Please provide real information in order to ensure the safety of your deposits/withdrawals")}</div>
              <div className="field">
                <input type="text" ref="ELE_fname" name="firstname"  placeholder={LangClient.i18n("First Name")} />
                <i className="icon common error"></i><div className="tips"></div>
              </div>

              <div className="field">
                <input type="text" ref="ELE_lname" name="lastname"  placeholder={LangClient.i18n("Last Name")} />
                <i className="icon common error"></i><div className="tips"></div>
              </div>

              {/* <div className="field" style={{display:"none"}}>
                <Dropdown dptype={1} ref="dollar_dropdown" getSelect={this.getDollar.bind(this)} data={_dollorData} />
                <i className="icon error"></i><div className="tips"></div>
              </div> */}

              <div className="field">
                <input type="tel" className="input phone" name="phone" onBlur={this.onValidField.bind(this)} ref="ELE_phone" placeholder={LangClient.i18n("Phone number")} />
              	<div className= "code_label" ref="ELE_country">
              		<Dropdown dptype={0} ref="country_dropdown" getSelect={this.getCountry.bind(this)} data={_countryData} class="fieldIcon" />
                	<span className="area_code" onClick={this.callSelectCountry.bind(this)} >{this.state.areacode}</span>
                </div>
                <i className="icon common error"></i><div className="tips"></div>
              </div>

              {/* <div className="field" style={{display:"none"}}>
                <input type="tel" name="smscode" className="code" onBlur={this.onValidField.bind(this)} ref="ELE_code" placeholder={LangClient.i18n("Confirmation Code")} />
                <input type="button" className="btn send_code" onClick={this.sendSMSCode.bind(this)} value={LangClient.i18n("Confirm")} />
                <i className="icon error"></i><div className="tips"></div>
              </div> */}

              <div className="field">
                <input type="email" ref="ELE_email" name="email" onBlur={this.onValidField.bind(this)} placeholder={LangClient.i18n("Email")}  />
                <i className="icon common error"></i><div className="tips"></div>
              </div>

              <div className="field">
                <input type="password" ref="ELE_password" name="password" onBlur={this.onValidField.bind(this)} min="6" max="14" placeholder={LangClient.i18n("Password")} />
                <i className="icon common error"></i><div className="tips"></div>
              </div>

              <div className="field">
                <label  ref="label" style={{display:"inline-block"}}><input type="checkbox" defaultChecked  ref="checkbox" />{LangClient.i18n("I am over 18 years old and I accept")} <a href="/info?leagle#Terms">{LangClient.i18n("Terms and Conditions")} </a>{LangClient.i18n("and")} <a href="/info?leagle#Security">{LangClient.i18n("Provacy Policies")}</a>.</label><i className="icon error errorcheck"></i><div className="tips"></div>
              </div>
              <div className="field system">
                <i className="icon common error system"></i><div className="tips"></div>
              </div>
              <div className="field"><input type="button" className="submit" onClick={this.doRegister.bind(this)} value={LangClient.i18n("Sign Up")} />
              </div>
              <div className="field">
                <a href={this.state.login_facebook} className="btn login_fb">
                  <i className="icon logo fb empty"></i>{LangClient.i18n("Sign In")}</a>
                <a href={this.state.login_google} className="btn login_gg">
                  <i className="icon logo gg empty"></i>{LangClient.i18n("Sign In")}</a>
              </div>
              <div className="field forget">
                <a href="#" onClick={this.gotoLogin.bind(this)} className="link login">{LangClient.i18n("Sign In")}</a>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}
