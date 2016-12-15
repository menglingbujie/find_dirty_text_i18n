import React from "react";
import $ from "jquery";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from '../tools/Lang-Client';
import Pageination from "./pageination";
import TableOrderItem from "./table_order_item";

const PAGE_SIZE = 7;

export default class TableOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logList: [],
      pages: 0,
      curIndex: -1
    };

    this.buyNew = false;
    this.page = 1;

    this.waitingArray = [];
    this.checking = false;
    this.total = 0;
    this.serverTimestamp = 0;
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  update(data, timestamp) {
    this.serverTimestamp = timestamp;

    let _state = this.state;
    if (_state && _state.logList && _state.logList.length > 0) {
      _state.logList.map((value, index) => {
        let refId = "log_item_" + index;
        let refObj = this.refs[refId];
        if (refObj) {
          refObj.update(data, timestamp);
        }
      });
    }
  }

  componentDidMount() {
    this.buyNew = this.props.buyNew;
    this.fetchLogsData(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    this.buyNew = nextProps.buyNew;
    this.fetchLogsData(nextProps.url);
  }

  componentWillUnmount() {}

  onPageChange(page) {
    this.page = page;
    this.fetchLogsData(this.props.url);
  }

  fetchLogsData(url) {
    let _language = Cookie.getCookie("language") || "en";
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.setState({logList: [], pages: 0});
      return;
    }

    this.setState({curIndex: -1});

    if (this.page <= 0) {
      this.page = 1;
    }

    $.ajax({
      url: url,
      data: {
        page: this.page,
        "page-size": PAGE_SIZE,
        "access-token": _token,
        "lang": _language
      },
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.status != 1) {
          this.onRequestError(resp.status, resp.msg || "");
          return;
        }

        let _sortData = resp.data.sort(this.sortJson("desc", "opentime", "number")); //asc正序,desc

        this.total = parseInt(resp.total);
        let pages = Math.ceil(this.total / PAGE_SIZE);
        pages = pages > 1
          ? pages
          : 0;

        this.setState({logList: _sortData, pages: pages});

        if (this.buyNew && _sortData.length > 0) {
          this.buyNew = false;
          this.props.notifyNewLog(_sortData[0]);
          this.setState({curIndex: 0});
        } else {
          let tradeInfo = this.props.getTradeInfoInPos();
          if (tradeInfo) {
            _sortData.map((value, index) => {
              if (value && value.id == tradeInfo.id) {
                this.setState({curIndex: index});
              }
            });
          }
        }

        if (_sortData.length <= 0 && this.page > 1) {
          // 如果当前页没取到数据，继续向前取
          // console.log("===fetch logs empty in page: " + this.page + ", try to fetch prev page");
          this.page -= 1;
          this.fetchLogsData(url);
        }
      },
      error: (e) => {}
    })
  }

  onRequestError(status, msg) {
    if (status == 401) {
      Cookie.deleteCookie("token");
      Cookie.deleteCookie("userinfo");
      setTimeout(() => {
        location.href = "/";
      }, 200);
      return;
    }

    if (status != 1) {
      this.showToast(LangClient.i18n(resp.msg));
    }
  }

  sortJson(order, key, type) {
    var ordAlpah = (order == 'asc')
      ? '>'
      : '<';
    var sortFun = new Function("alert('empty function')");
    if (type === "string") {
      sortFun = new Function('a', 'b', 'return a.' + key + ordAlpah + 'b.' + key + '?1:-1');
    } else if (type === "number") {
      sortFun = new Function('a', 'b', 'return parseInt(a.' + key + ")" + ordAlpah + 'parseInt(b.' + key + ')?1:-1');
    }
    return sortFun;
  }

  callTimeIsUp(data) {
    this.pushWaiting(data.item_id);
    this.props.dispatchDataToCharts(data);

    if (this.checking) {
      // console.log("===Checking, return");
      return;
    }

    setTimeout(() => {
      this.checkWaitingItems();
    }, 2000);
  }

  pushWaiting(id) {
    if (this.waitingArray.indexOf(id) >= 0) {
      return;
    }
    this.waitingArray.push(id);
  }

  popWaiting(id) {
    let index = this.waitingArray.indexOf(id);
    if (index >= 0) {
      this.waitingArray.splice(index, 1);
    }
  }

  inWaitingList(id) {
    return this.waitingArray.indexOf(id) >= 0
      ? true
      : false;
  }

  checkWaitingItems() {
    if (this.waitingArray.length == 0 || this.checking) {
      return;
    }

    let language = Cookie.getCookie("language") || "en";
    let token = Cookie.getCookie("token");
    if (!token) {
      return;
    }

    this.checking = true;

    let url = "//" + Config.host[Config.env] + Config.api.trade.trade_close_logs;
    $.ajax({
      url: url,
      data: {
        page: 1,
        "page-size": this.total,
        "access-token": token,
        "lang": language
      },
      success: (resp) => {
        this.checking = false;

        // 在最新的平仓记录里查询是不是有正处在waiting状态的记录
        let closedIds = [];
        let closedList = resp.data.sort(this.sortJson("desc", "expiretime", "number")); //asc正序,desc
        closedList.map((value, index) => {
          if (this.inWaitingList(value.id)) {
            this.popWaiting(value.id);
            closedIds.push(value.id);
          }
        });

        let findClosed = closedIds.length > 0
          ? true
          : false;
        if (closedIds.length > 0) {
          // console.log("===Find closed items: ", closedIds);

          this.props.dispatchToUpdateMoney();
          this.fetchLogsData(this.props.url);
        }

        // 不管有没有发现持仓变平仓的记录，都再次调用检查接口
        setTimeout(() => {
          this.checkWaitingItems();
        }, 2000);
      },
      error: (e) => {
        this.checking = false;
      }
    });
  }

  showTipRect(trade_info) {
    this.props.showTipRect(trade_info);
    this.state.logList.map((value, index) => {
      if (value && trade_info && value.id == trade_info.id) {
        this.setState({curIndex: index});
      }
    });
  }

  cancelPositionMode() {
    this.setState({curIndex: -1});
  }

  render() {
    let _state = this.state;
    let _listView = (
      <tr key="orderlist-empty">
        <td colSpan={9}>* {LangClient.i18n("No Data")}</td>
      </tr>
    );

    if (_state.logList && _state.logList.length > 0) {
      _listView = _state.logList.map((value, index) => {
        let refId = "log_item_" + index;
        let _curStyle = _state.curIndex == index
          ? "current"
          : "";
        return (<TableOrderItem ref={refId} curStyle={_curStyle} key={"orderlist" + index} tableItemInfo={value} servertime={this.serverTimestamp} callTimeIsUp={this.callTimeIsUp.bind(this)} isWaiting={this.inWaitingList.bind(this)} showTipRect={this.showTipRect.bind(this)}/>);
      });
    }

    return (
      <div className="panel_table">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>{LangClient.i18n("Option's Type")}</th>
                <th>{LangClient.i18n("Asset")}</th>
                <th>{LangClient.i18n("Open Time")}</th>
                <th>{LangClient.i18n("Entry Price")}</th>
                <th>{LangClient.i18n("Direction")}</th>
                <th>{LangClient.i18n("Strike Price")}</th>
                <th>{LangClient.i18n("Amount")}</th>
                <th>{LangClient.i18n("Expected Return")}</th>
                <th>{LangClient.i18n("Close Time")}</th>
              </tr>
            </thead>
            <tbody>
              {_listView}
            </tbody>
          </table>
        </div>
        <Pageination pages={_state.pages} onPageChange={this.onPageChange.bind(this)}/>
      </div>
    );
  }
}
