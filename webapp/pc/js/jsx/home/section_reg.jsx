import React from "react";

import Cookie from "../tools/cookie";
import Config from "../config/config";
import Country from "../data/country_all";
import Dropdown from "../components/dropdown";
import LangClient from '../tools/Lang-Client';

export default class SectionReg extends React.Component{
  constructor(props){
    super(props);

    this.codeTimer = null;
    this.currency ='';
    this.currency_symbol="";
    this.countryCode = 0;

    this.state = {
      areacode:"",
    }
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
    let _parentNode = $(ele).parent();
    _parentNode.addClass("error");
    _parentNode.find(".tips").html(text);
  }
  validFieldBeforeRegister(){
    this.hideError($(".icon.error.system"));
    let _fnameValue = this.refs.ELE_fname.value||"";
    let _lnameValue = this.refs.ELE_lname.value||"";
    let _phoneValue= this.refs.ELE_phone.value||"";
    let _emailValue=this.refs.ELE_email.value||"";
    let _passwdValue=this.refs.ELE_password.value||"";
    //let _isAgree = $(this.refs.checkbox).is(":checked");

    // if(!_isAgree){
    //   this.showError($(this.refs.checkbox),LangClient.i18n("You must read and agree to the our terms!"));
    //   return false;
    // }

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
      this.showError($(this.refs.ELE_country),LangClient.i18n("Enter your coutry"));
      return false;
    }

    return true;
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
      "SignupForm[currency]":"USD",
      "SignupForm[currency_symbol]":"$",
      "lang":Cookie.getCookie("language")||"en",
      "SignupForm[utm_source]":Cookie.getCookie("utm_source")||"",
    };
    let _url = "//"+Config.host[Config.env]+Config.api.user.reg;
   	$.post(_url,_postData,(resp)=>{
      if(!resp||resp.status!=1){this.showError($(".icon.error.system"),LangClient.i18n(resp.msg));/*this.showToast(LangClient.i18n(resp.msg));*//*alert(resp.msg);*/ return;}
     	Cookie.setCookie("token",resp.data.token,7200);
      Cookie.setCookie("userinfo", JSON.stringify(resp.data.userinfo), 7200);

      let _demoTradeUrl = "//"+Config.host[Config.env+"_host"]+"/trade?token="+resp.data.token+"&lang="+Cookie.getCookie("language")||"en";
      setTimeout(()=>{location.href=_demoTradeUrl;},300);
    });
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
          }
          });
        }
      }break;
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
        }else{
          this.hideError($("input[name=password]"));
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
  getCountry(code,lang){
    this.setState({areacode:lang,code:code})
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
    this.selDefaultCountry();
  }
  render(){
    let _countryData = [];
    for(let key in Country){
      _countryData.push({key:key,nation:Country[key].name,name:"+"+Country[key].callingcode});
    }
    _countryData =  _countryData.sort(this.sortJson("asc","nation","string"));
    this.state.code = this.state.code || _countryData[0].key;
    this.state.areacode = this.state.areacode||_countryData[0].name;
    return (<div className="section reg">
      <div className="wrap">
        <div className="video" id="ifrVideoId">
          {/* <iframe src="https://www.youtube.com/embed/2g_r21lFS6g" frameBorder="0"  allowFullScreen></iframe> */}
          {/* <video preload="auto" muted loop="loop" autoPlay="autoplay" poster="/pc/images/video_placeholder.jpg" src="https://www.youtube.com/embed/o-_UTwiOJh4"></video> */}
        </div>
        <div className="panel_form">
          <div className="title">{LangClient.i18n("Sign Up")}</div>
          <div className="form">
            <div className="error_tips"><i className="icon error system"></i><div className="tips">adsfadsf</div></div>
            <div className="field name">
              <input type="text" ref="ELE_fname" name="firstname" placeholder={LangClient.i18n("First Name")} />
              <i className="icon common error"></i><div className="tips"></div>
            </div>
            <div className="field lname">
              <input type="text" ref="ELE_lname" name="lastname" placeholder={LangClient.i18n("Last Name")} />
              <i className="icon common error"></i><div className="tips"></div>
            </div>
            <div className="field">
              <input type="email" ref="ELE_email" name="email" onBlur={this.onValidField.bind(this)} placeholder={LangClient.i18n("Email")}  />
              <i className="icon common error"></i><div className="tips"></div>
            </div>
            <div className="field tel">
              <div className= "code_label" ref="ELE_country">
            		<Dropdown dptype={0} ref="country_dropdown" getSelect={this.getCountry.bind(this)} data={_countryData} className="fieldIcon" />
              	<span className="area_code" onClick={this.callSelectCountry.bind(this)} >{this.state.areacode}</span>
              </div>
              <input type="tel" name="phone" onBlur={this.onValidField.bind(this)} ref="ELE_phone" placeholder={LangClient.i18n("Phone number")}/>
              <i className="icon common error"></i><div className="tips"></div>
            </div>
            <div className="field">
              <input type="password" ref="ELE_password" name="password" onBlur={this.onValidField.bind(this)} min="6" max="14" placeholder={LangClient.i18n("Password")} />
              <i className="icon common error"></i><div className="tips"></div>
            </div>
            <div className="field">
              <input type="button" className="btn reg" onClick={this.doRegister.bind(this)} value={LangClient.i18n("Sign Up")} />
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}
