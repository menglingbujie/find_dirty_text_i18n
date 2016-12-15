import React from "react";
import $ from "jquery";
import Config from "../config/config";

export default class SystemDate extends React.Component {
    constructor(props) {
        super(props);
        let _date = new Date();
        this.state = {
          time : this.formatTime(_date) ,
          date: this.formatDate(_date),
        };
        this.timestamp=0;
        this.timer = null;
    }
    formatDate(_date){
      let _year = _date.getFullYear();
      let _month = _date.getMonth()+1;
      let _day = _date.getDate();
      //let _s = timestamp % 60;
      let _rm = (_month < 10) ? ("0" + _month) : _month;
      let _rd = (_day < 10) ? ("0" + _day) : _day;
      return _rm + "/" + _rd+"/"+_year;
    }
    formatTime(_date){
      // console.log(_date);
      let _hour = _date.getHours();
      let _min = _date.getMinutes();
      let _sec = _date.getSeconds();
      //let _s = timestamp % 60;
      let _rh = (_hour < 10) ? ("0" + _hour) : _hour;
      let _rm = (_min < 10) ? ("0" + _min) : _min;
      let _rs = (_sec < 10) ? ("0" + _sec) : _sec;
      return _rh+":"+_rm + ":" + _rs;
    }
    updateDate(timestamp){
      let _date = new Date(timestamp*1000);
      this.setState({
        //time: _date.toLocaleTimeString(),
        // date: _date.toLocaleDateString(),
        time : this.formatTime(_date) ,
        date:this.formatDate(_date),
      });
    }
    render() {
        return (
            <time>
                <span className="time">{this.state.time}</span>
                <span className="date">{this.state.date}</span>
            </time>
        )
    }
}
