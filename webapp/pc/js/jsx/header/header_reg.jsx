import React from "react";
import $ from "jquery";
import OptionsLangs from "./panel_langs";
import Country from "../data/country";
import LangClient from '../tools/Lang-Client';
import Config from "../config/config";
//import Cookie from "../tools/cookie";
// console.log(lang);
export default class HeaderReg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "down",
      lang:"",
    }
    this.isOpenLangPanel = false;
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  componentWillMount(){
    this.state.lang = global.gLang;
  }
  componentDidMount() {
   //let _language= Cookie.getCookie("language");
    //this.setState({lang:_language});
  }
  componentDidUpdate() {
    // 为了兼容IE10上react渲染出的img标签中带有width、height属性，导致图片显示不正确的问题，2016-9-30，李猛
    $("#id_ultra_icon").removeAttr("width");
    $("#id_ultra_icon").removeAttr("height");
    $("#id_flag_icon").removeAttr("width");
    $("#id_flag_icon").removeAttr("height");
  }
  openLangsPanel(evt) {
    evt.stopPropagation();

    if (this.refs.panel_langs) {
      this.refs.panel_langs.toggleShow();
    }
    this.isOpenLangPanel = !this.isOpenLangPanel;
    if (this.isOpenLangPanel) {
      this.setState({symbol: "up"});
    } else {
      this.setState({symbol: "down"});
    }
  }
  resetSymbole() {
    this.isOpenLangPanel = false;
    this.setState({symbol: "down"});
  }
  render() {
    // console.log(LangClient.i18n("Customer Service"));
    let _state = this.state;
    let _isLogin = _state.is_login;
    //匹配当前语言
    let _langCode = "";
    let _countryData = [];
    for (let key in Country) {
      _countryData.push({key: key, name: Country[key].name, lang: Country[key].lang});
      //通过lang找到国家的缩写，旗子是用这个缩写显示的
      if(_state.lang==Country[key].lang){
        _langCode = key;
      }
    }
    let _lang = _state.lang;
    let _firstFlag = "icon flag " + _langCode.toLowerCase();
    let _logo = this.urlCdn+"/pc/images/ultra_logo.png";
    if (_lang == "zh-CN" || _lang == "zh-TW" || _lang == "zh-HK") {
      _logo = this.urlCdn+"/pc/images/ultra_logo_cn.png";
    }

    let symbolCss = "symble " + this.state.symbol;
    return (
        <header className="reg">
            <div className="h_1">
                <div className="wrap">
                    <a href="/" className="logo"><img style={{display:"none"}} id="id_ultra_icon" src={_logo}/></a>
                    <a href="#" className="flag" style={{display:"none"}} id="flagId" onClick={this.openLangsPanel.bind(this)}>
                        <i id="id_flag_icon" className={_firstFlag}></i>
                        <i className={symbolCss}></i>
                    </a>
                    <a href="#" className="service">{LangClient.i18n("Customer Service")}</a>
                </div>
            </div>
            <OptionsLangs ref="panel_langs" countries={_countryData} resetSymbole={this.resetSymbole.bind(this)} />
        </header>
    );
  }
}
