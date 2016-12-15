
import React from "react";
import LangClient from '../tools/Lang-Client';

export default class LegalSecurityPrivacy extends React.Component
{
  constructor(props){super(props)}
  render(){
    return (
    <div className="wrap_right_connectUs" style={{"display":"none"}}>
        <div>{LangClient.i18n('legal.LangLegalDisclaimer.title')}</div>
        {
          LangClient.i18n('legal.LangLegalDisclaimer.content', []).map((val,key)=>{
            return (<p key={key}>{val}</p>)
          })
        }
    </div>)
  }
}
