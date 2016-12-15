import React from "react";
import $ from "jquery";

import Config from "../config/config";
import Pageination from "./pageination";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

const PAGE_SIZE = 7;

export default class TableAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logList: [],
            pages: 0,
            page: 1,
        };
        this.ACCOUNT_STATE = [
          LangClient.i18n("Unpaid"), LangClient.i18n("Payment Success!"),
          LangClient.i18n(""), LangClient.i18n("Payment Failed!"),
          LangClient.i18n("Canceled"),LangClient.i18n("Withdraw pending"),
          LangClient.i18n("Withdraw success"),LangClient.i18n("Transferred"),
          LangClient.i18n("Refused"),LangClient.i18n("Canceled")];
    }

    formatDate(timestamp) {
        let _date = new Date(timestamp * 1000);
        let __month = _date.getMonth()+1;
        let _month = (__month < 10) ? "0" + __month : __month;
        let _day = (_date.getDate() < 10) ? "0" + _date.getDate() : _date.getDate();
        let _h = (_date.getHours() < 10) ? "0" + _date.getHours() : _date.getHours();
        let _m = (_date.getMinutes() < 10) ? "0" + _date.getMinutes() : _date.getMinutes();
        let _s = (_date.getSeconds() < 10) ? "0" + _date.getSeconds() : _date.getSeconds();
        return _month + "/" + _day + " " + _h + ":" + _m + ":" + _s;
    }
    showToast(text){
      $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
    }
    getCookie(key){
      var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
    }
    deleteCookie(key){
      let exp = new Date();
      exp.setTime(exp.getTime()-1);
      let _val = this.getCookie(key);
      if(!!_val){
        document.cookie=key+"="+_val+";expires="+exp.toGMTString()+";path=/";
      }
    }
    sortJson(order, key,type) {
        var ordAlpah = (order == 'asc') ? '>' : '<';
        var sortFun = new Function("alert('empty function')");
        if(type==="string"){
          sortFun = new Function('a', 'b', 'return a.' + key + ordAlpah + 'b.' + key + '?1:-1');
        }else if(type==="number"){
          sortFun = new Function('a', 'b', 'return parseInt(a.' + key+")" + ordAlpah + 'parseInt(b.' + key + ')?1:-1');
        }
        return sortFun;
    }
    fetchLogsData(url) {
        let _token = this.getCookie("token");
        if (!_token) {
            return;
        }
        $.ajax({
            url: url,
            method: "get",
            data: {
                "access-token": _token.replace(/^Bearer /, ""),
                page: this.state.page,
                "page-size": PAGE_SIZE
            },
            success: (resp)=> {
                if (!resp) {
                    return;
                }
                if (resp.status != 1) {
                  if(resp.status==401||resp.status=="401"){
                    this.deleteCookie("token");
                    this.deleteCookie("userinfo");
                    setTimeout(()=>{location.href="/";},2e2);
                    return;
                  }

                  this.showToast(LangClient.i18n(resp.msg));
                  return;
                }

                //更新平仓列表
                let total = parseInt(resp.total);
                let pages = Math.floor(total / PAGE_SIZE);
                let _sortData = resp.data.sort(this.sortJson("desc","expiretime","number"));//asc正序,desc
                this.setState({
                    logList: _sortData.slice(0, PAGE_SIZE),
                    pages: (total % PAGE_SIZE != 0) ? (pages + 1) : pages
                })
            }
        })
    }

    componentDidMount() {
      this.fetchLogsData(this.props.url);
    }

    onPageChange(page) {
      this.state.page = page;
      this.fetchLogsData(this.props.url);
    }
    showToast(text) {
      $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
    }
    handleWidthdrawl(msg,id){

      if(msg=="none"){return;}
      let _token = this.getCookie("token");
      if (!_token) {
          return;
      }
      if(msg=="cancel"){
        let _url = "//"+Config.host[Config.env]+Config.api.account.withdraw_cancel;
        let _data = {
          "id":id,
          "access-token":_token.replace(/^Bearer /, ""),
          "lang": Cookie.getCookie("language") || 'en'
        }
        $.get(_url,_data,(resp)=>{
          if(!resp||resp.status!=1){
            //7 is withdraw money to user's bank
            //need to comfirm
            if(resp.status==7||resp.status=="7"){
              this.fetchLogsData(this.props.url);
            }else{
              this.showToast(LangClient.i18n(resp.msg));
            }

          }else{
            let _content =LangClient.i18n("Canceled");
            $(".panel_table .table table tr td .operation").filter("#btn"+id).html(_content);

            //通知用户信息更新金额，并重新刷新列表
            this.props.dispatchToUpdateMoney();
            this.fetchLogsData(this.props.url);
            return;
          }
        });
        return;
      }
      if(msg=="confirm"){
        let _url = "//"+Config.host[Config.env]+Config.api.account.withdraw_confirm;
        let _data = {
          "id":id,
          "access-token":_token.replace(/^Bearer /, ""),
          "lang": Cookie.getCookie("language") || 'en'
        }
        $.get(_url,_data,(resp)=>{
          if(!resp||resp.status!=1){
            let _errorMsg=LangClient.i18n(resp.msg);
            this.showToast(_errorMsg);
          }else{
            let _content =LangClient.i18n("Payment Received");
            $(".panel_table .table table tr td .operation").filter("#btn"+id).html(_content);

            //通知用户信息更新金额，并重新刷新列表
            this.props.dispatchToUpdateMoney();
            this.fetchLogsData(this.props.url);
            return;
          }
        });
        return;
      }
    }
    render() {
        let _state = this.state;
        let _listView = [];
        if (_state.logList && _state.logList.length > 0) {
            _state.logList.map((val, index)=> {
                let _dir = (<i className="arrow down"></i>);
                let _accountState = {};
                let _operationClass="operation";
                let _operationContent="--";
                let _handleOperationPara ="none";
                if (val.direction == "high") {
                    _dir = (<i className="arrow up"></i>);
                }
                if (val.status == 5 || val.status == "5") {
                    _accountState = {color: "#ffc900"};
                    _operationClass = "operation red";
                    _operationContent = LangClient.i18n("CANCEL");
                    _handleOperationPara="cancel";
                }
                if (val.status == 7 || val.status == "7") {
                    _operationClass = "operation yellow";
                    _operationContent = LangClient.i18n("CONFIRM");
                    _handleOperationPara="confirm";
                }
                let _typeDisp = "";
                let _type = val.type;
                if (_type == 1) {
                  _typeDisp = LangClient.i18n("Deposit");
                } else if (_type == 2) {
                  _typeDisp = LangClient.i18n("System added");
                } else if (_type == 3) {
                  _typeDisp = LangClient.i18n("Withdraw");
                } else if (_type == 4) {
                  _typeDisp = LangClient.i18n("System deducted");
                }

                _listView.push((<tr key={"accountloglist"+index}>
                    <td>{_typeDisp}</td>
                    <td>{val.currency}</td>
                    <td>{val.currency_symbol+val.amount}</td>
                    <td>{val.fee}</td>
                    <td>{this.formatDate(val.create_time)}</td>
                    <td style={_accountState}>{LangClient.i18n(this.ACCOUNT_STATE[val.status])}</td>
                    <td><button className={_operationClass} id={"btn"+val.id} onClick={this.handleWidthdrawl.bind(this,_handleOperationPara,val.id)}>{_operationContent}</button></td>
                </tr>))
            })
        } else {
            _listView.push((<tr key="accountloglist-empty">
              <td colSpan={7}>* {LangClient.i18n("No Data")}</td>
            </tr>));
        }
        return (
            <div className="panel_table">
                <div className="table">
                    <table>
                        <thead>
                        <tr>
                            <th>{LangClient.i18n("Top Up/Withdraw")}</th>
                            <th>{LangClient.i18n("Currency")}</th>
                            <th>{LangClient.i18n("AmountOne")}</th>
                            <th>{LangClient.i18n("Transaction Fee")}</th>
                            <th>{LangClient.i18n("Transaction Time")}</th>
                            <th>{LangClient.i18n("Status")}</th>
                            <th>{LangClient.i18n("Operation")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_listView}
                        {/* <tr>
                         <td>充值</td>
                         <td>GOLD</td>
                         <td>124.323</td>
                         <td>11/02/2016 09:32:32</td>
                         <td className="applyfor">申请中</td>
                         </tr>
                         <tr>
                         <td>提现</td>
                         <td>美元</td>
                         <td>124.323</td>
                         <td>11/02/2016 09:32:32</td>
                         <td>已到账</td>
                         </tr> */}
                        </tbody>
                    </table>
                </div>
                <Pageination pages={_state.pages} onPageChange={this.onPageChange.bind(this)}/>
            </div>);
    }
}
