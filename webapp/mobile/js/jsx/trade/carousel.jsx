import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from "../tools/Lang-Client";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      timestramp: ""
    }

    this.updateFetchTimer = null;
    this.triggerScrollUpdateTimer = null;
    this.scrollUpdatetTimer = null;
  }

  scrollUpdate() {
    if (this.scrollUpdatetTimer) {
      clearInterval(this.scrollUpdatetTimer);
    }

    let lb_innerwidth1 = $("#lb_inner1").width();
    let lb_innerwidth2 = $("#lb_inner2").width();
    let $lb_inner1 = $('#lb_inner1');
    let $lb_inner2 = $('#lb_inner2');
    let lb_inner1 = document.getElementById('lb_inner1');
    let lb_inner2 = document.getElementById('lb_inner2');

    $lb_inner1.css({
      left: 0 + 'px'
    });
    $lb_inner2.css({
      left: lb_innerwidth1 + 'px',
      "display": "flex"
    });

    let i = 0;
    let _this = this;

    function start() {
      clearInterval(_this.scrollUpdatetTimer);
      _this.scrollUpdatetTimer = setInterval(() => {
        if (parseInt(lb_inner1.style.left) <= -lb_innerwidth1) {
          lb_inner1.style.left = lb_innerwidth2 + 'px';
        }

        if (parseInt(lb_inner2.style.left) <= -lb_innerwidth2) {
          lb_inner2.style.left = lb_innerwidth1 + 'px';
        }

        lb_inner1.style.left = parseInt(lb_inner1.style.left) - 1 + 'px';
        lb_inner2.style.left = parseInt(lb_inner2.style.left) - 1 + 'px';
      }, 30)
    }

    start();

    $("#lb_container").mouseover(() => {
      clearInterval(_this.scrollUpdatetTimer);
    })

    $("#lb_container").mouseout(() => {
      start();
    })
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  fetchScrollList() {
    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.get_last_trades;
    let _postData = {
      num: 50
    }

    $.get(_url, _postData, (resp) => {
      if (!resp || !resp.status) {
        this.showToast(resp.msg);
        return;
      }

      this.setState({list: resp.data, timestramp: resp.timestramp})

      if (this.triggerScrollUpdateTimer) {
        clearTimeout(this.triggerScrollUpdateTimer);
      }

      this.triggerScrollUpdateTimer = setTimeout(() => {
        this.scrollUpdate();
      }, 500);

      if (this.updateFetchTimer) {
        clearTimeout(this.updateFetchTimer);
      }

      this.updateFetchTimer = setTimeout(() => {
        this.fetchScrollList();
      }, 6e5)
    })
  }

  componentDidMount() {
    this.fetchScrollList();

    this.reallyStartTimer = setInterval(() => {
      if (parseInt($('#lb_inner1').css("left")) < -1) {
        clearInterval(this.reallyStartTimer);
      } else {
        if (this.triggerScrollUpdateTimer) {
          clearTimeout(this.triggerScrollUpdateTimer);
        }

        if (this.updateFetchTimer) {
          clearTimeout(this.updateFetchTimer);
        }

        this.fetchScrollList();
      }
    }, 2000)
  }
  componentWillUnmount() {
    if (this.triggerScrollUpdateTimer) {
      clearTimeout(this.triggerScrollUpdateTimer);
    }

    if (this.updateFetchTimer) {
      clearTimeout(this.updateFetchTimer);
    }
  }

  render() {
    let _timestramp = this.state.timestramp;
    let _list = this.state.list;

    let _spanArr = [];
    if (_list && _list.length > 0) {
      _list.map((val, index) => {
        let _time = "";
        let _timeCross = Math.abs(_timestramp - val.opentime);
        let _seconds = _timeCross;
        let _day = parseInt(_seconds / 86400);
        let _hour = parseInt(_seconds % 86400 / 3600);
        let _min = parseInt(_seconds % 3600 / 60);
        let _sec = Math.ceil(_seconds % 60);
        if (_sec == 60) {
          _sec--;
        }

        let timeCnt = 0;
        let timeUnit = "";
        if (_day > 0) {
          timeCnt = _day;
          timeUnit = LangClient.i18n("Day");
          if (_day > 1) {
            timeUnit = LangClient.i18n("Days");
          }
        } else if (_hour > 0) {
          timeCnt = _hour;
          timeUnit = LangClient.i18n("Hour");
          if (_hour > 1) {
            timeUnit = LangClient.i18n("Hours");
          }
        } else if (_min > 0) {
          timeCnt = _min;
          timeUnit = LangClient.i18n("Minute");
          if (_min > 1) {
            timeUnit = LangClient.i18n("Minutes");
          }
        } else {
          timeCnt = _sec;
          timeUnit = LangClient.i18n("Second");
          if (_sec > 1) {
            timeUnit = LangClient.i18n("Seconds");
          }
        }

        let content = LangClient.i18n("{time_cnt} {time_unit} ago {span_l}{user}{span_r} opened a {type} position on {span_l}{item}{span_r} at {price} price investing {amount}");
        content = content.replace("{time_cnt}", timeCnt);
        content = content.replace("{time_unit}", timeUnit);
        content = content.replace("{user}", val.first_name + ' ' + val.last_name);
        content = content.replace("{type}", LangClient.i18n(val.direction));
        content = content.replace("{item}", LangClient.i18n(val.instrument));
        content = content.replace("{price}", val.openprice);
        content = content.replace("{amount}", "$" + val.amount);
        if (val.profit > 0) {
          content += LangClient.i18n(" and {span_l}earned {profit}{span_r}");
          content = content.replace("{profit}", "$" + val.profit);
        }
        content = content.replace(/{span_l}/g, "<span class=\"goldColor\">");
        content = content.replace(/{span_r}/g, "</span>");
        content = (content);

        let _span = (
          <span key={index} dangerouslySetInnerHTML={{__html: content}}></span>
        );
        _spanArr.push(_span);
      })
    }

    return (
      <div id="lb_container">
        <div id="lb_inner1">{_spanArr}</div>
        <div id="lb_inner2">{_spanArr}</div>
      </div>
    );
  }
}
