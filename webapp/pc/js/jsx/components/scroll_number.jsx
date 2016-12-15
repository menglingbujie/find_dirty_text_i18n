import React from "react";
import $ from "jquery";

export default class ScrollNumber extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      number: "150275934"
    };
  }

  componentDidMount() {
    this.getBidNumberData();
    setInterval(() => {
      this.getBidNumberData();
    }, 5000);
  }

  componentWillReceiveProps(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    let needUpdate = nextState.number.length != this.state.number.length
      ? true
      : false;
    if (!needUpdate && nextState.number != this.state.number) {
      //this.doAnimation();
    }

    return needUpdate;
  }

  componentDidUpdate() {
    //this.doAnimation();
  }

  getBidNumberData() {
    let newNumber = parseInt(this.state.number) + parseInt(Math.random() * 100);
    // this.setState({
    //   number: "" + newNumber
    // });
    this.showNumber(newNumber, "#BIDNUMBER");
    // $.post('http://www.taotaole.tw/welcome/bidCount', '', (data) => {
    //   this.setState({number: data.count});
    // });
  }

  doAnimation() {
    let len = this.state.number.length;
    for (var i = 0; i < len; i++) {
      var num = String(this.state.number).charAt(i);
      var y = -parseInt(num) * 29;
      var obj = $("#BIDNUMBER i").eq(i).find('em');
      if (obj) {
        obj.animate({
          backgroundPositionY: String(y) + 'px'
        }, 2000, 'swing');
      }
    }
  }

  showNumber(number, selector) {
    //console.log("number: " + number);
    let itemSel = selector + " i";
    var it = $(itemSel);

    var len = String(number).length;
    if (it == null || it.length != len) {
      $(selector).empty();

      let flen = Math.ceil(len / 3) - 1;
      let fmod = parseInt(len % 3);
      let fIdxArr = [];
      if (flen > 0) {
        if (fmod > 0) {
          for (var i = 0; i < flen; i++) {
            fIdxArr.push(fmod + i * 3 - 1);
          }
        } else {
          for (var i = 0; i < flen; i++) {
            fIdxArr.push(3 + i * 3 - 1);
          }
        }
      }

      for (var i = 0; i < len; i++) {
        $(selector).append("<i><em></em></i>");
        if (fIdxArr.indexOf(i) != -1) {
          $(selector).append("<font>,</font>");
        }
      }
    }

    for (var i = 0; i < len; i++) {
      var char = String(number).charAt(i);
      var y = -parseInt(char) * 29;
      var obj = $(itemSel).eq(i).find('em');
      obj.animate({
        backgroundPositionY: String(y) + 'px'
      }, 2000, 'swing');
    }
  }

  render() {
    // let len = String(this.state.number).length;
    // let flen = Math.floor(len / 3);
    // let fIdxArr = [];
    // for (var i = 1; i <= flen; i++) {
    //   fIdxArr = (len - 1) - i * 3;
    // }
    // if (fIdxArr.length > 0) {
    //   fIdxArr.reverse();
    // }
    //
    // let numberViews = [];
    // for (var i = 0; i < len; i++) {
    //   numberViews.push((
    //     <i>
    //       <em></em>
    //     </i>
    //   ));
    //
    //   if (fIdxArr.indexOf(i) != -1) {
    //     numberViews.push((
    //       <font>,</font>
    //     ));
    //   }
    // }

    return (
      <a className="buyers">
        <label>累計參與</label>
        <span id="BIDNUMBER">
          {/* {numberViews} */}
        </span>
        <label className="rc">人次</label>
      </a>
    );
  }
}
