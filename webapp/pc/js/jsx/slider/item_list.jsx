import React from "react";
import $ from "jquery";
import mouseWheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";

import MMap from "../tools/mmap"
import OptionsTradeListItem from "./item_list_item";
import LangClient from '../tools/Lang-Client';

export default class OptionsTradeList extends React.Component {
  constructor(props) {
    super(props);
    this.timestamp = 0; //当前时间戳
    this.socketData = []; //socket数据，因为socket吐数据会有并发多个，所以选择用数组
    this.state = {
      updateData: {
        timestamp: 0,
        data: []
      },
      itemIndex: 0
    }

    this.initialized = false;
    this.priceStateMap = new MMap();
  }

  shouldComponentUpdate(nextProps, nextState) {
    //socket没准备好则不需要render
    //tradeList没准备好则不render
    // console.log(nextState.updateData,"===",this.state.updateData);
    let _focusUpdate = sessionStorage.getItem("focus_update_list");
    if (_focusUpdate && _focusUpdate == 1 || _focusUpdate == "1") {
      sessionStorage.removeItem("focus_update_list");
      return true;
    }

    let _isListDiff = true;
    if (!nextProps.tradeList || nextProps.tradeList.length <= 0 || this.props.tradeList[0] && nextProps.tradeList[0] && nextProps.tradeList[0].time_points[0].expire_time == this.props.tradeList[0].time_points[0].expire_time) {
      _isListDiff = false;
    }
    if ((this.props.tradeList.length != nextProps.tradeList.length) || _isListDiff ||
    // (this.state.updateData.data.length!=nextState.updateData.data.length)||
    this.state.updateData.length > 0 || nextState.updateData.data.length > 0 || this.props.navIndex != nextProps.navIndex || this.state.itemIndex != nextState.itemIndex //item切换需要变更current
    ) {
      return true;
    }
    return false;
  }

