import React from "react";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class SectionTrade extends React.Component{
  constructor(props){
    super(props);
    this.num=0;
    this.num2=0;
    this.num3=0;
  }
  showNum(number, selector) {
    //console.log("number: " + number);
    let itemSel = selector + " i";
    var it = $(itemSel);

    var len = String(number).length;
    if (it == null || it.length != len) {
      $(selector).empty();

      let flen = Math.ceil(len / 3) - 1;
      let fmod = parseInt(len % 3);
      let fIdxArr = [];
      if (flen > 0) {
        if (fmod > 0) {
          for (var i = 0; i < flen; i++) {
            fIdxArr.push(fmod + i * 3 - 1);
          }
        } else {
          for (var i = 0; i < flen; i++) {
            fIdxArr.push(3 + i * 3 - 1);
          }
        }
      }

      for (var i = 0; i < len; i++) {
        $(selector).append("<i></i>");
        if (fIdxArr.indexOf(i) != -1) {
          $(selector).append("<font>,</font>");
        }
      }
    }

    for (var i = 0; i < len; i++) {
      var char = String(number).charAt(i);
      var y = -parseInt(char) * 26;
      var obj = $(itemSel).eq(i);
      obj.animate({
        //backgroundPosition: "(0 "+String(y) + 'px)'
        backgroundPositionY: String(y)+"px"
      }, 2000, 'swing');
    }
  }
  showNum2(n,ele){
    let it = $(ele).find("i");
    let len = String(n).length;
    for(let i=0;i<len;i++){
      if(it.length<=i){
        $(ele).append("<i></i>");
      }

      let num=String(n).charAt(i);
      if (num.indexOf(i) != -1) {
        $(ele).append("<font>,</font>");
      }
      let y = -parseInt(num-1)*26; //y轴位置
      //console.log(n+"=="+num+"=="+y)
      let obj = $(ele).find("i").eq(i);
      $(obj).animate({ //滚动动画
        "backgroundPosition" :'(0 '+String(y)+'px)'
        }, 'slow','swing',function(){}
      );
    }
  }
  updateNumber(){
    this.showNum(this.num,"#totalUserId");
    this.showNum(this.num2,"#totalTradeId");
    this.showNum(this.num3,"#totalEarnId");
    //setTimeout(()=>{this.updateNumber()},3000);
  }
  fetchStatisticsNumber(){
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.tools.statistics_num;
    $.get(_url,(resp)=>{
      if(!resp){return;}
      let _result = (typeof(resp)==="string")?JSON.parse(resp):resp;

      this.num = _result.user||0;
      this.num2 = _result.in||0;
      this.num3 = _result.out||0;

      this.updateNumber();
    })
  }
  componentDidMount(){
    this.fetchStatisticsNumber();
  //  loadCharts();
  }
  render(){
    return (<div className="section trade">
      <div className="wrap">
        <h1><em>{LangClient.i18n("Trading with demo account")}</em></h1>
        <div className="panel_trade"></div>

        <div className="panel_statisitics">
          <div className="item"><div id="totalUserId"></div><span>{LangClient.i18n("Total number of users")}</span></div>
          <div className="item"><div id="totalTradeId"></div><span>{LangClient.i18n("Total amount of transactions")}</span></div>
          <div className="item"><div id="totalEarnId"></div><span>{LangClient.i18n("Total amount of customer profit")}</span></div>
        </div>
      </div>
    </div>)
  }
}
