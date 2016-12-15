import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import LangClient from "../tools/Lang-Client";

export default class DialogBaseTip extends React.Component {
  constructor(props) {
    super(props);
  }

  closeDialog() {
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }

  onClickBtn() {
    this.closeDialog();
    if (this.props.onClickBtn) {
      this.props.onClickBtn();
    }
  }

  render() {
    let title = this.props.title;
    let content = this.props.content;
    let btnDesc = this.props.btnDesc;
    let btnCss = "btn " + (this.props.btnCss || "");
    if (!btnDesc) {
      btnCss += " hide";
    }

    return (
      <div className="dialog base_tip">
        <div className="panel">
          <div className="title">
            <span>{title}</span>
            <a className="btn close" onClick={this.closeDialog.bind(this)}>
              <i></i>
            </a>
          </div>
          <div className="content">
            <span>{content}</span>
          </div>
          <div className="btns">
            <a className={btnCss} onClick={this.onClickBtn.bind(this)}>{btnDesc}</a>
          </div>
        </div>
      </div>
    );
  }
}
