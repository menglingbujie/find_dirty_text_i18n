import React from "react";
import $ from "jquery";
import Detail from "./detail";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Infolist extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      annList:[],
      ancInfo:{},
      ancDetailList:[],
    }
  }
  // 获取后台数据
  getAnnListData(){
    let _url = "//" + Config.host[Config.env] + Config.api.tools.annInfo;
    let _lang = Cookie.getCookie('language');
    $.ajax({
      url:_url,
      method:"post",
      data:{
        lang:_lang||"en",
      },
      success:(resp)=>{
        if(!resp){
          return ;
        }
        if(resp.data){
          let _dataArr=resp.data;
          let _data=[];
          for (var i = 0; i < _dataArr.length; i++) {
            let curAnc=_dataArr[i];
            if(curAnc.type==1||curAnc.type==3){
              _data.push(curAnc);
            }
          }
          this.setState({
            annList:_data,
            ancDetailList:_dataArr,
          },function(){
            this.getSession();
          });
        }
      }
    });
  }
  // 获取session
  getSession(){
    let sessionId = sessionStorage.getItem("ancId");
    if(sessionId){
      this.linkToDetail(sessionId);
    }
  }
  // 修改时间格式
  formatDate(time){
    let reg=/( +)[0-9:]+/g;
    return time.replace(reg,"").split("-").reverse().join("/");
  }
  linkToDetail(ancId){
    let _ancDetailList = this.state.ancDetailList;
    for (var i = 0; i < _ancDetailList.length; i++) {
      let curAnc=_ancDetailList[i];
      if(curAnc.id==ancId){
        $('.wrap_right_info_list').css("display", "none");
        $('.wrap_right_infodetail').css("display", "block");
        if(this.refs.ancDetailId){
          this.refs.ancDetailId.updateInfo(curAnc);
        }
        break;
      }
    }
  }
  componentDidMount(){
    this.getAnnListData();
  }
  render(){
    let _state=this.state;
    let _annListInfo=_state.annList;
    return (
      <div className="wrap_right_infolist" style={{"display":"none"}}>
        <ul className="wrap_right_info_list">
          {
            _annListInfo.map((val,index)=>{
              return(<li style={{"borderTop": "1px solid #666666; marginTop: 49px"}} key={index} onClick={this.linkToDetail.bind(this,val.id)}>
                      <a className="wrap_right_infolist_a" >{val.title}<span className="wrap_right_infolist_date">{this.formatDate(val.start_time)}</span></a>
                    </li>)
            })
          }
        </ul>
        <Detail ref="ancDetailId"/>
      </div>
    )
  }
}
