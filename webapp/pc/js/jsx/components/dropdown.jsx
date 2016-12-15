import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';
export default class Dropdown extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      is_show:"close",
      index:0,
    }
    this.isShow = false;
    this.showView = "";

    this.urlCdn = "";
    if(typeof(window)==="undefined"){
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    }else{
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }
  selectCountry(lang,name,index,evt){
    evt.stopPropagation();
    this.props.getSelect(lang,name);
    this.openDropdown();
    this.setState({index:index})
  }
  hideDropdown(){
    this.isShow=false;
    this.setState({
      is_show:"close"
    })
  }
  openDropdown(){
    // $(".dropdown-menu").toggle();

    this.isShow = !this.isShow;
    if(!this.isShow){
      $(".dropdown-menu>li").show();
      $(".filter>input").val("");
    }
    this.setState({
      is_show:this.isShow?"open":"close"
    })
  }
 	imageDp(){
 		let _views = [];
 		let _firstFlag = "";
    this.props.data.map((val,index)=>{
      let _flag = "icon flag "+val.key.toLowerCase();
      if(index==this.state.index){
        _firstFlag = _flag;
      }
      _views.push(<li key={"ct-"+index} onClick={this.selectCountry.bind(this,val.key,val.name,index)}>
      <a href="#"><i className={_flag}></i><span className="nation">{val.nation}</span><span>{val.name.split(",")[0]}</span></a></li>);
    });
    this.showView = (<i className={_firstFlag}></i>);
    return _views;
 	}

 	textDp(){
 		let _views = [];
 		let _firstText = "";
    this.props.data.map((val,index)=>{

      if(index==this.state.index){
        _firstText = val.name.split(",")[0];
      }
      _views.push(<li key={"ct-"+index} onClick={this.selectCountry.bind(this,val.key,val.name,index)}><a href="#"><span>{val.name.split(",")[0]}</span></a></li>);
    });
 		this.showView = (<span>{_firstText}</span>);
 		return _views;
 	}
  filterCountry(evt){
    let _val = evt.target.value;
    $(".dropdown-menu>li").hide();
    $(".dropdown-menu>li>a>.nation").each(function(index){
      let _txt = $(this).html();
      if(_txt){
        if(_txt.toLowerCase().indexOf(_val)!=-1){$(this).parent().parent().show()}
      }
    });
  }
  render(){
    var _props = this.props;
    let _views = [];
    const DPTYPE_IMAGE = 0;
    const DPTYPE_TEXT = 1;

    if(_props.dptype == DPTYPE_IMAGE){
    	_views = this.imageDp();
    }else{
    	_views = this.textDp();
    }
    var fg = this.urlCdn+"/pc/images/nation_search.png";
    return (
    <div className={"dropdown "+this.state.is_show}>
      <div className="bar dropdown">
        <button className="btn" onClick={this.openDropdown.bind(this)}>
          {this.showView}
          <i className="caret"></i>
        </button>
      </div>
      <div className="dropdown-list-filter">
        <img id="searchId" src={fg} />
        <input type="text" onChange={this.filterCountry.bind(this)} />
      </div>
      <ul className="dropdown-menu">
      {_views}
      </ul>
    </div>);
  }
}
