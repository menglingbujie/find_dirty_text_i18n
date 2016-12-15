import React from "react";
import $ from "jquery";
import Cookie from "../tools/cookie";
export default class OptionsLangs extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleShow() {
    $(".droppanel.langs").toggle();
  }
  changeLocationSearch(changetext){
    var _oldSearch=location.search.split("&");
    var _isNeedToUpdateLang = false;
    if(_oldSearch&&_oldSearch.length>0){
      var _newSearch=[];
      for(var i=0;i<_oldSearch.length;i++){
        var _item = _oldSearch[i];
        if(!_item){continue;}
        //选择语言时找到lang字段更新其内容
        //如果没有找到则不需要重新location.search，直接用location.reload即可
        if(_item.match("lang")){
          _item=_item.replace(/(lang=).*/,"$1"+changetext);
          _isNeedToUpdateLang = true;
        }
        _newSearch.push(_item);
      }
      if(_isNeedToUpdateLang){
        return _newSearch.join("&");
      }
    }
    return "";
  }
  changeLangs(lang, event) {
    event.preventDefault();
    try{ga("send","event","lang",lang);}catch(e){}
    Cookie.setCookie("language",(lang||"en"),26e5);//约等于一个月
    let _newSearch = this.changeLocationSearch(lang||"en");
    if(_newSearch){
      location.search = _newSearch;
    }else{
      location.reload();
    }

  }
  evtKeydown(event){
    if(event.target.className){
      if(!event.target.className.toString().match(/symble|flag/)){
        if(!$(".dialog.langs").is(":hidden")){
          this.props.resetSymbole();
          $(".droppanel.langs").hide();
        }
      }
    }else{
      if(!$(".droppanel.langs").is(":hidden")){
        this.props.resetSymbole();
        $(".droppanel.langs").hide();
      }
    }
  }
  componentDidMount(){
    document.body.addEventListener("click",(event)=>{this.evtKeydown(event)},false);
  }
  componentWillUnmount(){
    document.body.removeEventListener("click",(event)=>{this.evtKeydown(event)},false);
  }
  render() {
    return (
      <div className="droppanel langs">
        <ul>
          {
            this.props.countries.map((val, index)=> {
              let _flag = "icon flag " + val.key.toLowerCase();
              return (
                <li key={"langs-"+index} onClick={this.changeLangs.bind(this,val.lang)}><a href="#"><i
                  className={_flag}></i></a></li>);
            })
          }
        </ul>
      </div>
    );
  }
}