  updateCurTradeInfo(tradeList) {
    let _matchCur = false;
    let _index = 0;
    let _tpIndex = 0;

    let _initialized = this.initialized;
    if (!this.initialized) {
      this.initialized = true;
    }

    let _currTradeInfo = localStorage.getItem("curr_trade_info");
    let _currTradeCode = localStorage.getItem("curr_trade_code");
    let _navIndex = sessionStorage.getItem("nav_index");

    let _nextExpireTime = 0;
    let _close_buy = 0;
    let _timePoint = 0;
    if (_currTradeInfo) {
      let _tradeInfo = _currTradeInfo.split(",");
      if (_tradeInfo) {
        _nextExpireTime = parseInt(_tradeInfo[8]) || 0; //当前trade item信息
        _close_buy = parseInt(_tradeInfo[11]) || 0;
        _timePoint = parseInt(_tradeInfo[0]) || 0; //当前trade item信息
      }
    }

    // 遍历列表，找到当前tradecode对应的索引
    // 为变更tradeinfo用
    if (_currTradeInfo && _currTradeCode) {
      tradeList.map((val, idx) => {
        if (val.name == _currTradeCode) {
          _matchCur = true;
          _index = idx;
        }
      });
    }

    // 如果在交易列表中匹配到当前项，直接进入后面的逻辑，根据当前项的交易状态（trade_status）决定是更新，还是移除当前交易信息
    if (_matchCur) {
      let _temp = tradeList[_index];
      if (_temp && _temp.trade_status == 0 && _index > 0) {
        // 如果当前项的状态凑巧是不可交易状态并且不是交易列表第一项，则尝试使用交易列表第一项作为当前项
        _index = 0;
        console.log("The matched trade item is closed state, choose the first item in list as current-item.");
        console.log(_temp.name + " ==> " + tradeList[0].name);
      } else {
        // 匹配上以后看看当前选中时间点是不是还有效，以当前选中时间点优先
        let _timePoints = _temp.time_points;
        for (var i = 0; i < _timePoints.length; i++) {
          let _expTimeNew = _timePoints[i].expire_time || 0;
          let _timePointNew = _timePoints[i].time_point || 0;
          if (_expTimeNew > 0) {
            if (_nextExpireTime == _expTimeNew) {
              _tpIndex = i;
              break;
            }
          } else if (_timePointNew > 0) {
            if (_timePoint == _timePointNew) {
              _tpIndex = i;
              break;
            }
          }
        }

        let idx = this.getTimePointIdx(_currTradeCode);
        if (idx != _tpIndex) {
          this.updateTimePointIdx(_currTradeCode, _tpIndex);
          console.log("Update " + _currTradeCode + "\'s current time-point index: " + _tpIndex);
        }
      }
    } else {
      // 没匹配到的情况下
      if (!_initialized) {
        // 如果是首次加载，取交易列表第一项作为当前项
        _index = 0;
        console.log("No item was matched, choose the first item in list as current-item.");
      } else {
        if (_navIndex != this.props.navIndex) {
          // 如果玩法变了，则直接取交易列表第一项
          _index = 0;
          console.log("Nav index has changed, choose the first item in list as current-item.");
        } else {
          // 如果是加载后再刷新列表，先判断是否存在当前项信息，不存在则取交易列表第一项，
          // 存在则判断当前项中保存的时间信息是否合理（比较当前服务器时间），合理则本次不更新当前项信息，不合理则取交易列表第一项
          if (_currTradeInfo && (_nextExpireTime > 0 || _timePoint > 0)) {
            // _nextExpireTime是买涨买跌玩法中曲线图使用的重要参数，此处需要检查它的有效性，而其他参数的有效性没有可参考对象
            if (_nextExpireTime > 0 && this.timestamp > 0 && (_nextExpireTime - _close_buy) <= this.timestamp) {
              // 过期了
              _index = 0;
              console.log("Current trade info is expired, choose the first item in list as current-item.");
            } else {
              console.log("Current trade info is valid, ignore this update.");
              return;
            }
          } else {
            _index = 0;
            console.log("Current trade info is empty or uncorrect, choose the first item in list as current-item.");
          }
        }
      }
    }

    let tradeInfo = tradeList[_index]; // 当前trade item
    let _firstTimePoint = tradeInfo.time_points[_tpIndex];
    // 0 time_point 停止交易-收益点之间的总时间
    // 1 win_rate 收益率
    // 2 tradename 交易条目名称 如：黄金，欧元/美元
    // 3 tradetype 交易code 如EUR/USD
    // 4 tradeprice 当前交易价格
    // 5 trade_pid 交易时间点的id
    // 6 insid 交易条目的id
    // 7 tradestatus 交易状态
    // 8 expiretime交易过期时间戳
    // 9 time_group_id 时间组id
    // 10 trade_product_id
    //11 close_buy 提前不允许交易时间
    let firstTradePointInfo = _firstTimePoint.time_point + "," + _firstTimePoint.win_rate + "," + tradeInfo.alias + "," + tradeInfo.name + "," + tradeInfo.price + "," + _firstTimePoint.time_point_id + "," + tradeInfo.instrumentid + "," + tradeInfo.trade_status + "," + _firstTimePoint.expire_time + "," + _firstTimePoint.time_group_id + "," + _firstTimePoint.trade_product_id + "," + tradeInfo.close_buy;

    if (tradeInfo.trade_status != 0) {
      // 基本上有最后一个判断条件就够
      if (!_currTradeCode || !_currTradeInfo || _navIndex != this.props.navIndex || firstTradePointInfo != _currTradeInfo) {
        localStorage.setItem("curr_trade_info", firstTradePointInfo);
        localStorage.setItem("curr_trade_code", tradeInfo.name);
      }

      // 设置当前高亮选项
      this.setState({itemIndex: _index});
      this.props.onItemSelected(null);
    } else {
      // 如果当前选中项是不可交易状态，清空curr_trade_info等交易信息，防止图表等模块获取的交易信息不准确导致逻辑混乱
      localStorage.removeItem("curr_trade_info");
      localStorage.removeItem("curr_trade_code");

      this.setState({itemIndex: -1});
    }
  }

