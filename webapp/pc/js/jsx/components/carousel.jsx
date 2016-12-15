import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     list:[],
     timestramp:""
    }
    this.updateFetchTimer = null;
    this.triggerScrollUpdateTimer = null;
    this.scrollUpdatetTimer = null;
  }
  scrollUpdate(){
    if(this.scrollUpdatetTimer){clearInterval(this.scrollUpdatetTimer);}
    let lb_innerwidth1 = $("#lb_inner1").width();
    let lb_innerwidth2 = $("#lb_inner2").width();
    let $lb_inner1 = $('#lb_inner1');
    let $lb_inner2 = $('#lb_inner2');
    let lb_inner1 = document.getElementById('lb_inner1');
    let lb_inner2 = document.getElementById('lb_inner2');
    $lb_inner1.css({left:0+'px'});
    $lb_inner2.css({left:lb_innerwidth1+'px',"display":"block"});
    let i = 0;
    let _this = this;
    function start() {
        clearInterval(_this.scrollUpdatetTimer);
        _this.scrollUpdatetTimer = setInterval(()=>{
        if(parseInt(lb_inner1.style.left)<=-lb_innerwidth1){lb_inner1.style.left=lb_innerwidth2+'px';}
        if(parseInt(lb_inner2.style.left)<=-lb_innerwidth2){lb_inner2.style.left=lb_innerwidth1+'px';}
        lb_inner1.style.left =parseInt(lb_inner1.style.left) -1 + 'px';
        lb_inner2.style.left =parseInt(lb_inner2.style.left) -1 + 'px';
      },30)
    }
    start();
		$("#lb_container").mouseover(()=>{
			clearInterval(_this.scrollUpdatetTimer);
		})
		$("#lb_container").mouseout(()=>{
      start();
		})
  }
  updateFetch(){
    // if(this.updateFetchTimer){clearTimeout(this.updateFetchTimer);}
    // this.updateFetchTimer = setTimeout(()=>{
    //   this.fetchScrollList();
    // },6e5)
  }
  showToast(text){
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }
  fetchScrollList(){
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.get_last_trades;
    let _postData ={
      num:50
    }
    $.get(_url,_postData,(resp)=>{
      if(!resp||!resp.status){
        this.showToast(resp.msg);return;
      }
      this.setState({list:resp.data,timestramp:resp.timestramp})

      if(this.triggerScrollUpdateTimer){clearTimeout(this.triggerScrollUpdateTimer);}
      this.triggerScrollUpdateTimer=setTimeout(()=>{
        this.scrollUpdate();
      },500);

      if(this.updateFetchTimer){clearTimeout(this.updateFetchTimer);}
      this.updateFetchTimer = setTimeout(()=>{
        this.fetchScrollList();
      },6e5)
    })
  }
  componentWillMount(){
    //this.fetchScrollList();
   }
  componentDidMount(){
    this.fetchScrollList();
    this.reallyStartTimer = setInterval(()=>{
      if(parseInt($('#lb_inner1').css("left"))<-1){
        clearInterval(this.reallyStartTimer);
      }else{
        if(this.triggerScrollUpdateTimer){clearTimeout(this.triggerScrollUpdateTimer);}
        if(this.updateFetchTimer){clearTimeout(this.updateFetchTimer);}
        this.fetchScrollList();
      }
    },2000)
    // this.triggerScrollUpdateTimer=setTimeout(()=>{
    //   this.scrollUpdate();
    // },500)
    //this.updateFetch();
  }
  componentWillUnmount(){
    if(this.triggerScrollUpdateTimer){clearTimeout(this.triggerScrollUpdateTimer);}
    if(this.updateFetchTimer){clearTimeout(this.updateFetchTimer);}
  }
  render() {
    let _timestramp = this.state.timestramp;
    let _list = this.state.list;
    let _spanArr =[];
    if(_list&&_list.length>0){
      _list.map((val,index)=>{
        let _time="";
        let _timeCross =Math.abs(_timestramp - val.opentime);
        let _seconds = _timeCross;
        let _day = parseInt(_seconds/86400);
        let _hour = parseInt(_seconds%86400/3600);
        let _min = parseInt(_seconds%3600/60);
        let _sec = Math.ceil(_seconds%60); if(_sec==60){_sec--;}
        if(_day>0){
          _time = _day+LangClient.i18n("Day");
          if(_day>1){_time = _day+LangClient.i18n("Days");}
        }else if(_hour>0){
          _time = _hour+LangClient.i18n('Hour');
          if(_hour>1){_time = _hour+LangClient.i18n("Hours");}
        }else if(_min>0){
          _time = _min+LangClient.i18n("Minute");
          if(_min>1){_time = _min+LangClient.i18n("Minutes");}
        }else{
          _time = _sec +LangClient.i18n('Second');
          if(_sec>1){_time = _sec+LangClient.i18n("Seconds");}
        }
        let _profit="";
        if(val.profit != "0.00"){
          _profit = (<span><span>{LangClient.i18n('and')}</span><span className='goldColor'>{LangClient.i18n('earned')+"$"+val.profit}</span></span>);

        }
        // let _span = (<span key={index}>{val.first_name+' '+val.last_name+' '+_time+LangClient.i18n('ago')+'  '+LangClient.i18n(val.instrument)+LangClient.i18n(val.direction)+'$'+val.amount+'，'+' @'+val.openprice+_profit}</span>);
        // _spanArr.push(_span);
        let _span = (
          <span key={index}>
            <span>{_time+LangClient.i18n('ago')}</span>
            <span className='goldColor'>{' '+val.first_name+' '+val.last_name}</span>
            <span>{LangClient.i18n('opened a')+LangClient.i18n(val.direction)}</span>
            <span>{LangClient.i18n('position on')}</span>
            <span className='goldColor'>{' '+LangClient.i18n(val.instrument)}</span>
            <span>{LangClient.i18n('at')+val.openprice+LangClient.i18n('price')+LangClient.i18n('investing')}</span>
            <span>{'$'+val.amount}</span>
            {_profit}
          </span>);
        _spanArr.push(_span);
      })
    }

    return (<div id="lb_container"><div id="lb_inner1">{_spanArr}</div><div id="lb_inner2">{_spanArr}</div></div>);
  }
}
