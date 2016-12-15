import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class DialogWithTitleMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  evtKeydown(evt){
    if(evt.target.className.match(/dialog/)){
      evt.data.that.doCloseHideDialog();
    }
  }
  componentDidMount() {
    $("#dialogContainerId").on("click",{that:this},this.evtKeydown);
  }

  componentWillUnmount() {
    $("#dialogContainerId").off("click",{that:this},this.evtKeydown);
  }
  doCloseHideDialog(){
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }

  onClickBtn() {
    this.doCloseHideDialog();
    this.props.onClickBtn();
  }

  render() {
    return (
    <div className="dialog msg with_title">
      <div className="panel">
        <h1>{this.props.title}</h1>
        <a href="#" onClick={this.doCloseHideDialog.bind(this)} className="btn icon common close empty"></a>
        <div className="content">{this.props.msg}</div>
        <div className="btn_group"><a href="#" className="btn reg" onClick={this.onClickBtn.bind(this)}>{this.props.btn_text}</a></div>
      </div>
    </div>
    )
  }
}
