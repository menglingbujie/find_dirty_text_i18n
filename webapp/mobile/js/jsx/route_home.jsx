import React from "react";
import $ from "jquery";
import Config from "./config/config";
import Cookie from "./tools/cookie";
import TradeItem from "./trade_item";
import LangClient from "./tools/Lang-Client";
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      cates:[],
      navIndex:2,//导航索引
      socketData:{},
    }
    this.initSocket();
  }
  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  fetchNavData() {
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.trade_category;
    let _postData = {
      "lang": Cookie.getCookie("language"),
      "time": this.checkServerTime()
    }

    $.get(_url, _postData, (data, state, resp) => {
      if (data.status != 1) {
        this.showToast(data.msg);
        return;
      }

      let _navData = data.data || [];
      if (!_navData || _navData.length < 0) {
        return;
      }
      //初始化导航数据
      let _cates = _navData.sort(this.sortJson("asc", "cat_order", "number")); //asc正序，desc倒序
      let _navIndex = sessionStorage.getItem("nav_index");
      //如果本地没有存储nav_index这里需要判断，并初始化
      if (!_navIndex) {
        sessionStorage.setItem("nav_index", _cates[0].id);
        _navIndex = _cates[0].id; //初始化导航索引
      }
      // this.setState({cates: _cates});
      this.state.cates = _cates;
      //先让导航加载，才能引出之后的list
      this.fetchTradeListData(_navIndex);
    });
  }

  fetchTradeListData(cateid) {
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.trade_by_cate;
    let _postData = {
      cat: cateid,
      "lang": Cookie.getCookie("language"),
      "time": this.checkServerTime()
    }
    if (this.state.navType != 0) {
      _postData.type = this.state.navType;
    }

    $.get(_url, _postData, (data, state, resp) => {
      if (data.status != 1) {
        this.setState({trade_list: [],navIndex:cateid});
        return;
      }
      //渲染列表
      this.setState({trade_list: data.data,navIndex:cateid});
    });
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
  checkServerTime() {
    let _url = "//" + Config.host[Config.env] + Config.api.tools.server_time;
    let _timeText = $.ajax({url: _url,async: false}).responseText;

    //如果服务器没获取到时间，则取本地时间
    if(!_timeText){
      return parseInt((new Date()).getTime()/1000);
    }
    return JSON.parse(_timeText).time;
  }

  changeNav(id){
    // console.log("===click==",id);
    //切换产品类型重新渲染列表
    this.fetchTradeListData(id);
  }
  initSocket(){
    if(!this.socketObj){
      this.socketObj = io.connect(Config.socket[Config.env]);
    }
    let _that = this;

    this.socketObj.on('connect', function() {
      // console.log("===connect==");
      // console.log(_that.props.tradeInfo);
      // 订阅
      this.emit("subscribe", "activelist");
      // this.emit("subscribe", _that.props.tradeInfo.name);
    });

    this.socketObj.on('reconnect', function() {
      // console.log("==reconnect==")
      // _that.stopCheckSocketState();
      showToast("Real-time data is now connected.");
    });

    this.socketObj.on('disconnect', function(e) {
      // console.log("==disconnect==")
      // this.socketObj.io.reconnect();
      // 订阅
      // console.log("on socket disconnect, return: " + e);
      showToast("Real-time data connection temporarily failed.");
      // _that.startCheckSocketState();
    });

    this.socketObj.on('error', function(error) {
      // console.log("===socket error===");
      // console.log("on socket error, return: ", error);
      showToast("Network is unstable, please check your network connection.");
    });
    this.socketObj.on('message', (data) => {
      if(data){
        this.setState({socketData:JSON.parse(data)});
      }
    });
    // this.socketObj.on('message', (data) => {
    //   // console.log(data);
    //   let obj = JSON.parse(data);
    //   if (obj) {
    //     let time = parseFloat(obj.t || 0);
    //
    //     this.socketData = []; // 在重新赋值前才清空
    //     for (var key in obj) {
    //       if (key == "t") {
    //         continue;
    //       }
    //       //code, time, price
    //       let item = key + "," + time + "," + obj[key];
    //       // console.log(item);
    //       this.socketData.push(item);
    //     }
    //   }
    //   if(this.socketData||this.socketData.length>0){
    //     this.setState({socketData:this.arrayUniq(this.socketData)});
    //   }
    // });
  }
  showToast(text) {
    $(".toast").html(LangClient.i18n(ext)).fadeIn().delay(3e3).fadeOut();
  }
  // 去除socketData重复的数据，只留最新的不重复数据
  arrayUniq(arr) {
    let newArr = [];
    let obj = {};
    for (let i = arr.length - 1; i >= 0; i--) {
      let _d = arr[i];
      let _first = _d.split(",")[0];
      if (!obj[_first]) {
        newArr.push(_d);
        obj[_first] = true;
      }
    }
    return newArr;
  }
  componentWillMount(){
    this.fetchNavData();
  }
  componentDidMount(){
  }
  componentWillUnmount(){
    // console.log(this.socketObj.io);
    // this.socketObj.io.reconnect();
    // this.socketObj.io.destroy();
    // this.socketObj.io.cleanup();
    // this.socketObj.io.close();
    // this.socketObj.io.updateSocketIds();
    // this.socketObj.io.disconnect();
  }
  render() {
    let _state = this.state;
    let _navCateList = _state.cates;
    let _tradeList = _state.trade_list;
    // console.log(_state.socketData)
    return (
    <div className="page product">
      <div className="nav">
        {
          (()=>{
            if(!_navCateList||_navCateList.length<=0){
              return (<div className="loading">{LangClient.i18n("Loading")}...</div>)
            }else{
              return (_navCateList.map((val,key)=>{
               let _currentStyle="item";
               if(val.id==_state.navIndex){
                _currentStyle="item current";
               }
               return (<a key={val.cat+"-"+val.id} href="#" onClick={this.changeNav.bind(this,val.id)} className={_currentStyle}><span>{LangClient.i18n(val.cat)}</span></a>)
             }));
            }
          })()
        }
      </div>
      <ul className="list_title">
        <li href="#"><span>{LangClient.i18n("Products")}</span></li>
        <li href="#"><span>{LangClient.i18n("Payout")}</span></li>
        <li href="#"><span>{LangClient.i18n("Strike Price")}</span></li>
      </ul>
      <ul className="list">
        {
          (()=>{
            if(!_tradeList||_tradeList.length<=0){
              return (<div className="loading">{LangClient.i18n("Loading")}...</div>)
            }else{
              return (_tradeList.map((val,key)=>{
                // console.log(val.name+"=="+val.price+"===="+_state.socketData[val.name]);
                let _price = _state.socketData[val.name];
                return (<TradeItem navIndex={_state.navIndex} socketData={_price} key={val.name+"-"+val.id} tradeInfo={val} />);
              }));
            }
          })()
        }
      </ul>
    </div>);
  }
}
