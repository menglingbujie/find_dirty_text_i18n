import React from "react";
import $ from "jquery";

import Pageination from "./pageination";
import LangClient from '../tools/Lang-Client';

export default class TableAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          listArr: [],
          pages: 0,
          page: 1,
        }
    }
    showToast(text){
      $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
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
        $.ajax({
            url: url,
            method: "get",
            data: null,
            success: (resp)=> {
                if (!resp) {
                    return;
                }
                if (resp.status != 1) {
                  if(resp.status==401||resp.status=="401"){
                    return;
                  }
                  // alert(LangClient.i18n(resp.msg));
                  this.showToast(LangClient.i18n(resp.msg));
                  return;
                }
                let _sortData = resp.data.sort(this.sortJson("desc","last_week_amount","number"));//asc正序,desc
                this.setState({
                  listArr : _sortData.slice(0, 8),
                  pages: 0,
                  page: 1,
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
    render(){
      let _listView = [];let _state =this.state;
      if(this.state.listArr&&this.state.listArr.length>0){
        let _listArr = this.state.listArr;
        _listArr.map((val,index)=>{
          _listView.push((<tr key={index}>
              <td>{index+1}</td>
              <td>{val.first_name+" "+val.last_name}</td>
              <td>{"$"+val.last_week_amount}</td>
              <td>{"$"+val.win_amount}</td>
          </tr>))
        })
      }else {
        _listView.push((<tr key="accountloglist-empty">
            <td colSpan={4}>* {LangClient.i18n("No Data")}</td>
        </tr>));
      }
      return(<div className="panel_table" style={{"overflow":"hidden"}}>
                <div className="table">
                    <table>
                        <thead>
                        <tr>
                            <th>{LangClient.i18n("Ranking")}</th>
                            <th>{LangClient.i18n("Real Name")}</th>
                            <th>{LangClient.i18n("Last Week Revenues")}</th>
                            <th>{LangClient.i18n("Accumulated Profit")}</th>
                        </tr>
                        </thead>
                        <tbody>
                           {_listView}
                        </tbody>
                    </table>
                </div>
                <Pageination pages={_state.pages} onPageChange={this.onPageChange.bind(this)}/>
            </div>);
    }
}
