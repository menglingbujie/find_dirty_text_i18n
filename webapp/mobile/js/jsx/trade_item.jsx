import React from "react";

import Config from "./config/config";
import LangClient from "./tools/Lang-Client";
export default class TradeItem extends React.Component{
  constructor(props){
    super(props);

    this.state={
      price:0,
      priceState:"price",
    }
    this.oldPrice = 0;
    this.oldPriceState="price";
    this.tradeCode="";
  }

  formatDate(timestamp) {
    let _date = new Date(timestamp * 1000);
    // return (_date.getFullYear()+"-"+(_date.getMonth()+1)+"-"+_date.getDate()+" "+_date.getHours()+":"+_date.getMinutes()+":"+_date.getSeconds());

    let _h = (_date.getHours() < 10)
      ? "0" + _date.getHours()
      : _date.getHours();
    let _m = (_date.getMinutes() < 10)
      ? "0" + _date.getMinutes()
      : _date.getMinutes();
    // let _s = (_date.getSeconds()<10)?"0"+_date.getSeconds():_date.getSeconds();
    return (_date.getMonth() + 1) + "/" + _date.getDate() + " " + _h + ":" + _m;
  }
  doSelectProductItem(tradecode){
    // console.log(this.props.navIndex+"==select product item=="+tradecode);
    this.tradeCode=tradecode;
    location.href="/mobile/trade?code="+tradecode+"&type="+this.props.navIndex;
  }
  getParameterByUrl(){
    if(location.search.match(/\?code=/)){
      let _tradeCode = location.search.match(/\?code=(.*)/)[1];
      this.tradeCode=_tradeCode;
    }
  }
  componentWillMount(){
    // console.log("==will mount="+this.props.socketData)
    this.oldPrice = this.props.tradeInfo.price;
    this.getParameterByUrl();
  }
  componentDidMount(){
  }
  componentWillUnmount(){
    this.oldPrice = 0;
    this.oldPriceState="price";
  }
  render(){
    let _props = this.props;
    let _state = this.state;
    let _tradeInfo = _props.tradeInfo;
    let _style="",_liStyle="";
    if(_tradeInfo.trade_status==0||_tradeInfo.trade_status=="0"){
      _style="wait";
    }
    if(this.tradeCode&&_tradeInfo.name==this.tradeCode){
      _liStyle="active";
    }
    return (
      <li className={_liStyle} onClick={this.doSelectProductItem.bind(this,_tradeInfo.name)}>
        <div className={_style}>
          <span className="code">{LangClient.i18n(_tradeInfo.name)}</span>
          {
            (()=>{
              if(_tradeInfo.trade_status==0||_tradeInfo.trade_status=="0"){
                return (<span className="date">{LangClient.i18n("Trade time")}：{this.formatDate(_tradeInfo.start_time)}</span>)
              }else{
                //交易活动部分
                let _priceState = this.oldPriceState||"price";
                if(_props.socketData>this.oldPrice){
                  _priceState="price up";
                }else if(_props.socketData < this.oldPrice){
                  _priceState="price down";
                }
                this.oldPrice = _props.socketData;
                this.oldPriceState=_priceState;
                // console.log(_tradeInfo.name+":"+(_props.socketData-_tradeInfo.price)+"=="+_props.socketData+"====="+_tradeInfo.price)

                return (
                  <span className="about_price">
                    <span className="per">{_tradeInfo.time_points[0].win_rate}%</span>
                    <span className={this.oldPriceState}>{this.oldPrice}</span>
                  </span>
                )
              }
            })()
          }
        </div>
      </li>
    )
  }
}
