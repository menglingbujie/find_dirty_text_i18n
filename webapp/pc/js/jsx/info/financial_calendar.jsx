import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class FinancialCalendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{"display": "none"}}>
        {/* <div style={{"height": "1050px"}}>
          <iframe src="https://widgets-m.fxpro.com/en/statistics/fx-calendar?ref=www.fxpro.co.uk" style={{
            "marginTop": "11px",
            "marginLeft": "11px",
            "height": "1040px",
            "width": "975px",
            "border": "0",
            "scrolling": "no"
          }}>
          </iframe>
          <script src="https://widgets-m.fxpro.com/themes/fxpro/js/fx-calendar-auto-height.js"></script>
        </div> */}
      </div>
    );
  }
}
