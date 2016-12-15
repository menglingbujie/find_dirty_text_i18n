import React from "react";
import $ from "jquery";

import Config from "../config/config";
import OptionsTradeNav from "./item_nav";
import OptionsTradeSubNav from "./item_subnav";
import OptionsTradeList from "./item_list";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

export default class OptionsListSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navType: 0, //二级导航
      trade_list: [],
      cates: []
    };

    this.navIndex = 1; //导航索引
    this.timestamp = 0;
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {
    this.navIndex = parseInt(sessionStorage.getItem("nav_index")) || 1;
    this.fetchNavData();
  }

  update(data, timestamp) {
    this.timestamp = timestamp;
    this.refs.tradeList.update(data, timestamp);
    this.validExpireTime(timestamp);
  }

  fetchNavData() {
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.trade_category;
    let _postData = {
      "lang": Cookie.getCookie("language") || "en",
      "time": this.timestamp
    }

    $.get(_url, _postData, (data, state, resp) => {
      if (data.status != 1) {
        this.showToast(LangClient.i18n(data.msg));
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
        this.navIndex = _cates[0].id; //初始化导航索引
        this.setState({cates: _cates, navIndex: _cates[0].id});
      } else {
        this.setState({cates: _cates});
      }

      //先让导航加载，才能引出之后的list
      this.fetchTradeListData();
    });
  }

  fetchTradeListData() {
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.trade_by_cate;
    let _postData = {
      cat: this.navIndex,
      "lang": Cookie.getCookie("language") || "en",
      "time": this.timestamp
    }
    if (this.state.navType != 0) {
      _postData.type = this.state.navType;
    }

    $.get(_url, _postData, (data, state, resp) => {
      if (data.status != 1) {
        this.setState({trade_list: []});
        return;
      }

      this.setState({trade_list: data.data});

      if (data.data && data.data.length > 0) {
        this.onTradeTypeChange();
      }
    });
  }

  listenNavChange(index) {
    this.navIndex = index;
    this.fetchTradeListData();
  }

  listenTypeChange(type) {
    this.state.navType = type;
    this.refs.tradeList.changeTradeType(type);
    this.fetchTradeListData();
  }

  onTradeTypeChange() {
    this.props.onTradeTypeChange();
  }

  onChangeTimePoint(timePointInfo) {
    this.props.onChangeTimePoint(timePointInfo);
  }

  onItemSelected(data) {
    this.props.onItemSelected(data);
  }

  findPriceState(tradeCode) {
    if (this.refs.tradeList) {
      return this.refs.tradeList.findPriceState(tradeCode);
    }

    return "";
  }

  getTradeInfo(tradeCode = null) {
    if (tradeCode == null || tradeCode === "undefined") {
      tradeCode = localStorage && localStorage.getItem("curr_trade_code");
    }

    if (tradeCode == null || tradeCode === "undefined") {
      return this.state.trade_list[0];
    } else {
      for (var i = 0; i < this.state.trade_list.length; i++) {
        if (this.state.trade_list[i].name == tradeCode) {
          return this.state.trade_list[i];
        }
      }

      return null;
    }
  }

  getTimePointIdx(tradeCode) {
    if (this.refs.tradeList) {
      return this.refs.tradeList.getTimePointIdx(tradeCode);
    }

    return 0;
  }

  onClickTimePoint(value) {
    if (this.refs.tradeList) {
      this.refs.tradeList.onClickTimePoint(value);
    }
  }

  refreshTradeList() {
    this.fetchTradeListData();
  }

  validExpireTime(timestamp) {
    //当前服务器时间和当前交易信息的过期时间进行对比，如果过期了，强制更新列表
    let _state = this.state;
    let _tradeList = _state && _state.trade_list || [];
    if (!_tradeList || _tradeList.length <= 0) {
      return;
    }

    let _tradeCode = localStorage.getItem("curr_trade_code");
    let _tradeItem = "";
    let needFresh = false;

    for (var i = 0; i < _tradeList.length; i++) {
      let _tradeItemInfo = _tradeList[i];
      if (!_tradeItemInfo || !_tradeItemInfo.close_buy || _tradeItemInfo.cat == 1 || !_tradeItemInfo.time_points || _tradeItemInfo.time_points.length <= 0) {
        continue;
      }

      let _tradeItemTimepoint = _tradeItemInfo.time_points[0];
      if (!_tradeItemTimepoint || !_tradeItemTimepoint.expire_time) {
        continue;
      }

      let _currTradeExpireTime = parseInt(_tradeItemTimepoint.expire_time) - parseInt(_tradeItemInfo.close_buy);
      if (isNaN(_currTradeExpireTime)) {
        continue;
      }

      if (timestamp > _currTradeExpireTime) {
        needFresh = true;
        break;
      }
    }

    //当前时间过期了，更新trade list
    if (needFresh) {
      sessionStorage.setItem("focus_update_list", 1);
      setTimeout(() => {
        this.refreshTradeList();
      }, 200);
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

  render() {
    return (
      <div className="sliderbar">
        <OptionsTradeNav cateList={this.state.cates} onNavChange={this.listenNavChange.bind(this)}/>
        <OptionsTradeSubNav ref="navTypePanel" onNavTypeChange={this.listenTypeChange.bind(this)}/>
        <OptionsTradeList ref="tradeList" socketObj={this.props.socketObj} onTradeTypeChange={this.onTradeTypeChange.bind(this)} onChangeTimePoint={this.onChangeTimePoint.bind(this)} onItemSelected={this.onItemSelected.bind(this)} tradeList={this.state.trade_list} navIndex={this.navIndex}/>
      </div>
    );
  }
}

OptionsListSlider.propTypes = {
  onTradeTypeChange: React.PropTypes.func,
  socketObj: React.PropTypes.object
}
