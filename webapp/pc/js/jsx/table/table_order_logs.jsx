import React from "react";
import $ from "jquery";

import Pageination from "./pageination";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

const PAGE_SIZE = 7;

export default class TableOrderLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logList: [],
            pages: 0,
            page: 1,
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
        document.cookie=key+"="+_val+";expires="+exp.toGMTString();
      }
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
                "page-size": PAGE_SIZE,
                "lang":Cookie.getCookie("language")||'en'
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
                //resp.tradeid
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

    render() {
        let _state = this.state;
        let _listView = [];
        if (_state.logList && _state.logList.length > 0) {
            _state.logList.map((val, index)=> {
                let _dir = (<i className="arrow icon common buy down"></i>);
                if (val.direction == "high") {
                    _dir = (<i className="arrow icon common buy up"></i>);
                }
                let _amount = parseFloat(val.amount);
                let _winState = (<span>Lose</span>);
                if(val.result==1){
                  _winState = (<span className="win">Win</span>);
                }else if(val.result==2){
                  _winState = (<span className="lose">Lose</span>);
                }
                _listView.push((<tr key={"orderloglist"+index}>
                    {/* <td>{_winState}</td> */}
                    <td>{LangClient.i18n(val.tradecat_alias)}</td>
                    <td>{LangClient.i18n(val.instrument)}</td>
                    <td>{this.formatDate(val.opentime)}</td>
                    <td>{val.openprice}</td>
                    <td>{_dir}</td>
                    <td>{val.closeprice}</td>
                    <td>{this.formatDate(val.expiretime)}</td>
                    <td>{val.amount}</td>
                    <td>{val.profit}</td>
                </tr>))
            })
        } else {
            _listView.push((<tr key="orderloglist-empty">
              <td colSpan={9}>* {LangClient.i18n("No Data")}</td>
            </tr>));
        }
        return (
            <div className="panel_table">
                <div className="table">
                    <table>
                        <thead>
                        <tr>
                          {/* <th>{LangClient.i18n("Calculate")}</th> */}
                          <th>{LangClient.i18n("Option's Type")}</th>
                          <th>{LangClient.i18n("Asset")}</th>
                          <th>{LangClient.i18n("Open Time")}</th>
                          <th>{LangClient.i18n("Entry Price")}</th>
                          <th>{LangClient.i18n("Direction")}</th>
                          <th>{LangClient.i18n("Expiry Price")}</th>
                          <th>{LangClient.i18n("Closed Positions")}</th>
                          <th>{LangClient.i18n("Amount")}</th>
                          <th>{LangClient.i18n("Revenue")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_listView}
                        {/* <tr>
                         <td>短期期权</td>
                         <td>GOLD</td>
                         <td>60s</td>
                         <td><i className="arrow down"></i></td>
                         <td>1234.22</td>
                         <td>1345.32</td>
                         <td>59%</td>
                         <td>12409.323</td>
                         <td>123.123</td>
                         <td>11/02/2016 09:32:32</td>
                         </tr>
                         <tr>
                         <td>短期期权</td>
                         <td>GOLD</td>
                         <td>60s</td>
                         <td><i className="arrow down"></i></td>
                         <td>1234.22</td>
                         <td>1345.32</td>
                         <td>59%</td>
                         <td>12409.323</td>
                         <td>123.123</td>
                         <td>11/02/2016 09:32:32</td>
                         </tr> */}
                        </tbody>
                    </table>
                </div>
                <Pageination pages={_state.pages} onPageChange={this.onPageChange.bind(this)}/>
            </div>
        );
    }
}
