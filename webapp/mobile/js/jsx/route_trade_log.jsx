import React from "react";
import $ from "jquery";
import Config from "./config/config";
import Cookie from "./tools/cookie";
import LangClient from "./tools/Lang-Client";
import TradeLogItem from "./trade_log_item";

const PAGE_SIZE = 50;

export default class TradeLog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: true,
      openingList: [],
      closedList: [],
      timestamp: 0
    };

    this.timestamp = 0;
    this.socketData = {};
    this.dateTimer = 0;

    this.pageClosed = 1
    this.totalCloseCnt = 0;

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  componentDidMount() {
    this.checkServerTime();
    this.connectSocket();
    this.fetchOpeningList(1);
    this.fetchClosedList(1);
  }

  connectSocket() {
    if (!io) {
      return;
    }

    let socket = io.connect(Config.socket[Config.env]);
    socket.on('connect', () => {
      // 订阅全部
      socket.emit("subscribe", "activelist");
    });

    socket.on('reconnect', () => {
      // this.stopCheckSocketState();
    });

    socket.on('disconnect', (e) => {
      console.log("on socket disconnect, return: " + e);
      // this.startCheckSocketState();
    });

    socket.on('error', (error) => {
      console.log("on socket error, return: ", error);
      // this.startCheckSocketState();
    });

    socket.on('message', (data) => {
      // parse socket data
      let obj = JSON.parse(data);
      if (obj) {
        let time = parseFloat(obj.t || 0);
        this.timestamp = this.timestamp < time
          ? time
          : this.timestamp;

        this.socketData = []; // 在重新赋值前才清空
        for (var key in obj) {
          if (key == "t") {
            continue;
          }
          let item = key + "," + time + "," + obj[key];
          this.socketData[key] = item;
        }
      }
    });
  }

  fetchOpeningList(page, list = []) {
    this.pageClosed = page;
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.setState({isLogin: false});
      return;
    }

    let url = "//" + Config.host[Config.env] + Config.api.trade.trade_create_logs;
    $.ajax({
      url: url,
      method: "get",
      data: {
        page: page,
        "page-size": PAGE_SIZE,
        "access-token": _token,
        "lang": Cookie.getCookie("language") || 'en'
      },
      success: (resp) => {
        if (!resp) {
          this.setState({openingList: list, isLogin: true});
          return;
        } else if (resp.status != 1) {
          if (resp.status == 401) {
            Cookie.deleteCookie("token");
            Cookie.deleteCookie("userinfo");
            this.setState({isLogin: false});
          }
          return;
        }

        if (page == 1) {
          // 如果是从第一页开始请求，清一遍旧数据（如果有的话）
          this.state.openingList = [];
          this.setState({openingList: [], isLogin: true});
        }

        let total = parseInt(resp.total);
        let data = resp.data;

        let newList = list.concat(data);
        newList = this.arrayUniq(newList);
        if (data.length < PAGE_SIZE || newList.length == total) {
          // 取完了
          let _sortData = newList.sort(this.sortJson("desc", "opentime", "number"));
          this.setState({openingList: _sortData, timestamp: resp.timestramp, isLogin: true});
        } else {
          this.fetchOpeningList(++page, newList)
        }
      },
      error: (e) => {
        this.setState({openingList: [], isLogin: true});
      }
    });
  }

  fetchClosedList(page) {
    let _token = Cookie.getCookie("token");
    if (!_token) {
      this.setState({isLogin: false});
      return;
    }

    let url = "//" + Config.host[Config.env] + Config.api.trade.trade_close_logs;
    $.ajax({
      url: url,
      method: "get",
      data: {
        page: page,
        "page-size": 10,
        "access-token": _token,
        "lang": Cookie.getCookie("language") || 'en'
      },
      success: (resp) => {
        if (!resp) {
          this.setState({closedList: this.state.closedList, isLogin: true});
          if(resp.status==401||resp.status=="401"){
            Cookie.deleteCookie("token");
            Cookie.deleteCookie("userinfo");
          }
          return;
        } else if (resp.status != 1) {
          if (resp.status == 401) {
            Cookie.deleteCookie("token");
            Cookie.deleteCookie("userinfo");
            this.setState({isLogin: false});
          }
          return;
        }

        if (page == 1) {
          // 如果是从第一页开始请求，清一遍旧数据（如果有的话）
          this.state.closedList = [];
          this.setState({closedList: [], isLogin: true});
        }

        this.totalCloseCnt = parseInt(resp.total);
        let data = resp.data;
        if (data.length > 0) {
          let list = this.state.closedList.concat(data);
          list = this.arrayUniq(list);
          let _sortData = list.sort(this.sortJson("desc", "expiretime", "number"));
          this.setState({closedList: _sortData, isLogin: true});
        }
      },
      error: (e) => {
        this.setState({closedList: this.state.closedList, isLogin: true});
      }
    });
  }

  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    $.ajax({
      url: _url,
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.time > this.timestamp) {
          this.timestamp = resp.time;
        }

        if (this.dateTimer) {
          clearTimeout(this.dateTimer);
        }

        this.updateDate();
      }
    });

    // 每隔30钟校准一下服务器时间
    setTimeout(() => {
      this.checkServerTime();
    }, 30000);
  }

  updateDate() {
    let timestamp = this.timestamp++;

    this.state.openingList.map((value, index) => {
      let name = value.instrument;
      let socket = this.socketData[name];

      let key = "open_" + index;
      let refCom = this.refs[key];
      if (refCom) {
        refCom.update(socket, timestamp);
      }
    });

    this.dateTimer = setTimeout(() => {
      this.updateDate();
    }, 1000);
  }

  arrayUniq(arr) {
    let newArr = [];
    let obj = {};
    for (let i = arr.length - 1; i >= 0; i--) {
      let id = arr[i].id;
      if (!obj[id]) {
        newArr.push(arr[i]);
        obj[id] = true;
      }
    }
    return newArr;
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

  onClickItem(logInfo) {
    if (logInfo) {
      location.href = "/mobile/trade?code=" + logInfo.instrument + "&type=" + logInfo.tradecat + "&order=" + logInfo.id;
    }
  }

  onTimeOut() {
    this.fetchOpeningList(1);
    this.fetchClosedList(1);
  }

  onScrollList() {
    let scrollTop = $(".tradelog_list").scrollTop();
    let innerHeight = $(".tradelog_list").innerHeight();
    let scrollHeight = $(".tradelog_list")[0].scrollHeight;
    if ((scrollTop + innerHeight) >= (scrollHeight - 2)) {
      // reached end
      if (this.totalCloseCnt > this.state.closedList.length) {
        let page = this.state.closedList.length == 0
          ? 1
          : ++this.pageClosed;
        this.fetchClosedList(page);
      }
    } else if (scrollTop <= 0) {
      // reached top
      this.fetchOpeningList(1);
      this.fetchClosedList(1);
    }
  }

  render() {
    let isLogin = this.state.isLogin;
    let total = this.state.openingList.length + this.state.closedList.length;
    let openList = this.state.openingList;
    let closeList = this.state.closedList;

    let pageCss = "page";

    if (!isLogin) {
      pageCss = "page unlogin";
    } else if (!total) {
      pageCss = "page empty";
    }

    let listViews = [];
    openList.map((value, index) => {
      let key = "open_" + index;
      listViews.push((<TradeLogItem ref={key} loginfo={value} key={key} onClickItem={this.onClickItem.bind(this)} onTimeOut={this.onTimeOut.bind(this)}/>));
    });

    closeList.map((value, index) => {
      let key = "close_" + index;
      listViews.push((<TradeLogItem loginfo={value} key={key}/>));
    });
    let _tradeNologImage = this.urlCdn +"/mobile/images/icon_trade_nologs.png";
    return (
      <div className={pageCss}>
        <div className="info empty">
          <div className="logo">
            <img src={_tradeNologImage}/>
          </div>
          <span>{LangClient.i18n("No trade log")}</span>
        </div>
        <div className="info unlogin">
          <div className="logo">
            <img src={_tradeNologImage} />
          </div>
          <span>{LangClient.i18n("Never sign in")}</span>
          <a href="/mobile/user/login?backurl=trade_log">{LangClient.i18n("Sign In")}</a>
        </div>
        <ul className="tradelog_list" onScroll={this.onScrollList.bind(this)}>
          {listViews}
        </ul>
      </div>
    )
  }
}
