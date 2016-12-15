import React from "react";
import $ from "jquery";
import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";
import NavMenuList from "./nav_menu_list";
import NavAnn from "./nav_ann";

export default class OptionsNav extends React.Component {
  constructor(props) {
    super(props);
    this.defaultNavIndex=0;
    this.state={
      navIndex:-1,
      navData:[
        // 不要轻易给url赋值为"/"，否则judageCurrentNav方法里的匹配逻辑可能无法正确判断当前导航栏的index
      	//{text:LangClient.i18n("Bonus Activity"),url:"/bonus", strict: false},
        {text:LangClient.i18n("Activity"),url:"/activity",tag:"activity", strict: false,submenu:[
          // {text:"Bonus Activity",url:"/activity/bonus"},
          {text:"Insurance Activity",url:"/activity/insurance"},
          {text:"IB  Affiliate Program",url:"/activity/ib"},
          {text:"IB Education",url:"/activity/education"},
        ]},
        {text:LangClient.i18n("FAQs"),url:"/info?faqs", strict: false},
        {text:LangClient.i18n("Guide"),url:"/guide", strict: false},
        {text:LangClient.i18n("Features"),url:"/info?features", strict: false},
        {text:LangClient.i18n("Trade"),url:"/trade", strict: false},
        {text:LangClient.i18n("Home"),url:"/", strict: true},
      ]
    }
  }
  judageCurrentNav(){
    let _subNav = location.search.match(/sub_nav=(.*)/);
    if(_subNav&&_subNav[1]){
      sessionStorage.setItem("sub_nav",_subNav[1]);
    }else{
      sessionStorage.removeItem("sub_nav");
      this.state.navData.map((val,index)=>{
        //console.log(location.pathname+"==="+val.url+"**"+location.hash);
        let _matchUrl = location.pathname;
        if(location.search){
          _matchUrl = location.pathname+location.search;
        }
        // console.log(_matchUrl+"===="+val.url+"==="+index);
        // 当url是host/trade?token=xxxxxx形式时，等于的判断条件不合适，只能通过匹配才可能找到
        if(_matchUrl&&(_matchUrl==val.url || (!val.strict && _matchUrl.match(val.url)))){
          sessionStorage.setItem("sub_nav",index);
          return;
        }
      })
    }
    let _navIndex = sessionStorage.getItem("sub_nav");
    // console.log(_navIndex);
    if(!_navIndex){
      sessionStorage.setItem("sub_nav",this.defaultNavIndex)
      _navIndex=this.defaultNavIndex;
    }
    this.setState({
      navIndex:_navIndex
    })
  }
  componentWillUnmount(){
    // window.removeEventListener("hashchange",this.judageCurrentNav);
  }
  openNavSubMenu(){
    if(this.refs.subnavmenu){this.refs.subnavmenu.openSubNavMenu();}
  }
  closeNavSubMenu(){
    if(this.refs.subnavmenu){this.refs.subnavmenu.closeSubNavMenu();}
  }
  componentDidMount(){
    window.addEventListener("hashchange",()=>{this.judageCurrentNav();});
    this.judageCurrentNav();
  }
  render(){
    return (<nav className="nav">
        <div className="wrap">
          <NavAnn/>
            {
              this.state.navData.map((val,index)=>{
                let _currStyle ="";
                if(this.state.navIndex == index){
                  _currStyle="current";
                }
                if(val.submenu&&val.submenu.length>0){
                  return(<div href="#" key={val.text+index}
                  onMouseOver={this.openNavSubMenu.bind(this)}
                  onMouseOut={this.closeNavSubMenu.bind(this)}
                  className={"subnav_menu "+_currStyle}>
                    {LangClient.i18n(val.text)}
                    <span className="triIcon"></span>
                    <NavMenuList ref="subnavmenu" menulist={val.submenu}/>
                  </div>)
                }else{
                  return(<a href={val.url||"javascript:void(0)"} key={val.text+index} className={_currStyle}>{LangClient.i18n(val.text)}</a>)
                }
              })
            }

        </div>
    </nav>);
  }
}
