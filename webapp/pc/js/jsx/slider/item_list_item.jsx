import React from "react";
import $ from "jquery";
import CountDown from "../table/count_down";
import SelectBar from "./selectbar";
import LangClient from '../tools/Lang-Client';


export default class OptionsTradeListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: 0,
      socketData: [],
      timePoint: {}
    }

    this.session = {
      old_price: 0,
      old_price_state: ""
    };

    this.trade_code = "";
    this.trade_info = "";
    this.tradePrice = 0;
    this.nextPointTime = 0; //下一个交易时间到期时间
    this.timePointId = 0; //下一个交易时间点的point id
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.updateData);
    this.trade_info = "";
    //需要存储第一个时间点
    // let _firstTimePoint = nextProps.tradeInfo.time_points[0];
    // if(_firstTimePoint){
    //   //expire_time只有看涨看跌有，短期期权没有expire_time所以取时间段
    //   localStorage.setItem("next_time_point",_firstTimePoint.expire_time||_firstTimePoint.time_point);
    // }
  }

  componentDidMount() {
    //需要存储第一个时间点
    // let _firstTimePoint = this.props.tradeInfo.time_points[0];
    // if(_firstTimePoint){
    //   //expire_time只有看涨看跌有，短期期权没有expire_time所以取时间段
    //   localStorage.setItem("next_time_point",_firstTimePoint.expire_time||_firstTimePoint.time_point);
    // }
  }

  componentWillUnmount() {
    this.session = {
      old_price: 0,
      old_price_state: ""
    };
    this.trade_code = "";
    this.trade_info = "";
    this.tradePrice = 0;
    this.nextPointTime = 0;
    this.timePointId = 0;
    // console.log("===item component will unmount===");
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

  showTradeItemInfo(trade_code, trade_info, is_enable, event) {
    if (event) {
      event.persist();
    }

    //如果是灰色的不允许点击
    if (is_enable) {
      let _tpIdx = this.getTimePointIdx();
      if (_tpIdx > 0) {
        // selectbar里的timepoint选中的不是第一个，因此传进来的trade_info是不能用的（trade_info默认使用第一个timepoint生成），
        // 重新生成trade_info，并保存
        let _timePoint = this.props.tradeInfo.time_points[_tpIdx];
        if (_timePoint) {
          trade_info = this.trade_info = this.getTradeInfo(_timePoint, this.props.tradeInfo);
        }
      }

      //选择交易条目时记录当前的tradeinfo，并向上通知有条目变更（主要是图表）
      //存储当前支付类型：黄金，白银，澳元/美元等
      localStorage.setItem("curr_trade_code", trade_code);
      localStorage.setItem("curr_trade_info", trade_info);
      this.trade_info = trade_info;
      this.trade_code = trade_code;

      //条目变更时需要提醒charts
      this.props.onTradeTypeChange(this.props.idx);
    }
  }

  onClickTimePointNotification(value) {
    let index = 0;
    let timePoints = this.props.tradeInfo.time_points;
    if (timePoints && timePoints.length > 0) {
      let _timePointObj = JSON.parse(value);
      for (var i = 0; i < timePoints.length; i++) {
        if (timePoints[i].time_group_id == _timePointObj.time_group_id && timePoints[i].time_point_id == _timePointObj.time_point_id) {
          index = i;
          break;
        }
      }
    }

    this.refs.selectBar.refs.timePointSelectId.selectedIndex = index;

    this.clickTimePoint(value);
  }

  clickTimePoint(timeval) {
    let _timePointObj = JSON.parse(timeval);
    let _tradeInfo = this.getTradeInfo(_timePointObj, this.props.tradeInfo);
    localStorage.setItem("curr_trade_info", _tradeInfo);
    //改变point time需要校对当前时间，因为父元素不会实时更新time到这里
    this.setState({timePoint: _timePointObj, timestamp: this.props.getUpdateData().timestamp});

    let _curTradeCode = localStorage.getItem("curr_trade_code");
    let _thisTradeCode = this.props.tradeInfo.name;
    if (_curTradeCode == _thisTradeCode) {
      //存储后通知charts
      this.props.onChangeTimePoint({"nav_index": this.props.navIndex, "trade_code": this.trade_code, "time_point": _timePointObj.expire_time, type: 2, type_name: "change time point"});
    } else {
      this.showTradeItemInfo(_thisTradeCode, _tradeInfo, true, null);
    }
  }

  callTimeIsUp() {
    //被动调用，有条目的交易时间到了，需要通知父级列表重新刷新
    // console.log("===time -s up===");
    this.props.onChangeTimePoint({
      "nav_index": this.props.navIndex,
      "trade_code": this.trade_code,
      "time_point": this.nextPointTime,
      "time_point_id": this.timePointId,
      "close_buy": this.props.tradeInfo.close_buy,
      type: 1,
      type_name: "time is up"
    });
  }

  checkSocketDataIsChanged(a1, a2) {
    if (a1.length != a2.length) {
      return true;
    }
    let isChanged = false;
    for (let i = 0; i < a1.length; i++) {
      if (a1[i] != a2[i]) {
        isChanged = true;
        break;
      }
    }
    return isChanged;
  }

  getTradeInfo(timePoint, tradeInfo) {
    let _tradeInfo = timePoint.time_point + "," + timePoint.win_rate + "," + tradeInfo.alias + "," + tradeInfo.name + "," + this.tradePrice + "," + timePoint.time_point_id + "," + tradeInfo.instrumentid + "," + tradeInfo.trade_status + "," + timePoint.expire_time + "," + timePoint.time_group_id + "," + timePoint.trade_product_id + "," + tradeInfo.close_buy;
    return _tradeInfo;
  }

  cachePriceState() {
    this.props.cachePriceState({tradecode: this.trade_code, pricestate: this.session.old_price_state});
  }

  updateWaitingState(isWait) {}

  //短期期权视图
  shortOptionView() {

    //短期期权的timePoint没有到期的判断
    //设定好60s，120s那么买的时候直接根据当前购买时间倒计时
    //切换时间段也不会对右侧图表的显示有影响，图表一直根据当前走势而画图
    //标记也一直画在最近一期的交易开始时间
    //通过持仓记录的倒计时来查看短期期权的到期收益时间

    let _state = this.state;
    let _props = this.props;
    let _socketData = _props.updateData.data;
    let _tradeInfo = this.props.tradeInfo;
    let _rate = "";
    let _price = this.session.old_price || _tradeInfo.price; //获取之前的价格，如果没有则用初始化时的price
    let _priceState = this.session.old_price_state; //获取之前的价格状态，如果没有则用白色显示（有则是红绿交替）
    //这里是从socket来的数据，只需要把socket的数据匹配到相应的trade item上更新即可
    //需要变更的字段：price
    if (_socketData && _socketData.length > 0) {
      _socketData.map((val, index) => {
        let _str = val.split(",");
        let _tradeCode = _str[0]; //trade code
        if (_tradeCode == _tradeInfo.name) { //只更新指定tradecode的数据
          _price = _str[2]; //price in
          this.tradePrice = _price;
          // console.log(_tradeCode+"="+_tradeInfo.name+"=="+_price+"=="+_tradeInfo.price+"=="+this.session.old_price);
          let _crossPrice = _price - this.session.old_price;
          // console.log(_tradeCode+"=="+_price+"-"+this.session.old_price+"===cross==="+_crossPrice);
          if (_crossPrice > 0) {
            _priceState = "up";
          } else if (_crossPrice < 0) {
            _priceState = "down";
          }
          //记录变更的价格和价格状态
          this.session.old_price = _price;
          this.session.old_price_state = _priceState;
          this.cachePriceState();
        }
      });
    }
    //初始化时间点
    let _timePoints = _tradeInfo.time_points;
    let _pointViews = [];
    let _currTimePoint = _state.timePoint;
    _timePoints && _timePoints.map((val, index) => {
      //0 time_point 停止交易-收益点之间的总时间
      //1 win_rate 收益率
      //2 tradename 交易条目名称 如：黄金，欧元/美元
      //3 tradetype 交易code 如EUR/USD
      //4 tradeprice 当前交易价格
      //5 trade_pid 交易时间点的id
      //6 insid 交易条目的id
      //7 tradestatus 交易状态
      //8 expiretime交易过期时间戳
      let _firstTradePointData = this.getTradeInfo(val, _tradeInfo);

      //默认从第一个秒数的比率开始
      if (index == 0) {
        if (!_currTimePoint.expire_time) {
          _currTimePoint = val; //其实是初始化第一个时间点，当收到新props时，短期期权貌似不需要这个对象
        }

        _rate = val.win_rate; //每个时间点的rate不一样，所以需要这里选择时间点时记录并更新rate
        this.trade_info = _firstTradePointData; //第一个时间点数据
      }
      //下一个交易时间到期的时间点
      if (index == 1) {
        this.nextPointTime = val.time_point;
        this.timePointId = val.time_point_id;
      }
      //短期期权选中秒的select后value的数据如下：下次结算时间点，当前交易率，当前交易类型名，当前交易类型，当前交易价格
      _pointViews.push((
        <option key={index} value={this.trade_info}>{val.time_point_alias}</option>
      ));
    })

    let _isTradeEnable = true;
    let _isEnable = true;
    let _fuckwaitOpen = "";
    let _infoView = "",
      _normalTdColPan = 1,
      _hideTdCss = {};
    let _startTime = _tradeInfo.start_time;
    let _timestamp = (_props.updateData.timestamp >= _state.timestamp)
      ? _props.updateData.timestamp
      : _state.timestamp;
    // console.log(_state.timestamp+"==="+_startTime+"--=";
    //0为不可交易
    this.trade_code = _tradeInfo.name;
    if (_tradeInfo.trade_status == 0) {
      let _openTradeCross = _startTime - _timestamp;
      // console.log(_openTradeCross);
      //如果该条目的start_time到了timestamp，那么需要刷新列表
      //不可交易的条目这里判断与当前时间的差值（秒），如果差值为0，那么意思是到期了，需要重新请求接口
      if (_openTradeCross <= 0) {
        setTimeout(() => {
          // callTimeIsUp方法会出发其他组件的setState逻辑，react不允许render过程中有setState这种逻辑，所以用一个timeout来执行试试 --- limeng
          this.callTimeIsUp();
        }, 500);
      }
      _infoView = (
        <span className="next_time">{LangClient.i18n("Trade time")}：{this.formatDate(_tradeInfo.start_time)}</span>
      );
      _price = "";
      _hideTdCss = {
        display: "none"
      };
      _normalTdColPan = 3;
      _fuckwaitOpen = "gray";
      _isEnable = false;
    } else {
      _infoView = (
        <span className="rate">{_rate}%</span>
      );
    }
    return (
      <tr className={this.props.currStyle + " " + _priceState + " " + _fuckwaitOpen} onClick={this.showTradeItemInfo.bind(this, _tradeInfo.name, this.trade_info, _isEnable)}>
        <td colSpan={_normalTdColPan}>
          <span>{LangClient.i18n(_tradeInfo.name)}</span>{_infoView}</td>
        <td style={_hideTdCss} className="price">
          <span className="price">{_price}</span><SelectBar ref="selectBar" timePoints={_timePoints} onSelectPoint={this.clickTimePoint.bind(this)}/></td>
      </tr>
    );
  }

  //买涨买跌视图
  risingFallingView() {
    //看涨看跌的timePoint会根据一定时间更新
    //这里就需要设定更新的时间间隔，如：10分钟玩儿一次，前5分钟停止交易，后5分钟结算收益
    //切换时间段会对右侧图表的显示有影响，停止交易时间线一定，后面收益的截止时间会根据选择的timePoint而变化
    //通过持仓记录的倒计时来查看看涨看跌的到期收益时间（这也和设定的玩儿法有关，如果10分钟，那么5分钟做倒计时，如果20分钟，10分钟做收益倒计时
    //总是玩儿法的时间间隔怎么设定，都会 除2，前一半是截止购买时间段，后一段是计算收益截止时间段。平分这时间间隔的玩儿法
    let _state = this.state;
    let _props = this.props;
    let _socketData = _props.updateData.data;
    let _tradeInfo = this.props.tradeInfo;
    let _rate = "";
    let _price = this.session.old_price || _tradeInfo.price;
    let _priceState = this.session.old_price_state;
    //这里是从socket来的数据，只需要把socket的数据匹配到相应的trade item上更新即可
    //需要变更的字段：price
    if (_socketData && _socketData.length > 0) {
      _socketData.map((val, index) => {
        let _str = val.split(",");
        let _tradeCode = _str[0]; //trade code
        if (_tradeCode == _tradeInfo.name) { //只更新指定tradecode的数据
          _price = _str[2]; //price in
          this.tradePrice = _price;
          // console.log(_tradeCode+"="+_tradeInfo.name+"=="+_price+"=="+_tradeInfo.price+"=="+this.session.old_price);
          let _crossPrice = _price - this.session.old_price;
          // console.log(_tradeCode+"=="+_price+"-"+this.session.old_price+"===cross==="+_crossPrice);
          if (_crossPrice > 0) {
            _priceState = "up";
          } else if (_crossPrice < 0) {
            _priceState = "down";
          }
          //记录变更的价格和价格状态
          this.session.old_price = _price;
          this.session.old_price_state = _priceState;
          this.cachePriceState();
        }
      });
    }

    let _timePoints = _tradeInfo.time_points;
    let _pointViews = [];
    let _infoView = "",
      _normalTdColPan = 1,
      _hideTdCss = {};
    let _currTimePoint = _state.timePoint;
    _timePoints && _timePoints.map((val, index) => {
      //time_point,win_rate,tradename,trandetype,tradeprice
      //start_time,end_time,trade_pid,insid,time_interval,time_point_id
      //trade_state,expire_time
      let _selectValue = this.getTradeInfo(val, _tradeInfo);

      // let _selectValue=val.time_point+","+val.win_rate+","+_tradeInfo.alias+","+_tradeInfo.name+","+_price+","+_tradeInfo.start_time+","+_tradeInfo.end_time+","+val.trade_product_id+","+_tradeInfo.instrumentid+","+val.interval+val.time_point_id+","+_tradeInfo.trade_status+","+val.expire_time;

      // console.log(_selectValue);
      //默认从第一个秒数的比率开始
      if (index == 0) {
        if (!_currTimePoint.expire_time) {
          _currTimePoint = val; //初始化当前时间点为第一个
        }
        _rate = val.win_rate;
        this.trade_info = _selectValue;
      }
      //下一个交易时间到期的时间点
      if (index == 1) {
        this.nextPointTime = val.expire_time; //下一个时间点的收益到期时间
        this.timePointId = val.time_point_id;
      }
      //短期期权选中秒的select后value的数据如下：下次结算时间点，当前交易率，当前交易类型名，当前交易类型，当前交易价格
      _pointViews.push((
        <option key={index} value={_selectValue}>{val.time_point_alias}</option>
      ));
    })

    let _isTradeEnable = true;
    let _fuckwaitOpen = "";
    let _isEnable = true;
    let _startTime = _tradeInfo.start_time;
    let _timestamp = (_props.updateData.timestamp >= _state.timestamp)
      ? _props.updateData.timestamp
      : _state.timestamp;
    if (_tradeInfo.trade_status == 0) {
      let _openTradeCross = _startTime - _timestamp;
      // console.log(_openTradeCross);
      //如果该条目的start_time到了timestamp，那么需要刷新列表
      //不可交易的条目这里判断与当前时间的差值（秒），如果差值为0，那么意思是到期了，需要重新请求接口
      if (_openTradeCross <= 0) {
        setTimeout(() => {
          // callTimeIsUp方法会出发其他组件的setState逻辑，react不允许render过程中有setState这种逻辑，所以用一个timeout来执行试试 --- limeng
          this.callTimeIsUp();
        }, 500);
      }
      _isTradeEnable = false;
      _infoView = (
        <span className="next_time">{LangClient.i18n("Trade time")}：{this.formatDate(_tradeInfo.start_time)}</span>
      );
      _price = "";
      _hideTdCss = {
        display: "none"
      };
      _normalTdColPan = 3;
      _fuckwaitOpen = "gray";
      _isEnable = false;
      //此处通知form开始倒计时
    } else {
      _infoView = (
        <span className="rate">{_rate}%</span>
      );
    }
    this.trade_code = _tradeInfo.name;
    //交易截止时间与当前时间做对比
    //-300是因为expire_time是收益时间，目前开发定收益前5分钟不允许该时间点交易
    //故-300
    let _closeBuy = parseInt(_tradeInfo.close_buy);
    let _currExpireTime = _currTimePoint.expire_time - _closeBuy; //交易时间更新点
    let _crossTime = _currExpireTime - _timestamp; //当前时间距离时间更新点的描述
    let _countDownView = "";

    if (_isTradeEnable && _crossTime > 0 && _crossTime <= 300) { //时间更新点的前5分钟开始倒计时
      _countDownView = (<CountDown endtime={_currExpireTime} timestamp={_crossTime} callTimeIsUp={this.callTimeIsUp.bind(this)} updateWaitingState={this.updateWaitingState.bind(this)}/>);
      // _countDownView = (<CountDown expiretime={_currExpireTime} currenttime={_timestamp} callTimeIsUp={this.callTimeIsUp.bind(this)} />);
    }
    return (
      <tr className={this.props.currStyle + " " + _priceState + " " + _fuckwaitOpen} onClick={this.showTradeItemInfo.bind(this, _tradeInfo.name, this.trade_info, _isEnable)}>
        <td colSpan={_normalTdColPan}>
          <span>{LangClient.i18n(_tradeInfo.name)}</span>{_infoView}</td>
        <td style={_hideTdCss} className="price">
          <span className="price">{_price}</span><SelectBar ref="selectBar" timePoints={_timePoints} onSelectPoint={this.clickTimePoint.bind(this)}/></td>
        <td className="countdown" style={_hideTdCss}>{_countDownView}</td>
      </tr>
    );
  }

  getTimePointIdx() {
    return this.refs.selectBar.getSelectedIndex();
  }

  updateTimePointIdx(idx) {
    this.refs.selectBar.setSelectedIndex(idx);
  }

  render() {
    //根据nav index选择显示相应的视图
    // console.log("=list item===render===");
    const TRADE_TYPE_OPTIONS = 1;
    const TRADE_TYPE_RISEDOWN = 2;
    if (!this.props) {
      return;
    }
    let _view = "";
    if (this.props.navIndex == TRADE_TYPE_OPTIONS) {
      _view = this.shortOptionView();
    } else if (this.props.navIndex == TRADE_TYPE_RISEDOWN) {
      _view = this.risingFallingView();
    }

    return (_view)
  }
}

//props类型判断
OptionsTradeListItem.propTypes = {
  onTradeTypeChange: React.PropTypes.func,
  getUpdateData: React.PropTypes.func,
  onChangeTimePoint: React.PropTypes.func,
  tradeInfo: React.PropTypes.object,
  updateData: React.PropTypes.object,
  getDate: React.PropTypes.func,
  navIndex: React.PropTypes.number
}
