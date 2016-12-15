import React from "react";

export default class Tip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let selfKey = this.props.self_key;
    let tip = this.props.tip;
    let tipId = (tip && tip.id) || "";
    let msg = (tip && tip.msg) || "";

    let css = ((selfKey == tipId) && msg)
      ? "prof_tips"
      : "prof_tips hide";

    return (
      <div className={css}>
        <i></i>
        <div className="content">{msg}</div>
      </div>
    );
  }
}
