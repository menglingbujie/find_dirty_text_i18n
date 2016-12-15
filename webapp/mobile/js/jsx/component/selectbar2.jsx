import React from "react";
import $ from "jquery";

export default class SelectBar2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: "down",
      current: -1
    };

    this.showDropList = false;
  }

  componentDidMount() {
    var funcEvtKeyDown = (event) => {
      this.evtKeydown(event)
    };
    document.body.addEventListener("click", funcEvtKeyDown, false);

    this.funcClearUp = () => {
      document.body.removeEventListener("click", funcEvtKeyDown, false);
    };
  }

  componentWillUnmount() {
    if (this.funcClearUp) {
      this.funcClearUp();
    }
  }

  evtKeydown(event) {
    if (event.target.className) {
      if (!event.target.className.toString().match(/value_wrap|value|icon arrow/)) {
        if (!$("div.droplist").is(":hidden")) {
          this.hideDropList();
        }
      }
    } else {
      if (!$("div.droplist").is(":hidden")) {
        this.hideDropList();
      }
    }
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

  onClickCurrent() {
    $("div.droplist").toggle();
    this.showDropList = !this.showDropList;
    if (this.showDropList) {
      this.setState({symbol: "up"});
    } else {
      this.setState({symbol: "down"});
    }
  }

  hideDropList() {
    $("div.droplist").hide();
    this.showDropList = false;
    this.setState({symbol: "down"});
  }

  onClickItem(data, index, event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideDropList();
    this.setState({current: index});

    this.props.onSelectPoint(data);
  }

  render() {
    let _props = this.props;

    let currentIdx = this.state.current;
    if (currentIdx == -1) {
      let propIdx = _props.selectIdx;
      if (propIdx >= 0) {
        currentIdx = propIdx;
      } else {
        currentIdx = 0;
      }
    }

    let currentValue = "";
    let currentPoint = _props.timePoints[currentIdx];
    if (currentPoint.expire_time) {
      currentValue = this.formatDate(currentPoint.expire_time);
    } else {
      currentValue = currentPoint.time_point_alias;
    }

    let items = _props.timePoints.map((value, index) => {
      if (value.expire_time) {
        return (
          <li key={index} onClick={this.onClickItem.bind(this, value, index)}>{this.formatDate(value.expire_time)}</li>
        );
      } else {
        return (
          <li key={index} onClick={this.onClickItem.bind(this, value, index)}>{value.time_point_alias}</li>
        );
      }
    });

    let iconCss = "icon arrow " + this.state.symbol;

    return (
      <div className="select_bar">
        <div className="value_wrap" onClick={this.onClickCurrent.bind(this)}>
          <span className="value">{currentValue}</span>
          <i className={iconCss}></i>
        </div>
        <div className="droplist">
          <ul>
            {items}
          </ul>
        </div>
      </div>
    );
  }
}
