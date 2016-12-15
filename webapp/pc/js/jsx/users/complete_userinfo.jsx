import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from '../tools/Lang-Client';
import Country from "../data/country_all";
import Dropdown from "../components/dropdown";

export default class CompleteUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      errorCss: "field hide",
      areacode: "",
      code: ""
    }

    this.lang = "en";
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.lang = global.process.env.language;
    }else{
      this.lang = LangClient.states.lang;
    }
    this.urlCdn = Config.cdn[Config.env][this.lang].url;
  }

  componentDidMount() {
    let _language = Cookie.getCookie("language");
    let _langLower = _language;

    if (_langLower == "zh-CN" || _langLower == "zh-TW" || _langLower == "zh-HK") {
      $("#id_ultra_icon").attr("src", this.urlCdn+"/pc/images/ultra_logo_cn.png");
    }

    this.selDefaultCountry();

    $(document.body).on("click", (event) => {
      let _parents = $(event.target).parents();
      let _isOnDropdown = false;
      //如果点击的是dropdown则不需要close。因为select的onClick无法阻止事件冒泡
      _parents.map((index, val) => {
        if (val.className.match(/dropdown|code_label/)) {
          _isOnDropdown = true;
          return;
        }
      })
      if (_isOnDropdown) {
        return;
      }

      this.refs.country_dropdown.hideDropdown();
    })

    document.body.addEventListener("keydown", this.evtKeydown, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.evtKeydown, false);
  }

  evtKeydown(event) {
    if (event.keyCode == 13) {
      $(".btn.login").click();
    }
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  showError(text) {
    let _parentNode = $(".icon.error.cpl").parent();
    _parentNode.removeClass("hide");
    _parentNode.find(".tips").html(text);
  }

  hideError() {
    let _parentNode = $(".icon.error.cpl").parent();
    _parentNode.addClass("hide");
    _parentNode.find(".tips").html("");
  }

  validFieldBeforeRegister() {
    this.hideError();
    let _phoneValue = this.refs.ELE_phone.value || "";

    if (this.validField(_phoneValue, /^\s*$/)) {
      this.showError(LangClient.i18n("Enter a valid mobile number"));
      return false;
    } else if (!this.validField(_phoneValue, /^[+\-\d]+$/)) {
      this.showError(LangClient.i18n("Invalid mobile number, please enter again"));
      return false;
    } else {
      this.hideError();
    }

    if (!this.state.code) {
      this.showError(LangClient.i18n("Enter your coutry"));
      return false;
    }

    return true;
  }

  validField(value, regx) {
    return regx.test(value);
  }

  onValidField(event) {
    let _target = event.target;
    let _ele = $(_target);
    let _value = _ele.val();
    let _name = _ele.attr("name");
    let _errorMsg = "";
    let _hasError = false;

    if (_name == "phone") {
      if (!_value || _value.length < 0) {
        return;
      }

      if (this.validField(_value, /^\s*$/)) {
        _errorMsg = LangClient.i18n("Enter a valid mobile number");
        _hasError = true;
      } else if (_value.length > 0) {
        let _url = "//" + Config.host[Config.env] + Config.api.user.verify_phone_exist;
        let _postData = {
          "phone_number": this.state.areacode + this.refs.ELE_phone.value,
          "lang": Cookie.getCookie("language") || "en"
        }
        $.post(_url, _postData, (resp) => {
          // async request
          if (!resp || resp.status != 0) {
            _errorMsg = LangClient.i18n(resp.msg);
            this.showError(_errorMsg);
          }
        });
      }
    }

    if (_hasError) {
      this.showError(_errorMsg);
    } else {
      this.hideError();
    }
  }

  doCloseDialog() {
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }

  callSelectCountry() {
    if (this.refs.country_dropdown) {
      this.refs.country_dropdown.openDropdown();
    }
  }

  sendInfo() {
    try {
      ga("send", "event", "btn_cpl_info");
    } catch (e) {}

    let _ret = this.validFieldBeforeRegister();
    if (!_ret) {
      return;
    }

    let _token = Cookie.getCookie("token");
    if (!_token) {
      return;
    }

    let _phone_number = this.state.areacode + this.refs.ELE_phone.value || "0";

    let _postData = {
      phone_number: _phone_number,
      country: this.state.code,
      "lang": Cookie.getCookie("language") || "en"
    };

    let _url = "//" + Config.host[Config.env] + Config.api.user.complete_info + '?access-token=' + _token.replace(/^Bearer /, "");
    $.post(_url, _postData, (resp) => {
      if (!resp || resp.status != 1) {
        this.showError(LangClient.i18n(resp.msg));
        return;
      }

      Cookie.setCookie("token", _token, 7200);

      let _userinfo = this.props.userinfo;
      _userinfo.phone_number = _phone_number;
      Cookie.setCookie("userinfo", JSON.stringify(_userinfo), 7200);

      this.doCloseDialog();
      this.props.onCompleteInfoSuccess(_phone_number);
    });
  }

  getCountry(code, lang) {
    this.setState({areacode: lang, code: code})
  }

  sortJson(order, key, type) {
    var ordAlpah = (order == 'asc')
      ? '>'
      : '<';
    var sortFun = new Function("alert('empty function')");
    if (type === "string") {
      sortFun = new Function('a', 'b', 'return a.' + key + ordAlpah + 'b.' + key + '?1:-1');
    } else if (type === "number") {
      sortFun = new Function('a', 'b', 'return parseInt(a.' + key + ")" + ordAlpah + 'parseInt(b.' + key + ')?1:-1');
    }

    return sortFun;
  }

  selDefaultCountry() {
    let _countryData = [];
    for (let key in Country) {
      _countryData.push({
        key: key,
        nation: Country[key].name,
        name: "+" + Country[key].callingcode
      });
    }

    _countryData = _countryData.sort(this.sortJson("asc", "nation", "string"));

    let index = 0;
    let _lang = Cookie.getCookie("language") || "en";

    if (_lang == "zh-CN") {
      let _langCode = 'CN';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+" + _callingCode;
      this.setState({areacode: _areacode, code: _langCode});
      for (let i = 0; i < _countryData.length; i++) {
        if (_countryData[i].name == _areacode) {
          index = i;
          this.refs.country_dropdown.setState({index: index});
          break;
        }
      }
      return;
    }
    if (_lang == "en") {
      let _langCode = 'US';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+" + _callingCode;
      this.setState({areacode: _areacode, code: _langCode});
      for (let i = 0; i < _countryData.length; i++) {
        if (_countryData[i].key == _langCode) {
          index = i;
          this.refs.country_dropdown.setState({index: index});
          break;
        }
      }
      return;
    }
    if (_lang == "pt") {
      let _langCode = 'BR';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+" + _callingCode;
      this.setState({areacode: _areacode, code: _langCode});
      for (let i = 0; i < _countryData.length; i++) {
        if (_countryData[i].key == _langCode) {
          index = i;
          this.refs.country_dropdown.setState({index: index});
          break;
        }
      }
      return;
    }
    if (_lang == "pl") {
      let _langCode = 'PL';
      let _callingCode = Country[_langCode].callingcode;
      let _areacode = "+" + _callingCode;
      this.setState({areacode: _areacode, code: _langCode});
      for (let i = 0; i < _countryData.length; i++) {
        if (_countryData[i].key == _langCode) {
          index = i;
          this.refs.country_dropdown.setState({index: index});
          break;
        }
      }
      return;
    }
  }

  render() {
    let _countryData = [];

    for (let key in Country) {
      _countryData.push({
        key: key,
        name: "+" + Country[key].callingcode,
        nation: Country[key].name
      });
    }
    _countryData = _countryData.sort(this.sortJson("asc", "nation", "string"));

    this.state.code = this.state.code || _countryData[0].key;
    this.state.areacode = this.state.areacode || _countryData[0].name;
    let logoUrl = this.urlCdn+"/pc/images/ultra_logo.png";
    if (this.lang&&(this.lang == "zh-CN" || this.lang == "zh-TW" || this.lang == "zh-HK")) {
      logoUrl = this.urlCdn+"/pc/images/ultra_logo_cn.png";
    }
    return (
      <div className="dialog cpl_info">
        <div className="panel">
          <a href="#" onClick={this.doCloseDialog.bind(this)} className="btn icon common close"></a>
          <div className="content">
            <div className="logo"><img id="id_ultra_icon" src={logoUrl} /></div>
            <div>
              <h1 className="title">{LangClient.i18n("Please complete the registration information")}</h1>
            </div>
            <div className="form">
              <div className="field">
                <input type="tel" className="input phone" name="phone" onBlur={this.onValidField.bind(this)} ref="ELE_phone" placeholder={LangClient.i18n("Phone number")}/>
                <div className="code_label" ref="ELE_country">
                  <Dropdown dptype={0} ref="country_dropdown" getSelect={this.getCountry.bind(this)} data={_countryData} class="fieldIcon"/>
                  <span className="area_code" onClick={this.callSelectCountry.bind(this)}>{this.state.areacode}</span>
                </div>
              </div>
              <div className="field error hide">
                <i className="icon common error cpl"></i>
                <div className="tips"></div>
              </div>
              <div className="field login">
                <input type="button" className="btn login" onClick={this.sendInfo.bind(this)} value={LangClient.i18n("Confirm")}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
