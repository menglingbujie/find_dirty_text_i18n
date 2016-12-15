import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Indices extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      detail_info:{},
    }
  }
  updateInfo(info){
    this.setState({detail_info:info});
  }
  formatDate(time){
    if(!time){
      return;
    }
    let reg=/( +)[0-9:]+/g;
    return time.replace(reg,"").split("-").reverse().join("/");
  }
  createMarkup(text){
    let _text = LangClient.i18n(text);
    return {__html: _text};
  }
  componentDidMount(){
    /*
     * 实现详情跳转到列表
     * */
    $('.wrap_right_infodetail_theme>a').click(function () {
        // $('.wrap_right_infolist').css("display", "block").siblings().css("display", "none");
        $('.wrap_right_info_list').css("display", "block");
        $('.wrap_right_infodetail').css("display", "none");
        sessionStorage.removeItem("ancId");
    });

  }
  render() {
    let detailInfo=this.state.detail_info;
    let _link_detail='';
    if(detailInfo&& detailInfo.url){
      _link_detail="link_detail";
    }else{
      _link_detail='link_detail_hide';
    }
    return (
      <div className="wrap_right_infodetail" style={{"display": "none"}}>
        <div className="wrap_right_infodetail_theme">
          <a href="#" className="icon common arrow_back"></a>
          <span>{detailInfo.title}</span>
        </div>
        <div className="wrap_right_infodetail_date">{this.formatDate(detailInfo.start_time)}</div>
        {/* <p>{LangClient.i18n("Bonus Activity")}</p>
        <p>{LangClient.i18n("Sign up for a real account")}</p>
        <p>{LangClient.i18n("Get a FREE $100 bonus")}</p>
        <p>{LangClient.i18n("Activity Details")}</p>
        <p>{LangClient.i18n("1. You can withdraw money only after you have made a deposit of more than $100")}</p>
        <p>{LangClient.i18n("2. For the accounts that take part in the bonus activities, in order to withdraw the bonus and deposit, your total amount of trade must exceed $2000")}</p>
        <p>{LangClient.i18n("Warm Tips")}</p>
        <p>{LangClient.i18n("1. In case we notice any misbehavior in the activity, Eagles Banc's reserves the right to pause the Withdraw process before it is fully explained.")}</p>
        <p>{LangClient.i18n("2. We reserve the right to contact you to offer further explanation of the terms of the activity and details of your behavior")}</p> */}
        <p dangerouslySetInnerHTML={this.createMarkup(detailInfo.content)}></p>
        <p className={_link_detail}><a style={{color:"#ffc900","textDecoration":"underline"}} href={detailInfo.url}>{LangClient.i18n("Details")}</a></p>
      </div>
    );
  }
}
