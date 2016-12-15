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
  render(){
    return (
      <div className="wrap_right_dany" style={{"display": "none"}}>
          <div>{LangClient.i18n("Prosepcts")}</div>
          <span>{LangClient.i18n("Company Vision")}</span>
         <ul>
             <li>
                 {LangClient.i18n("Eagle's Banc vision: The best Economic providers in world")}
             </li>
             <li>
                 {LangClient.i18n("Eagle's Banc mission: For your long-term and stable profit")}
             </li>
             <li>
                 {LangClient.i18n("Eagle's Banc value: Working on your satisfy and success")}
             </li>
             <li>
                 {LangClient.i18n("Eagle's Banc idea: Professional,honest,win-win")}
             </li>
             <li>
                 {LangClient.i18n("Eagle's Banc purpose: Winners find ways,Losers find reasons")}
             </li>
         </ul>

          <p>
              {LangClient.i18n("March,2013")}
              <br/>
              {LangClient.i18n("Market Research Department in headquarter began to survey the market development of binary options")}
          </p>
          <p> {LangClient.i18n("August,2013<br/>Board meeting about project development")}</p>


          <p>{LangClient.i18n("May,2014")}<br/>{LangClient.i18n("Bring to Europe investor")}</p>


          <p>{LangClient.i18n("June,2014")}<br/>{LangClient.i18n("Get the FSP registration authority in New Zealand")}</p>


          <p>{LangClient.i18n("December,2014")}<br/>{LangClient.i18n("GGBinary entered in Africa")}</p>


          <p>{LangClient.i18n("January,2015")}<br/>{LangClient.i18n("More than 24000 investor trading online")}</p>


          <p>{LangClient.i18n("February,2105")}<br/>{LangClient.i18n("3rd Innovation,advance to China")}</p>


          <p>{LangClient.i18n("March,2015")}<br/>{LangClient.i18n("Set up an 300²agency in Hong Kong")}</p>


          <p>{LangClient.i18n("April,2015")}<br/>{LangClient.i18n("18000 online traders in China everyday")}</p>


          <p>
              {LangClient.i18n("May,2015")}<br/>
              {LangClient.i18n("35.68% of Asian market")}</p>
      </div>
      )
  }
}