  changeTradeType(type) {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.tradeList && nextProps.tradeList.length > 0) {
      this.setState({itemIndex: -1});
      this.updateCurTradeInfo(nextProps.tradeList);
    }
  }

  componentDidMount() {
    mouseWheel($);
    mCustomScrollbar($);
    $(".optionslist").mCustomScrollbar({scrollInertia: 300});

    if (this.props.tradeList && this.props.tradeList.length > 0) {
      this.updateCurTradeInfo(this.props.tradeList);
    }
  }

  getUpdateData() {
    return {timestamp: this.timestamp, data: this.socketData};
  }

  update(data, timestamp) {
    // console.log(data,"=====item list==="+timestamp);
    this.timestamp = timestamp;
    this.socketData = data;
    this.setState({
      updateData: {
        timestamp: timestamp,
        data: data
      }
    });
  }

  onTradeTypeChange(idx) {
    this.props.onTradeTypeChange();
    this.props.onItemSelected(null);
    this.setState({itemIndex: idx});
  }

  changeTimePoint(timePointInfo) {
    this.props.onChangeTimePoint(timePointInfo);
  }

  findPriceState(tradeCode) {
    if (tradeCode && tradeCode.length > 0) {
      if (this.priceStateMap.has(tradeCode)) {
        return this.priceStateMap.get(tradeCode);
      }
    }

    return "";
  }

  cachePriceState(data) {
    if (data) {
      let tradeCode = data.tradecode;
      let priceState = data.pricestate;
      this.priceStateMap.set(tradeCode, priceState);
    }
  }

  onClickTimePoint(value) {
    let tradeCode = localStorage.getItem("curr_trade_code");
    let ref = this.refs[tradeCode];
    if (ref) {
      ref.onClickTimePointNotification(value);
    }
  }

  getTimePointIdx(tradeCode) {
    let ref = this.refs[tradeCode];
    if (ref) {
      return ref.getTimePointIdx();
    }

    return 0;
  }

  updateTimePointIdx(tradeCode, idx) {
    let ref = this.refs[tradeCode];
    if (ref) {
      return ref.updateTimePointIdx(idx);
    }
  }

  render() {
    let _tradeList = this.props.tradeList || [];
    let _tradeListView = (
      <tr>
        <td colSpan="2" className="empty">*{LangClient.i18n("No Data")}</td>
      </tr>
    );
    //数据不为空则渲染列表
    if (_tradeList.length > 0) {
      _tradeListView = _tradeList.map((val, index) => {
        let _currStyle = "";
        // console.log(index+"===="+this.state.itemIndex)
        if (this.state.itemIndex == index) {
          _currStyle = "current";
        }
        if (index == 0) {
          //time_point,win_rate,tradename,trandetype,tradeprice
          //start_time,end_time,trade_pid,insid,time_interval,time_point_id
          //trade_state,expire_time
          if (!val.time_points || val.time_points.length <= 0) {
            console.warn("没有交易时间，系统错误，联系管理员！");
            return;
          }
        }

        return (<OptionsTradeListItem ref={val.name} navIndex={this.props.navIndex} idx={index} currStyle={_currStyle} getUpdateData={this.getUpdateData.bind(this)} onTradeTypeChange={this.onTradeTypeChange.bind(this)} key={index} tradeInfo={val} onChangeTimePoint={this.changeTimePoint.bind(this)} cachePriceState={this.cachePriceState.bind(this)} updateData={this.state.updateData}/>);
      });
    }

    return (
      <div className="slider_table">
        <div className="thead">
          <div className="item">{LangClient.i18n("Asset")}</div>
          <div className="item">{LangClient.i18n("Strike Price")}</div>
          <div className="item">{LangClient.i18n("Expire Time")}</div>
        </div>
        <div className="optionslist" data-mcs-theme="minimal-dark">
          <table>
            {/* <thead>
          <tr>
            <th>交易产品</th>
            <th>现价</th>
          </tr>
        </thead> */}
            <tbody ref="tradelist">
              {_tradeListView}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

OptionsTradeList.propTypes = {
  navIndex: React.PropTypes.number,
  tradeList: React.PropTypes.array,
  onTradeTypeChange: React.PropTypes.func,
  onChangeTimePoint: React.PropTypes.func,
  cachePriceState: React.PropTypes.func,
  socketObj: React.PropTypes.object
}
