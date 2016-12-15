import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Cookie from "../tools/cookie";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class DialogOrdering extends React.Component {
  constructor(props) {
    super(props);
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  render() {
    let _srcLoaing =this.urlCdn+"/pc/images/loading.gif";
    return (
      <div className="dialog order_pop">
        <div className="panel">
          <img src={_srcLoaing}/>
          <span className="order_desc">{LangClient.i18n("Processing")}</span>
        </div>
      </div>
    )
  }
}
