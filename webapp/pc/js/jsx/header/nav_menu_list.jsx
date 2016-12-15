import React from "react";
import LangClient from '../tools/Lang-Client';
export default class NavMenuList extends React.Component
{
  constructor(props){
    super(props);
    this.state={
      isShow:"hide"
    }
  }
  openSubNavMenu(){
    this.setState({isShow:"show"})
  }
  closeSubNavMenu(){
    this.setState({isShow:"hide"})
  }
  render(){
    return (
      <div className={"subnav_menu_list "+this.state.isShow}>
        {
          this.props.menulist.map((val,index)=>{
            return(<a href={val.url} key={val.text+index}>{LangClient.i18n(val.text)}</a>);
          })
        }
      </div>
    )
  }
}
