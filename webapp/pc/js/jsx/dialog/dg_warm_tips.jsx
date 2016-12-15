import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
export default class DialogWarmTips extends React.Component {
  constructor(props) {
    super(props);
  }
  doCloseHideDialog(){
    $("#containerId").removeClass("gaussianblur");
    $("#dialogContainerId").hide();
    ReactDOM.unmountComponentAtNode(document.getElementById("dialogContainerId"));
  }
  render() {
    return (
      <div className="dialog msg warm_tips">
        <div className="panel">
          <div className="header">
            <a href="#" onClick={this.doCloseHideDialog.bind(this)} className="btn icon common close empty"></a>
            <div className="title">{this.props.title}</div>
          </div>
          <div className="content">{this.props.msg}</div>
        </div>
      </div>
    )
  }
}
