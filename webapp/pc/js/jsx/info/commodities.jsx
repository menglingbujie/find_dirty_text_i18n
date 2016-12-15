import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class Commodities extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wrap_right_asset_commodities wrap_right_common_yl" style={{"display": "none"}}>
          <div>{LangClient.i18n("COMMODITIES")}</div>
          <ul>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("WHEAT")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Wheat is a grass, originally from the Fertile Crescent region of the Near East, but now cultivated worldwide. In 2007 world production of wheat was 607 million tons, making it the third most-produced cereal after maize (784 million tons) and rice (651 million tons).Globally, wheat is the leading source of vegetable protein in human food, having higher protein content than either maize (corn) or rice, the other major cereals. In terms of total production tonnages used for food, it is currently second to rice as the main human food crop, and ahead of maize, after allowing for maize's more extensive use in animal feeds")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 12:00-18:00 GMT")}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("SUGAR")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("The sugar is one of the world\'s leading sweeteners, mainly produced in Brazil. There are many types of sugars which all are rated by the ICUMSA (international commission uniform methods of sugar analysis), at our platform the sugar is traded as quoted and cleared by the CME group. The future contracts are dollar dominated and represent the price of sugar for 112,000 units. In our platform the nearest future is traded out of the possible tradable contracts (which are March, May, July and October).")}
                      <br/>
                      {LangClient.i18n("Platform trading hours Mon - Fri 10:00 – 18:00")}
                      {/* <br/>
                      {LangClient.i18n("CME symbol YO.")}
                      <br/>
                      {LangClient.i18n("Expiry rule (Bid + Ask)/2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("SILVER")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Silver, in the form of electrum (a gold-silver alloy), was coined to produce money in around 700 BCE by the Lydians. Later, silver was refined and coined in its pure form. Many nations used silver as the basic unit of monetary value. In the modern world, silver bullion has the ISO currency code XAG. The name of the United Kingdom monetary unit \"pound\" reflects the fact that it originally represented the value of one troy pound of sterling silver. In the 1800s, many nations, such as the United States and Great Britain, switched from silver to a gold standard of monetary value, then in the 20th century to fiat currency. Much like gold, it is considered to be a natural hedge against inflation and in the last few years was highly correlated with world growth.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Thu 04:00 – 20:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : XAG=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("PLATINUM")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Platinum is a chemical element with the chemical symbol Pt and an atomic number of 78. Platinum is used in jewelry, laboratory equipment, electrical contacts and electrodes, platinum resistance thermometers, dentistry equipment, and catalytic converters. Platinum bullion has the ISO currency code of XPT. Platinum is a commodity with a value that fluctuates according to market forces. On June 5, 2009, Platinum was worth $1263.00 per troy ounce (approximately $40.09 per gram).")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 10:00 – 20:00")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : XPT=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("OIL (LIGHT SWEET CRUDE)")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Sweet crude oil is a type of petroleum. Petroleum is considered \"sweet\" if it contains less than 0.5% sulfur, compared to a higher level of sulfur in sour crude oil. Sweet crude oil contains small amounts of hydrogen sulfide and carbon dioxide. High quality, low sulfur crude oil is commonly used for processing into gasoline and is in high demand, particularly in the industrialized nations. \"Light sweet crude oil\" is the most sought-after version of crude oil as it contains a disproportionately large amount of these fractions that are used to process gasoline, kerosene, and high-quality diesel. The term \"sweet\" originated because the low level of sulfur provides the oil with a mildly sweet taste and pleasant smell. Nineteenth century prospectors would taste and smell small quantities of the oil to determine its quality. This type of oil is considered a benchmark for oil and is traded at the Chicago Mercantile Exchange. The oil is considered a natural hedge against inflation as in the last few years was highly correlated with the world\'s growth.")}
                      <br/>
                      {LangClient.i18n("Trading Hours : Mon – Fri 2:00 – 20:30")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : CLV1")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("GOLD")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("Historically gold coinage was widely used as currency; When paper money was introduced, it typically was a receipt redeemable for gold coin or bullion. In an economic system known as the gold standard, a certain weight of gold was given the name of a unit of currency. For a long period, the United States government set the value of the US dollar so that one troy ounce was equal to $20.67 ($664.56/kg), but in 1934 the dollar was devalued to $35.00 per troy ounce ($1125.27/kg). By 1961 it was becoming hard to maintain this price, and a pool of US and European banks agreed to manipulate the market to prevent further currency devaluation against increased gold demand. On March 17, 1968, economic circumstances caused the collapse of the gold pool, and a two-tiered pricing scheme was established whereby gold was still used to settle international accounts at the old $35.00 per troy ounce ($1.13/g) but the price of gold on the private market was allowed to fluctuate; this two-tiered pricing system was abandoned in 1975 when the price of gold was left to find its free-market level Today Gold is considered to be a natural hedge against world inflation and in the last few years together with crude prices and other metals, was highly correlated with world global growth, especially in emerging markets.")}
                      <br/>
                      {LangClient.i18n("Trading Hours: Mon – Thu 2:00-20:30 GMT")}
                      {/* <br/>
                      {LangClient.i18n("Reuters Code : XAU=")}
                      <br/>
                      {LangClient.i18n("Expiry Rule : (Bid + Ask) / 2")} */}
                  </div>
              </li>
              <li>
                  <span className="wrap_right_span ">{LangClient.i18n("COFFEE")}<span className="wrap_right_simg"></span></span>

                  <div className="wrap_right_ans ">
                      {LangClient.i18n("One of the world\'s most popular drinks, it is assumed that 80% of adults drink some sort of coffee or a derivative of coffee at list once a day. Like many other soft commodities Brazil is the largest producer of coffee. The future contracts are dollar dominated and represent the price of sugar for 37,500 pounds. In our platform the nearest future is traded out of the possible tradable contracts (which are March, May, July September and December).")}
                      <br/>
                      {LangClient.i18n("CME symbol KT.Platform trading hours Mon - Fri 13:00-18:00 GMT")}
                  </div>
              </li>
          </ul>
      </div>
    );
  }
}
