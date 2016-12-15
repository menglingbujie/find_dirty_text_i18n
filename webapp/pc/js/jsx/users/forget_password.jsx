import React from "react";
import $ from "jquery";

import Config from "../config/config";
import Dropdown from "../components/dropdown";
import HeaderReg from "../header/header_reg";
import Country from "../data/country";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

export default class ForgetPassword extends React.Component
{
  constructor(props){
    super(props);
    this.state={
      errorMsg:"",
      errorCss:"field hide",
      areacode:"",
    }
    this.countryCode = "";
  }
  validEmail(email){
    if(!email){
      return LangClient.i18n("Enter your email address");
    }
    let emailValid= /\w@\w+\.\w/;
    if(!emailValid.test(email)){
      return LangClient.i18n("Enter a valid email address");
    }
    return "";
  }
  showToast(text){
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }
  showError(ele,text){
    // console.log($(ele).parent());
    $(ele).parent().addClass("error");
    $(ele).parent().find(".tips").html(text);
  }
  doChangePassword(){
    try{ga("send","event","reset_password");}catch(e){}
    let _pd = this.refs.ELE_password.value;
    let _cfpd = this.refs.ELE_cfm_password.value;
    // let _phone = this.refs.ELE_phone.value;
    let _email = this.refs.ELE_email.value;
    let _smscode = this.refs.ELE_code.value;
    // if(!_phone){
    //   this.showError($(this.refs.ELE_phone),LangClient.i18n("Enter a valid mobile number"));
    //   return;
    // }else if(!this.validField(_phone,/^[+\-\d]+$/)){
    //   this.showError($(this.refs.ELE_phone),LangClient.i18n("Invalid mobile number, please enter again"));
    //   return;
    // }
    if(!_email){
      this.showError($(this.refs.ELE_email),LangClient.i18n("Enter your email address"));
      return;
    }else if(!this.validField(_email,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
      this.showError($(this.refs.ELE_email),LangClient.i18n("Enter a valid email address "));
      return;
    }
    if(!_smscode){
      this.showError($(this.refs.ELE_code),LangClient.i18n("SMS code is required"));
      return;
    }else if(!this.validField(_smscode,(/\w+/))){
      this.showError($(this.refs.ELE_code),LangClient.i18n("Enter sms code you received"));
      return;
    }
    if(_pd!=_cfpd){
      // alert(LangClient.i18n("Password does not match the confirm password"));
      this.showError($(this.refs.ELE_cfm_password),LangClient.i18n("Password does not match the confirm password"));
      return;
    }
    if(_pd.length < 6 || _pd.length >14){
        // alert(LangClient.i18n("password must be between 6 and 14 characters"));
        this.showError($(this.refs.ELE_cfm_password),LangClient.i18n("password must be between 6 and 14 characters"));
        return;
    }

    // let _postData = {
    //   phonenumber:this.state.areacode+_phone,
    //   newpassword:_pd,
    //   cfmpassword:_cfpd,
    //   smscode:_smscode,
    //   "lang":Cookie.getCookie("language")||"en"
    // };
    let _postData = {
      email:_email,
      npwd:_pd,
      cnpwd:_cfpd,
      email_code:_smscode,
      "lang":Cookie.getCookie("language")||"en",
    };

    let _url = "//"+Config.host[Config.env]+Config.api.user.password_reset;
    $.post(_url,_postData,(resp)=>{
      if(!resp||resp.status!=1){
        // alert(resp.msg);
        this.showToast(LangClient.i18n(resp.msg));
        return;
      }
      // alert(LangClient.i18n("Reset password success!"));
      this.showToast(LangClient.i18n("Reset password success!"));
      location.href="/";
    });

  }
  getCountryCode(lang,code){
    this.setState({areacode:code});
  }
  sendSMSCode(){
    try{ga("send","event","smscode");}catch(e){}
    let _email =  this.refs.ELE_email.value;
    let isPhoneValid = (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(_email);
    if(!isPhoneValid){
      // alert(LangClient.i18n("Invalid mobile number, please enter again"));
      this.showError($(this.refs.ELE_email),LangClient.i18n("Invalid email number, please enter again"));
      return;
    }
    let _url = "//"+Config.host[Config.env]+Config.api.user.send_password_email;

    if($(".btn.send_code").hasClass("disable")){
      return;
    }
    let  _postData = {
        email:_email,
        country: this.countryCode,
    }
    $.post(_url,_postData,(resp)=>{

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
  // callSelectCountry(){
  // 	if(this.refs.country_dropdown){
  // 		this.refs.country_dropdown.openDropdown();
  // 	}
  // }
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
      //   case "phone":{
      //     if(this.validField(_value,/^\s*$/)){
      //       _errorMsg = LangClient.i18n("Enter a valid mobile number");
      //       _hasError = true;
      //     }else if(!this.validField(_value,/^[+\-\d]+$/)){
      //       _errorMsg=LangClient.i18n("Invalid mobile number, please enter again")
      //       _hasError = true;
      //     }
      //   }break;
      case "email":{
        // if(this.validField(_value,/^\s*$/)){
        //   _errorMsg = LangClient.i18n("Enter your email address");
        //   _hasError = true;
        // }else
        if(_value&&!this.validField(_value,/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)){
          _errorMsg=LangClient.i18n("Enter a valid email address")
          _hasError = true;
        }
      }break;
      case "smscode":{
        // if(this.validField(_value,/^\s*$/)){
        //   _errorMsg = LangClient.i18n("SMS code is required");
        //   _hasError = true;
        // }else
        if(_value&&!this.validField(_value,(/\w+/))){
          _errorMsg = LangClient.i18n("Enter sms code you received");
          _hasError = true;
        }
      }break;
      // case "smscode":{
      //   if(this.validField(_value,/^\s*$/)){
      //     _errorMsg = LangClient.i18n("SMS code is required");
      //     _hasError = true;
      //   }else if(!this.validField(_value,(/\d+/))){
      //     _errorMsg = LangClient.i18n("Enter sms code you received");
      //     _hasError = true;
      //   }
      // }break;
      case "cfmpassword":
      case "password":{
        // if(this.validField(_value,/^\s*$/)){
        //   _errorMsg = LangClient.i18n("Password is required");
        //   _hasError = true;
        // }else
        if(_value&&_value.length<6||_value.length>14){
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
  componentDidMount(){
    // $(".panel").mCustomScrollbar({
    //   axis:"y",
    //   mouseWheel:{axis:"y"},
    //   // scrollButtons:{enable:true}
    // });

    //close dropdown when click body
    // $(document.body).on("click",(event)=>{
    //   let _parents = $(event.target).parents();
    //   let _isOnDropdown = false;
    //   //如果点击的是dropdown则不需要close。因为select的onClick无法阻止事件冒泡
    //   _parents.map((index,val)=>{
    //     if(val.className.match(/dropdown|code_label/)){_isOnDropdown=true;return;}
    //   })
    //   if(_isOnDropdown){return;}
    //
    //   this.refs.country_dropdown.hideDropdown();
    // })
  }
  render(){
    let _countryCodeData=[];
    for(let key in Country){
      let _country=Country[key];
      if(_country.lang==LangClient.states.lang){
        this.countryCode=key;
      }
      _countryCodeData.push({key:key,name:"+"+_country.callingcode});
    }
    this.state.areacode = this.state.areacode||_countryCodeData[0].name;
    return (
      <article className="page forget">
        <HeaderReg />
        <h1>{LangClient.i18n("Forgot password?")}</h1>
        <div className="panel">
          <div className="content">
            <div className="form">
            <div className="field">
              <input type="tel" name="email" onBlur={this.onValidField.bind(this)} className="input email" ref="ELE_email" placeholder={LangClient.i18n("Email")} />
              <i className="icon common error"></i><div className="tips"></div>
            </div>
              {/* <div className="field">
                <input type="tel" name="phone" onBlur={this.onValidField.bind(this)} className="input phone" ref="ELE_phone" placeholder={LangClient.i18n("phone number")} />
                <div className="code_label">
                  <Dropdown dptype={0} ref="country_dropdown" getSelect={this.getCountryCode.bind(this)} data={_countryCodeData} />
                  <span className="area_code" onClick={this.callSelectCountry.bind(this)}>{this.state.areacode}</span>
                </div>
                <div className="tips"></div>
              </div> */}
              <div className="field">
                <input type="tel" name="smscode" onBlur={this.onValidField.bind(this)} className="code" ref="ELE_code" placeholder={LangClient.i18n("Confirmation Code")}  />
                <input type="button" className="btn send_code" onClick={this.sendSMSCode.bind(this)} value={LangClient.i18n("Confirm")}  />
                <i className="icon common error"></i><div className="tips"></div>
              </div>
              <div className="field">
                <input type="password" name="password" onBlur={this.onValidField.bind(this)} ref="ELE_password" min="6" max="14" placeholder={LangClient.i18n("New Password")}  />
                <i className="icon common error"></i><div className="tips"></div>
              </div>
              <div className="field">
                <input type="password" name="cfmpassword" onBlur={this.onValidField.bind(this)} ref="ELE_cfm_password" min="6" max="14" placeholder={LangClient.i18n("Please enter Password Again")} />
                <i className="icon common error"></i><div className="tips"></div>
              </div>
              <div className={this.state.errorCss}>
                <i className="icon common error"></i><span className="error_msg">{this.state.errorMsg}</span>
              </div>
              <div className="field">
                <input type="button" className="submit" onClick={this.doChangePassword.bind(this)} value={LangClient.i18n("Submit")} />
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}
