import React from "react";
import $ from "jquery";
import Config from "../config/config";
import LangClient from '../tools/Lang-Client';

export default class OptionsTradeSubNav extends React.Component {
    constructor(props) {
        super(props);
        var _tradeTypes = Config.category.trade_type;
        this.state = {
            trade_types: _tradeTypes,
            trade_type: 0,
        }
    }
    componentWillMount() {
    }

    componentDidMount() {
        // console.log(window.__i18n__);
    }

    changeTradeCategory(type,value,event) {
      event.preventDefault();
      try{ga("send","event","trade_cate",value);}catch(e){}
      // console.log()
      this.setState({trade_type: type});
      this.props.onNavTypeChange(type);
      sessionStorage.setItem("trade_type",type);
    }

    render() {
        //console.log(window);
        let _state = this.state;
        let _tradeTypeView = [];
        _state.trade_types.map((value, index)=> {
            let _current = "";
            if (value.subcate == _state.trade_type) {
                _current = "current";
            }
            //commodities宽度不够需要从其他nav item借width
            let _fixWidthStyle="";
            if(value.subcate==4){
              _fixWidthStyle="fnw24";
            }
            _tradeTypeView.push((<a href="#" className={_current+" "+_fixWidthStyle} key={value.name+index}
                                    onClick={this.changeTradeCategory.bind(this,value.subcate,value.name)}><span>{LangClient.i18n(value.name)}</span></a>));
        });

        return (<nav className="subnav">
            {_tradeTypeView}
        </nav>);
    }
}
