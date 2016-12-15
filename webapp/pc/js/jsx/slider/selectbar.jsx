import React from "react";

export default class SelectBar extends React.Component {
  constructor(props) {
    super(props);
  }

  //此事件组织冒泡到tr的click触发
  clickTimePoint(evt) {
    evt.stopPropagation();
  }

  changeTimePoint(evt) {
    evt.stopPropagation();
    let _target = evt.target;
    //存储当前支付类型的时间戳：60秒，120秒等（针对短期期权的）
    // localStorage.setItem("curr_trade_info",_target.value);
    // this.trade_info = _target.value;
    //切换时间相当于点击当前选项
    ////切换时间暂时不做图表重新渲染处理+6
    this.props.onSelectPoint(_target.value);
    // this.props.onTradeTypeChange();
  }

  formatDate(timestamp) {
    let _date = new Date(timestamp * 1000);
    let _h = (_date.getHours() < 10)
      ? "0" + _date.getHours()
      : _date.getHours();
    let _m = (_date.getMinutes() < 10)
      ? "0" + _date.getMinutes()
      : _date.getMinutes();
    return _h + ":" + _m;
  }

  componentWillReceiveProps(nextProps) {
    // console.log("======rec props==")
    // this.refs.timePointSelectId.selectedIndex=0;
    if (nextProps.selectIdx != null) {
      this.refs.timePointSelectId.selectedIndex = nextProps.selectIdx;
    }
  }

  componentDidMount() {
    // console.log("======didi mount==")
    if (this.props.selectIdx != null) {
      this.refs.timePointSelectId.selectedIndex = this.props.selectIdx;
    } else {
      this.refs.timePointSelectId.selectedIndex = 0;
    }
  }

  getSelectedIndex() {
    return this.refs.timePointSelectId.selectedIndex;
  }

  setSelectedIndex(idx) {
    this.refs.timePointSelectId.selectedIndex = idx;
  }

  render() {
    let _props = this.props;
    let _views = _props.timePoints.map((val, index) => {
      if (val.expire_time) {
        return (
          <option key={index} value={JSON.stringify(val)}>{this.formatDate(val.expire_time)}</option>
        );
      } else {
        return (
          <option key={index} value={JSON.stringify(val)}>{val.time_point_alias}</option>
        );
      }
    });

    let _disabled = _props.disabled
      ? true
      : false;
    if (_disabled) {
      return (
        <select ref="timePointSelectId" disabled="disabled" className="times" onClick={this.clickTimePoint.bind(this)} onChange={this.changeTimePoint.bind(this)}>
          {_views}
        </select>
      );
    } else {
      return (
        <select ref="timePointSelectId" className="times" onClick={this.clickTimePoint.bind(this)} onChange={this.changeTimePoint.bind(this)}>
          {_views}
        </select>
      );
    }
  }
}
