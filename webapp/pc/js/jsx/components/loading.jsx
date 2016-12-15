import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class Loading extends React.Component{
  constructor(props){
    super(props);
    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  componentDidMount(){
    // window.onload = ()=>{
    //   $("#dialogContainerId").hide();
    //   ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
    // }
  }
  render(){
    let _srcLoaing = this.urlCdn+"/pc/images/loading.gif";
    return (<div className="dialog loading"><img src={_srcLoaing} /></div>);
  }
}
