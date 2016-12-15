import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class ContanctUs extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  createMarkup(text){
    let _text = LangClient.i18n(text);
    return {__html: _text};
  }
  render(){
    return (
        <div className="wrap_right_connectUs" style={{"display":"none"}}>
            <div>{LangClient.i18n("Contact Us")}</div>
            <p>{LangClient.i18n("Business enterprise and its related businesses are regulated under the supervision of Vanuatu Financial Services Commission (VFSC).")}</p>
            <p dangerouslySetInnerHTML={this.createMarkup("Finance Managers Co. Limited, Govant Building 1st Floor, PO Box 1276, Port Vila, Vanuatu, Incorporation and License Number: 14745")}></p>
            <p></p><br/>
            <p>{LangClient.i18n("Email： info@ultrabanc.com")}</p>
            <p>{LangClient.i18n("Tel：(+852) 53482546")}</p>
        </div>
      )
  }
}
