import React from "react";
import $ from "jquery";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class NavAnn extends React.Component {
  constructor(props){
    super(props);
    this.state={
      annList:[],
      swiper:{}
    };
    this.ancSwiper = null;
    this.lang = "";
    if(typeof(window)==="undefined"){
      this.lang = global.process.env.language;
    }else{
      this.lang = LangClient.states.lang;
    }
  }

  // 获取公告数据
  getAnnData(callback){
    let _url = "//" + Config.host[Config.env] + Config.api.tools.annInfo;
    let _lang = this.lang||Cookie.getCookie('language');
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
            if(curAnc.type==1||curAnc.type==2){
              _data.push(curAnc);
            }
          }

          this.setState({
            annList:_data,
          });

          callback&&callback();
        }
      }
    });
  }
  // 实现上下滚动
  autoSwiper(){
    // let _swiperActiveIndex = sessionStorage.getItem("swiper_active_index")||0;
    this.ancSwiper=new Swiper("#annContainerId",{
      direction: 'vertical',
      autoplay: 5000,
      speed: 2000,
      height:50,
      // activeIndex:_swiperActiveIndex,
      loop: true,
      autoplayDisableOnInteraction:false,
      // onSlideChangeEnd:(swiper)=>{
      //   console.log("===onSlideChangeEnd="+swiper.activeIndex)
      //   sessionStorage.setItem("swiper_active_index",swiper.activeIndex);
      // },
      // onTransitionEnd:function(swiper){
      //   console.log("===onTransitionEnd=",swiper)
      // }
    });
  }
  // 设置session值
  setSession(ancId){
    sessionStorage.setItem("ancId",ancId);
    // sessionStorage.setItem("sub_nav",0);
  }
  evtMouseOver(){
    this.ancSwiper&&this.ancSwiper.stopAutoplay();
  }
  evtMouseOut(){
    this.ancSwiper&&this.ancSwiper.startAutoplay();
  }
  componentDidMount() {
    this.getAnnData(()=>{
      this.autoSwiper();
    });
  }

  render(){
    let _state=this.state;
    return(
      <div className="announ" onMouseOver={this.evtMouseOver.bind(this)} onMouseOut={this.evtMouseOut.bind(this)}>
        <i className="icon_horn"></i>
        <div className="swiper-container" id="annContainerId">
          <div className="swiper-wrapper">
            {
              _state.annList.map((val,index)=>{
                if(_state.annList.length==1){
                  if(val.type==2){
                    return(<a className="ann_list" href={val.url} key={index}>{LangClient.i18n(val.title)}</a>)
                  }
                  return(<a className="ann_list" href="/info" onClick={this.setSession.bind(this,val.id)} key={index}>{LangClient.i18n(val.title)}</a>)
                }
                if(_state.annList.length>1&&val.type==2){
                  return(<a className="ann_list_more swiper-slide" href={val.url} key={index}>{LangClient.i18n(val.title)}</a>)
                }
                return(<a className="ann_list_more swiper-slide" href="/info" onClick={this.setSession.bind(this,val.id)} key={index}>{LangClient.i18n(val.title)}</a>)

              })
            }
          </div>
        </div>
      </div>
    )
  }
}
