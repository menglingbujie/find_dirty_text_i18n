import React from "react";
import $ from "jquery";
import Config from "./config/config";
import LangClient from "./tools/Lang-Client";

import Cookie from "./tools/cookie"

import TableOrder from "./table/table_order";
import TableOrderLogs from "./table/table_order_logs";
import TableAccount from "./table/table_account";
import TableRanking from "./table/table_rank_lists";
import SystemDate from "./table/system_date";

export default class OptionsListLogTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curr_nav: 0,
      trades_count: 0,
      nav_list: [
        LangClient.i18n("Open Positions"), LangClient.i18n("Closed Positions"), LangClient.i18n("Financial Transactions"), LangClient.i18n("Ranking")
      ],
      buy_new: false
    }

    this.timestamp = 0;
    this.socketData = [];
    this.host = Config.host[Config.env];
  }

  showTipRect(trade_info) {
    this.props.doShowTipRect(trade_info);
  }

  notifyNewLog(logData) {
    this.props.notifyNewLog(logData);
  }

  navTradeTable(navIndex, buyNew = false) {
    try {
      ga("send", "event", "table_trade", navIndex);
    } catch (e) {}

    this.setState({curr_nav: navIndex, buy_new: buyNew});
  }

  forceUpdateTable(buyNew = false) {
    this.navTradeTable(0, buyNew);
  }

  doChangeNavTradeTable(navIndex, event) {
    event.preventDefault();
    this.navTradeTable(navIndex);
  }

  componentDidMount() {
    this.updateSpacerWidth();

    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", () => {
        this.updateSpacerWidth();
      });
    } else if (document.attachEvent) {
      document.attachEvent("onload", () => {
        this.updateSpacerWidth();
      }, false);
    }

    window.addEventListener("load", () => {
      this.updateSpacerWidth();
    }, false)

    window.addEventListener("resize", () => {
      this.updateSpacerWidth();
    }, false)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({curr_nav: 0, buy_new: false});
  }

  shouldComponentUpdate(nextProps, nextState) {
    let _token = Cookie.getCookie("token");
    let _isUpdate = (nextState.curr_nav != this.state.curr_nav) || (!_token || _token != this.token);
    return _isUpdate;
  }

  updateDate(data, timestamp) {
    this.timestamp = timestamp;
    this.socketData = data;
    this.refs.system_date.updateDate(timestamp);

    if (this.refs.table_order) {
      this.refs.table_order.update(data, timestamp);
    }
  }

  updateSpacerWidth() {
    if (this.refs.spacer) {
      let totalWidth = this.refs.nav.clientWidth;
      let othersWidth = 0;

      let _state = this.state;
      if (_state.nav_list && _state.nav_list.length > 0) {
        _state.nav_list.map((value, index) => {
          let refId = "" + index;
          let obj = this.refs[refId];
          if (obj) {
            othersWidth += obj.offsetWidth;
          }
        })
      }

      let spacerWidth = totalWidth > othersWidth
        ? (totalWidth - othersWidth - 1)
        : 0;
      $(".nav_spacer").css("width", spacerWidth + "px");
    }
  }

  cancelPositionMode() {
    if (this.refs.table_order) {
      this.refs.table_order.cancelPositionMode();
    }
  }

  getTradeInfoInPos() {
    return this.props.getTradeInfoInPos();
  }

  render() {
    let _props = this.props;
    let _state = this.state;

    let _navListView = [];
    _state.nav_list.map((val, index) => {
      let _isCurrent = "";
      let _name = val;
      if (index == _state.curr_nav) {
        _isCurrent = "current";
        _name = val;
      }

      _navListView.push((
        <a ref={index} href="#" key={index} onClick={this.doChangeNavTradeTable.bind(this, index)} className={_isCurrent}>{_name}</a>
      ));
    })

    _navListView.push((
      <div ref="spacer" key={_state.nav_list.length} className="nav_spacer"></div>
    ));

    let _curr_table_view = "";
    if (_state.curr_nav == 0) {
      let _url = "//" + this.host + Config.api.trade.trade_create_logs;
      _curr_table_view = (<TableOrder ref="table_order" url={_url} buyNew={_state.buy_new} notifyNewLog={this.notifyNewLog.bind(this)} dispatchToUpdateMoney={this.props.dispatchToUpdateMoney} dispatchDataToCharts={this.props.dispatchDataToCharts} showTipRect={this.showTipRect.bind(this)} getTradeInfoInPos={this.getTradeInfoInPos.bind(this)}/>);
    } else if (_state.curr_nav == 1) {
      let _url = "//" + this.host + Config.api.trade.trade_close_logs;
      _curr_table_view = (<TableOrderLogs url={_url}/>);
    } else if (_state.curr_nav == 2) {
      let _url = "//" + this.host + Config.api.trade.trade_get_account_details;
      _curr_table_view = (<TableAccount url={_url} dispatchToUpdateMoney={this.props.dispatchToUpdateMoney} />);
    } else if (_state.curr_nav == 3) {
      let _url = "//" + this.host + Config.api.user.top_list;
      _curr_table_view = (<TableRanking url={_url}/>);
    }

    return (
      <div className="panel logs_table">
        <div className="thead">
          <nav ref="nav">
            {_navListView}</nav>
          <SystemDate ref="system_date"/>
        </div>
        {_curr_table_view}
      </div>
    );
  }
}
