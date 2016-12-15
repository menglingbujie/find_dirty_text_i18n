import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class OptionsTradeNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navIndex: 1,
    }
  }
  changeNav(orderId,navIndex,cate) {
    try{ga("send","event","trade_type",cate);}catch(e){}
    let _index = parseInt(navIndex);
    sessionStorage.setItem("nav_index", _index);
    this.setState({navIndex: orderId});
    this.props.onNavChange(_index);
  }

  componentDidMount() {
    this.updateSpacerWidth();

    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", () => {
        this.updateSpacerWidth();
      });
    } else if (document.attachEvent) {
      document.attachEvent("onload", () => {
        this.updateSpacerWidth();
      }, false);
    }

    window.addEventListener("load", () => {
      this.updateSpacerWidth();
    }, false)
  }

  componentWillReceiveProps(nextProps){
    this.updateSpacerWidth();

    let _navIndex = sessionStorage.getItem("nav_index");
    if(!!_navIndex){
      this.setState({navIndex:_navIndex});
    }
  }

  updateSpacerWidth() {
    if (this.refs.spacer) {
      let totalWidth = this.refs.nav.clientWidth;
      let othersWidth = 0;

      let _props = this.props;
      if (_props.cateList && _props.cateList.length > 0) {
        _props.cateList.map((value, index)=> {
          let refId = "nav-" + index;
          let obj = this.refs[refId];
          if (obj) {
            othersWidth += obj.offsetWidth;
          }
        })
      }

      let spacerWidth = totalWidth > othersWidth ? (totalWidth - othersWidth - 1) : 0;
      $(".spacer").css("width", spacerWidth + "px");
    }
  }

  render() {
    let _navHtml = [];
    let _state = this.state;
    let _props = this.props;
    if (_props.cateList && _props.cateList.length > 0) {
      _props.cateList.map((value, index)=> {
        let _currCss = "";
        if (value.id == _state.navIndex) {
          _currCss = "current";
        }
        let _key = "nav-" + index;
        _navHtml.push((<a ref={_key} href="#" key={_key} className={_currCss}
          onClick={this.changeNav.bind(this,value.cat_order,value.id,value.cat)}><i className="point"></i>{LangClient.i18n(value.cat)}</a>));
      })

      // spacer
      // 遨游浏览器上发现一个样式兼容性问题，div需要填一个value才能使nav下的子项保持顶部对齐，
      // 这里填入一个空格符的转义字符形式，不要随意移除
      _navHtml.push((<div ref="spacer" key={_navHtml.length} className="spacer">&nbsp;</div>));

      // let size = 4 - _navHtml.length;
      // if (size > 0) {
      //   let _spacerCss = "spacer p" + size * 25;
      //   _navHtml.push((<div key={_navHtml.length} className={_spacerCss}></div>));
      // }
    } else {
      _navHtml.push((<div key={0} className="loading">{LangClient.i18n("Loading")}...</div>));
    }

    return (<nav ref="nav" className="options">{_navHtml}</nav>);
  }
}
