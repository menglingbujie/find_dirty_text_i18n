import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.items = [
      {
        id: 1,
        text: LangClient.i18n("Withdraw")
      }, {
        id: 2,
        text: LangClient.i18n("Switch to Demo Account")
      }, {
        id: 4,
        text: LangClient.i18n("Personal center")
      }, {
        id: 3,
        text: LangClient.i18n("Sign Out")
      }
    ];
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      if (!$(".dialog.header_menu").is(":hidden")) {
        this.props.resetSymbol();
        $(".dialog.header_menu").hide();
      }
    }, false)

    document.body.addEventListener("click", (event) => {
      this.evtKeydown(event)
    }, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", (event) => {
      this.evtKeydown(event)
    }, false);
  }

  evtKeydown(event) {
    if (event.target.className) {
      if (!event.target.className.toString().match(/arrow_icon|user_account/)) {
        if (!$(".dialog.header_menu").is(":hidden")) {
          this.props.resetSymbol();
          $(".dialog.header_menu").hide();
        }
      }
    } else {
      if (!$(".dialog.header_menu").is(":hidden")) {
        this.props.resetSymbol();
        $(".dialog.header_menu").hide();
      }
    }
  }

  toggleShow(posInfo) {
    if (posInfo) {
      let left = posInfo.left + posInfo.width - $(".dialog.header_menu").width() + 24;
      let top = posInfo.top + posInfo.height + 2;

      $(".dialog.header_menu").css("left", left + "px");
      $(".dialog.header_menu").css("top", top + "px");
    }

    $(".dialog.header_menu").toggle();
  }

  updatePos(posInfo) {
    if (posInfo) {
      let left = posInfo.left + posInfo.width - $(".dialog.header_menu").width() + 24;
      let top = posInfo.top + posInfo.height + 2;

      $(".dialog.header_menu").css("left", left + "px");
      $(".dialog.header_menu").css("top", top + "px");
    }
  }

  onClickItem(type) {
    this.props.onClickMenu(type);
  }

  render() {
    let itemArr = [];
    this.items.map((value, index) => {
      // if (index == 1) {
      //   return;
      // }
      itemArr.push(value);
    });
    return (
      <div className="dialog header_menu">
        <div className="arrow">
          <i className="icon common arrow_up_menu"></i>
        </div>
        <ul className="menu_list">
          {itemArr.map((value, index) => {
            return (
              <li key={value.id} className="menu_item">
                <a href="#" onClick={this.onClickItem.bind(this, value.id)}>{value.text}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
