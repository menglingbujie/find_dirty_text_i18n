import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";
//信息列表
export default class Infolist extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
      <div className="wrap_right_Analysts" style={{"display": "none"}}>
          <div className="wrap_right_Analysts_title">{LangClient.i18n("Analysts")}</div>
          <div className="wrap_right_Analysts_content">
              <div className="wrap_right_Analysts_image icon info user u1"></div>
              <div className="wrap_right_Analysts_contentSS">
                  <div className="wrap_right_Analysts_name">{LangClient.i18n("A•RK - The Senior Consultant")}</div>
                  <div className="wrap_right_Analysts_desc">{LangClient.i18n("A•RK was born in New York in 1975, and worked on Wall Street for 20 years. Currently, he is a senior consultant of ultrabanc, who has 16-year practical trading experience, and systematically makes   researches on fundamentals, techniques, and risk control of financial investment. He is especially good at Forex, Precious Metals Exchange, and has rich experience in binary options trading, helping countless people achieve the dream of wealth!")}
                  </div>
              </div>
          </div>
          <div className="wrap_right_Analysts_content">
              <div className="wrap_right_Analysts_image icon info user u2"></div>
              <div className="wrap_right_Analysts_contentSS">
                  <div className="wrap_right_Analysts_name">{LangClient.i18n("Mr. Jiang - Gold Analyst")}</div>
                  <div className="wrap_right_Analysts_desc">{LangClient.i18n("In 2008, Gordon•Jiang was majored in Finance and Investment in Japan. Since 2008, he engaged in analystjob for gold, silver, forex investment until now, with more than seven – year related experience. Currently, he work for ultrabanc as a senior analyst. He is focused on the practical financial transactions, and achieves the unity of knowledge and action.")}
                  </div>
              </div>
          </div>
          <div className="wrap_right_Analysts_content">
              <div className="wrap_right_Analysts_image icon info user u3"></div>
              <div className="wrap_right_Analysts_contentSS">
                  <div className="wrap_right_Analysts_name">{LangClient.i18n("Devin•LI - Gold Analyst")}</div>
                  <div className="wrap_right_Analysts_desc">{LangClient.i18n("Devin•LI has 15 - year practical experience in finance. He has unique perspectives on gold and silver,foreign exchange transactions. With rich theoretical knowledge and practical experience in analyzing customer trading mentality and habits, he is committed to leading customers to stable profits starting from the very beginning, on the basics of the trading rules, team supervision, executed efficiency, controlled risk management, and continuous, stable profits.")}
                  </div>
              </div>
          </div>
          <div className="wrap_right_Analysts_content">
              <div className="wrap_right_Analysts_image icon info user u4"></div>
              <div className="wrap_right_Analysts_contentSS">
                  <div className="wrap_right_Analysts_name">{LangClient.i18n("Ms. Huang - Senior Analyst")}</div>
                  <div className="wrap_right_Analysts_desc">{LangClient.i18n("Beache•HUANG, the state registered gold analyst and senior precious metals trader, has 10-year experience in finance research. She once worked as a trader and trained many traders for several institutions. She was engaged in training, analyzing, guiding work for forex exchange, gold, etc. She once worked at a famous Financial Group in Hong Kong, and has 6-year practical experience in Gold, Stocks, and Commodities, etc.")}
                  </div>
              </div>
          </div>
          <div className="wrap_right_Analysts_content">
              <div className="wrap_right_Analysts_image icon info user u5"></div>
              <div className="wrap_right_Analysts_contentSS">
                  <div className="wrap_right_Analysts_name">{LangClient.i18n("Chad•QIN - Junior Analyst")}</div>
                  <div className="wrap_right_Analysts_desc">{LangClient.i18n("Chad•QIN has been committed to researches on investment products for many years, such as Gold and Silver, Futures, etc. He has rich experience in practical trading, especially good at analyzing the ,trend of Gold, Silver, Oil, Forex, Securities, Futures, Commodities, and Currencies, etc.")}
                  </div>
              </div>
          </div>
      </div>
      )
  }
}
