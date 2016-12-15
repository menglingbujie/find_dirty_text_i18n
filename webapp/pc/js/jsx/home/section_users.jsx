import React from "react";
import LangClient from '../tools/Lang-Client';

export default class SectionUsers extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    $("#slider li").click(function() {
      $(this).addClass("on").siblings().removeClass("on");
      var n = $(this).index();
      var m = n - 3;
      var k = n + 4;
      if (n > 3) {
          $("#slider li").slice(0, m).animate({
              "width": "0"
          }, 300, function() {
              $(this).css("width", "140px").appendTo("#slider");
          });
      }
      if (n < 4) {
          $("#slider li").slice(k, 7).css("width", "0").prependTo("#slider").animate({
              width: "140px"
          }, 300);
      }
    });
  }
  onPrevUser(evt){
    evt.preventDefault();
    $("#slider").find(".on").removeClass("on").prev().addClass("on");
    $("#slider").find("li:last").css("width", "0").prependTo("#slider").animate({
        width: "140px"
    }, 300);
  }
  onNextUser(evt){
    evt.preventDefault();
    $("#slider li").eq(4).addClass("on").siblings().removeClass("on");
    $("#slider").find("li:first").animate({
        "width": "0"
    }, 300, function() {
        $(this).css("width", "140px").appendTo("#slider");
    });
  }

  render(){
    return (<div className="section users">
      <div className="wrap">
        <div className="userlist">
          <a href="#" className="icon common lg_arrow_left" onClick={this.onPrevUser.bind(this)}></a>
          <a href="#" className="icon common lg_arrow_right" onClick={this.onNextUser.bind(this)}></a>
          <ul className="user-container" id="slider">
            <li>
              <i className="icon home user u1"></i>
              <h2 className="name">- {LangClient.i18n("Frank Elstner")} -</h2>
              <p className="intor">{LangClient.i18n("I am a loyal customer of Ultrabanc, their customer service is very good and they respond quickly. I have traded for five weeks now, earned almost $8,000! Thank you very much, Ultrabanc just keps on getting better and better. ")}</p>
            </li>
            <li>
              <i className="icon home user u3"></i>
              <h2 className="name">- {LangClient.i18n("Felix Krull")} -</h2>
              <p className="intor">{LangClient.i18n("I am a housewife with not much to do at home, so I tried trading at Ultrabanc. So far, I can tell you with confidence that this is the best way to trade and make money! I earned $3,000 in less than a week, and was able to withdraw fast.")}</p>
            </li>
            <li>
              <i className="icon home user u2"></i>
              <h2 className="name">- {LangClient.i18n("Claudia")} -</h2>
              <p className="intor">{LangClient.i18n("I've been trading for many years now, seen and used a lot of different platforms. So far, I'm really enjoying Ultrabanc, so much that I would give them a 5 star service. The most important thing for me, is that at Ultrabanc I can make money steadily.")}</p>
            </li>
            <li className="on">
              <i className="icon home user u4"></i>
              <h2 className="name">- {LangClient.i18n("Niki Lauda")} -</h2>
              <p className="intor">{LangClient.i18n("I deposited $1,000 in my account, it took only seven days to have it increased to $1,815. Making money is easier than I thought. Now, I can withdraw my deposit, this is so cool.")}</p>
            </li>
            <li>
              <i className="icon home user u7"></i>
              <h2 className="name">- {LangClient.i18n("Ben Becker")} -</h2>
              <p className="intor">{LangClient.i18n("I was recommended by a friend. He said there is a chance to make money, and here we are. Ultrabanc is really good, I really want to recommend it to all of you.")}</p>
            </li>
            <li>
              <i className="icon home user u10"></i>
              <h2 className="name">- {LangClient.i18n("Dominik Patrzauek")} -</h2>
              <p className="intor">{LangClient.i18n("Money usually depreciate when you save in the bank. Why not take it out and do some investments? Their customer service thought me how to trade step by step, and now I already have a steady income.")}</p>
            </li>
            <li>
              <i className="icon home user u9"></i>
              <h2 className="name">- {LangClient.i18n("Jan Hofer")} -</h2>
              <p className="intor">{LangClient.i18n("I deposited $100 on my first trade, and after one month, the amount became $500. I'm so excited. Let's see how long it will take to turn it into $1,000. God bless me.")}</p>
            </li>
            <li>
              <i className="icon home user u8"></i>
              <h2 className="name">- {LangClient.i18n("Fannie")} -</h2>
              <p className="intor">{LangClient.i18n("When I was pregnant, there has nothing to do. So I came to Ultrabanc, and made money from home. The profit I earned was enough for the child's milk. My husband loved the idea and said that I should just stay at home and make money every day.")}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>)
  }
}
