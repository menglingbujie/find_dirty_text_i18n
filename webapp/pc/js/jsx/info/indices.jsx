import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Indices extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrap_right_asset_indices wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("INDICES")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span">{LangClient.i18n("TOPIX")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans">
                      {LangClient.i18n("Tokyo stock Price Index, commonly known as TOPIX, along with Nikkei 225, is an important stock market index for the Tokyo Stock Exchange in Japan, tracking all domestic companies of the exchange\'s First Section. It is calculated and published by the TSE. As of February 1, 2011, there are 1,669 companies listed on the First Section of the TSE. The market value for the index on the same date is 197,401 Billion Yen.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 00:15-02:30,03:40-06:00 GMT")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("TEL AVIV 25")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The TA-25 Index is the TASE\'s flagship index. It was first published in 1992 under the name \"MA\'OF Index\". The TA-25 index tracks the prices of the shares of the 25 companies with the highest market capitalization on the exchange. It serves as an underlying asset for options and futures, Index-Linked Certificates and Reverse Certificates traded on the exchange and worldwide. The index also began on 1 January 1992 with a base level of 100.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Sun – Thu 07:00-13:30 GMT")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("TADAWUL (SAUDI STOCK EXCHANGE)")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Saudi Stock Exchange or Tadawul is the only stock exchange in Saudi Arabia. The Capital Market Authority supervises the exchange. The Tadawul All-Share Index (TASI) reached its highest point at 20,634.86 on 25 February 2006 . It lists 115 publicly traded companies (as of April 30th 2008).")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Sun – Wed 8:10 – 12:20")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .TASI")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("SSE180 (SHANGHAI STOCK EXCHANGE)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Traded in the Shanghai stock exchange,the SSE Composite Index (also known as Shanghai Composite) is the most commonly used indicator to reflect SSE\'s market performance. Constituents for the SSE Composite Index are all listed stocks (A shares and B shares) at the Shanghai Stock Exchange. The SSE180 reflects the largest 180 stocks in the SSE general index and it includes stocks such as BANK OF CHINA and AIR CHINA.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 7:00 – 8:00.")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .SSE180")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("S&P 500 (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Traded on the CME (Chicago Mercantile Exchange), Standard & Poors is a value-weighted index of 500 large-cap common stocks actively traded in the United States. The stocks included in the S&P are those of large publicly held companies that trade on either of the two largest American stock market companies: the NYSE Euronext and the NASDAQ OMX.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 13:40-20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .SPX")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("RTS (RUSSIAN TRADING SYSTEM)")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Russian Trading System is a stock market established in 1995 in Moscow, consolidating various regional trading floors into one exchange. The RTS Index (RTSI) is an index of 50 Russian stocks (as of March 15th, 2007) that trade on the RTS Stock Exchange in Moscow. The Index includes GAZPROM and SBERBANK, VOLGA TELECOM and NOVATEK.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 8:30 – 14:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .IRTS")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("NIKKEI225 (JPN)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Nikkei 225 , more commonly called the Nikkei, the Nikkei index, or the Nikkei Stock Average. is a stock market index for the Tokyo Stock Exchange (TSE). It has been calculated daily by the Nihon Keizai Shimbun (Nikkei) newspaper since 1950. It is a price-weighted average (the unit is yen), and the components are reviewed once a year. Currently, the Nikkei is the most widely quoted average of Japanese equities, similar to the Dow Jones Industrial Average. In fact, it was known as the \"Nikkei Dow Jones Stock Average\" from 1975 to 1985.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 00:15-02:30,03:40-06:00 GMT")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("NASDAQ (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Nasdaq Composite is a stock market index of all of the common stocks and similar securities listed on the NASDAQ stock market, meaning that it has over 3,000 components. It is highly regarded in the U.S. as an indicator of the performance of stocks of technology companies and growth companies. Since American and non-American companies are listed on the NASDAQ stock market, the index is not exclusively a U.S. index.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 15:00 – 19:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .IXIC")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("MSM 30 (OMAN)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Muscat Securities Market (MSM) is the principal stock exchange of Oman. It is located in Muscat and it was founded in 1988.The principal stock index at the MSM is the MSM-30. The MSM-30 (also known as the Muscat Securities Market Index) was established in 1992. The composition of the index by sector is as follows:")}
                      <br/>
                      {LangClient.i18n("Banks & Investment Sector: 69 companies")}
                      <br/>
                      {LangClient.i18n("Industry Sector: 89 companies")}
                      <br/>
                      {LangClient.i18n("Service : 61 companies.")}
                      <br/>
                      {LangClient.i18n("The Index includes stocks such as DHOFAR BANK and NATIONAL BANK OF OMAN")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Sun – Thu 6:30 – 8:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .MSI")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("MICEX 10 (MOSCOW INTERBANK EXCHANGE)")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The MICEX 10 Index is a price non-weighted index, calculated as the arithmetic mean of the change of prices of 10 most liquid stocks admitted to circulation in the Stock Market Section of the Moscow Interbank Currency Exchange in Moscow. The Index includes Russian Top firms in a variety of sectors such as GAZProm and SBERBANK.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 8:30 – 14:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .MCX10")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("KUWAIT (KUWAIT GENERAL INDEX)")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Kuwait Stock Exchange (KSE) is the national stock market of The State of Kuwait. Although several share holding companies (such as NBK in 1952) existed in Kuwait prior to the creation of the KSE, it was not until October 1962 that a law was passed to organize the country\'s stock market. The Kuwait Stock Exchange is also among the first and largest stock exchanges in the Persian Gulf region, and is now gaining prominence as one of the most potentially important in the world.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Sun – Thu 6:20 – 9:20")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .KWSE")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("KL FUTURE")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Kuala Lumpur Composite Index is a capitalization-weighted stock market index introduced in 1986. The FTSE Bursa Malaysia comprises the largest 30 companies listed on the Malaysian Main Market by full market capitalization that meet the eligibility requirements of the FTSE Bursa Malaysia Index Ground Rules.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 01:00-04:30,07:00-09:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : KLIc1")}
                      <br/>
                      {LangClient.i18n("Expiry Rule (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("ISE 30 (ISTANBUL STOCK EXCHANGE)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Istanbul Stock Exchange (ISE) is the only corporation in Turkey for securities exchange established to provide trading in equities, bonds and bills, revenue-sharing certificates, private sector bonds, foreign securities and real estate certificates as well as international securities. ISE is home to 320 national companies. Local trading hours are 09:30-12:00 for the first session and 14:00-17:00 for the second session, on workdays. All ISE members are incorporated banks and brokerage houses.")}
                      <br/>
                      {LangClient.i18n("Trading Hours Mon – Fri 7:00 – 9:00 and 11:10 – 13:50")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .XU030")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("HANG SENG (HONG KONG)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("HSI was started on November 24, 1969, and is currently compiled and maintained by HSI Services Limited. It is a subsidiary of Hang Seng Bank, the largest bank registered and listed in Hong Kong in terms of market capitalisation. It is responsible for compiling, publishing and managing the Hang Seng Index.")}
                      <br/>
                      {LangClient.i18n("Trading Hours Mon – Fri 01:30-04:00,05:10-08:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .HSI")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("FTSE 100 (UK)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The FTSE 100 Index — also called FTSE 100, FTSE, or, informally, the \"footsie\" is a share index of the 100 most highly capitalized UK companies listed on the London Stock Exchange. Because the FTSE includes large international companies such as HSBC, BP, Vodafone and Unilever it is considered to be a Global Index and as such is followed by investors worldwide.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 6:30 – 14:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .FTSE")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("DUBAI (DUBAI FINANCIAL MARKET GENERAL INDEX)")}<span
                          className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The Dubai Financial Market is a stock exchange located in Dubai, United Arab Emirates. It was founded on March 26, 2000. There are about 57 companies listed (as of August 2007) on DFM, most of them are UAE-based companies and a few dual listings for companies based in other MENA region countries. During 2004 and 2005, there were significant increases in the volume of shares traded and the share prices of many companies. However, towards the end of 2005 and through the first few months of 2006 the bubble burst and share values dropped by around 60% on DFM, along with similar decreases in most other Persian Gulf stock markets. The DFM index includes stocks such as DUBAI ISLAMIC BANK and the EMIRATES TELECOMUNICATION COMPANY.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: Sun – Thu 6:30 – 9:50")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .DFMGI")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("DOW (US)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Traded on the NYSE (New York Stock Exchange) the Dow Jones Industrial Average (i.e. Industrial Average, Dow Jones, Dow 30, or Dow) compiles the index to gauge the performance of the industrial sector within the American economy.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 13:40 – 20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .DJI")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("DAX (GERMANY)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The DAX (Deutscher Aktien IndeX, formerly Deutscher Aktien-Index (German stock index)) is a blue chip stock market index consisting of the 30 major German companies trading on the Frankfurt Stock Exchange. The DAX index includes stocks such as Adidas, Deutsche Bank and Bayer.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 7:15 – 15:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .GDAXI")}
                      <br/>
                      {LangClient.i18n("Expiration Rule : Reuters Last Rate")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("BOMBAY SE")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Representing a fast growing economy of India, the BSE Sensex or Bombay Stock Exchange Sensitive Index is a value-weighted index composed of 30 stocks of the largest and most actively traded stocks, representative of various sectors, on the Bombay Stock Exchange. These companies account for around one-fifth of the market capitalization of the BSE. The index has increased by over ten times from June 1990 to the present. The long-run rate of return on the BSE Sensex works out to be 18.6% per annum, which translates to roughly 9% per annum after compensating for inflation. The index includes stocks such as TATA MOTORS and HDFC BANK.")}
                      <br/>
                      {LangClient.i18n("Trading Hours Mon – Fri 4:15 – 10:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : .BSESN")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : Reuters Last Rate")} */}
                  </div>
              </li>
          </ul>
      </div>
    );
  }
}
