import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        timestamp: 0,
        text:""
    };

    this.expiretime = 0;
    this.servertime = 0;
    this.localExpTime = 0;
    this.intervalId = 0;
  	this.callTimeIsUp =null;//延迟调time up的timer
  	this.errorWaitTimer=null;//误差timer
  }

  formatTime(timestamp) {
    let _m = Math.floor(timestamp / 60);
    let _s = timestamp % 60;
    let _rm = (_m < 10)
        ? ("0" + _m)
        : _m;
    let _rs = (_s < 10)
        ? ("0" + _s)
        : _s;
    return _rm + ":" + _rs;
  }
  checkServerTime2(){
    let _url ="//"+Config.host[Config.env]+Config.api.tools.server_time;
    $.ajax({
      url:_url,
      async:false,
      success:(resp)=>{
        if(!resp){return;}
        if(this.callTimeIsUp){clearTimeout(this.callTimeIsUp)}
        if(this.errorWaitTimer){clearTimeout(this.errorWaitTimer)}

        let _servertime = resp.time;
        localStorage.setItem("server_time", _servertime);
        let _errorCrossTime = _servertime-this.expiretime;//服务器时间与截止时间的差值
        if(_errorCrossTime<=0){
          _errorCrossTime=0;
        }
        // console.log(_servertime+"---"+this.props.endtime+"==error timer=="+_errorCrossTime);
        if(_errorCrossTime>0){
          this.callTimeIsUp = setTimeout(()=>{
            this.errorWaitTimer = setTimeout(()=>{
              this.props.callTimeIsUp();
            },5e3);
          },_errorCrossTime*1000)
        }else{
          this.callTimeIsUp = setTimeout(()=>{
            this.props.callTimeIsUp();
          },5e3);
        }
      }
    });
  }
  //同步服务器时间
  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      async: false,
      success: (resp) => {
        if (!resp) {
            return;
        }

        this.servertime = resp.time;

        let localTime = Math.round((new Date()).getTime() / 1000);
        this.localExpTime = localTime + this.expiretime - this.servertime;
      }
    });
  }

  startTimer(exp_time) {
    if (exp_time == null || typeof(exp_time) == "undefined" || this.expiretime == exp_time) {
      return;
    }

    this.expiretime = exp_time;

    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
    }
    this.servertime = 0;

    this.intervalId = setInterval(() => {
      while (this.servertime == 0) {
        this.checkServerTime();
      }

      let localTime = Math.round((new Date()).getTime() / 1000);
      let count = this.localExpTime - localTime;

      this.setState({timestamp: count});
      if (count <= 0) {
        // 倒计时结束
        if(this.intervalId){clearInterval(this.intervalId);}

        this.setState({text:LangClient.i18n("Wait")});
        //setTimeout(() => {
          //this.props.callTimeIsUp();
        //}, 3000);
	      setTimeout(()=>{
	        this.checkServerTime2();//与服务器校准时间，等待误差时间到
	      },5e2);
	      return;
      }
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.startTimer(nextProps.expiretime);
  }

  componentDidMount() {
    this.startTimer(this.props.expiretime);
  }

  componentWillMount() {
    let count = this.props.expiretime - this.props.currenttime;
    this.state.text = "";
    this.state.timestamp = count;
  }

  componentWillUnmount() {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    let _text = this.state.text != "" ? this.state.text : this.formatTime(this.state.timestamp);
    return (
      <time>
        <i className="icon common clock"></i>
        <em className="counttime">{_text}</em>
      </time>
    );
  }
}
