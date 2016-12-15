import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Stocks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrap_right_asset_stocks wrap_right_common_yl" style={{"display":"none"}}>
          <div>{LangClient.i18n("STOCKS")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("NIKE (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Nike, Inc. is a major publicly traded sportswear and equipment supplier based in the United States. It is the world\'s leading supplier of athletic shoes and apparel and a major manufacturer of sports equipment with revenue in excess of $18.6 billion USD in its fiscal year 2008 . As of 2008, it employed more than 30,000 people worldwide. The company was founded on January 25, 1964 as Blue Ribbon Sports by Bill Bowerman and Philip Knight, and officially became Nike, Inc. in 1978. The company takes its name from Nike (Greek Νίκη pronounced [níːkɛː]), the Greek goddess of victory; it is also based on Egyptian usage of \"strength\", \"victory\", nakht. Nike markets its products under its own brand as well as Nike Golf, Nike Pro, Nike+, Air Jordan, Nike Skateboarding and subsidiaries including Cole Haan, Hurley International, Umbro and Converse. In addition to manufacturing sportswear and equipment, the company operates retail stores under the Niketown name.")}
                      <br/>
                      {LangClient.i18n("Trading Hours Mon – Fri 15:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : NKE")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("APPLE (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Apple Inc. is an American multinational corporation that designs and manufactures consumer electronics and computer software products. The company\'s best-known hardware products include Macintosh computers, the iPod and the iPhone. Apple software includes the Mac OS X operating system, the iTunes media browser, the iLife suite of multimedia and creativity software, the iWork suite of productivity software, Final Cut Studio, a suite of professional audio and film-industry software products, and Logic Studio, a suite of audio tools. The company operates more than 250 retail stores in nine countries and an online store where hardware and software products are sold.")}
                      <br/>
                      {LangClient.i18n("Trading Hours Mon – Fri 13:40 – 20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : AAPL.O")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("MICROSOFT (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Microsoft Corporation is a multinational computer technology corporation that develops, manufactures, licenses, and supports a wide range of software products for computing devices. Its most profitable products are the Microsoft Windows operating system and the Microsoft Office suite of productivity software. The company was founded to develop and sell BASIC interpreters for the Altair 8800. Microsoft rose to dominate the home computer operating system market with MS-DOS in the mid-1980s, followed by the Windows line of operating systems. Its products have all achieved near-ubiquity in the desktop computer market. When the company debuted its IPO in March 13, 1986, the stock price was US $21. By the end of the first trading day, the stock had closed at $28.The stock price peaked in 1999 at around US $119. In the last few years, the price of Microsoft\'s stock largely remained steady, with a rise in stock price around the release of Windows Vista and a fall during the economic crisis of 2008.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 15:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : MSFT.O")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("FACEBOOK")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Facebook is a social networking service launched in February 2004, owned and operated by Facebook, Inc. As of September 2012, Facebook has over one billion active users, more than half of them using Facebook on a mobile device. According to Social Media Today, in April 2010 an estimated 41.6% of the U.S. population had a Facebook account. Nevertheless, Facebook\'s market growth started to stall in some regions, with the site losing 7 million active users in the United States and Canada in May 2011.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: US, Mon – Fri 14:40 – 21:10 GMT")}
                      {/* <br/>
                      {LangClient.i18n("Expiry Rule: (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("GOOGLE (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Google Inc. is an American public corporation, earning revenue from advertising related to its Internet search, e-mail, online mapping, office productivity, social networking, etc. Google has also developed an open source web browser and a mobile operating system. As of March 31, 2009 (2009-03-31), the company has 19,786 full-time employees. The company is running millions of servers worldwide, which process hundreds of millions of search requests each day.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: Mon – Fri 15:00-21:00 GMT")}
                      {/* <br/>
                      {LangClient.i18n("Expiry Rule: (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("ALIBABA")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Listed on the New York Stock Exchange (NYSE), Alibaba group is a Chinese ecommerce company that operates as a holding firm. Via the web, the company provides products and services on a worldwide scale.")}
                      <br/>
                      {/* {LangClient.i18n("Volume: 75,970,621")}
                      <br/> */}
                      {LangClient.i18n("Trading hours (GMT): Monday through Friday from 14:00 - 21:00")}
                  </div>
              </li>
          </ul>
      </div>
    );
  }
}
