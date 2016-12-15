import React from "react";
import LangClient from '../tools/Lang-Client';

export default class Pageination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: 1,
            page: 1,
            pagesAllArr: [],
            pagesCurrArr: [],
        }
    }

    componentDidMount() {
        // console.log(this.props.pages);

    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("==should===",nextState)
        // return (nextState.pages <= 1) ? false : true;
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if((nextProps.pages == this.state.pages) && this.state.pagesCurrArr&&this.state.pagesCurrArr.length>0){
          return;
        }
        // console.log("==will==",nextProps.pages);
        let _pagesAllArr = [];
        let _pagesCurrArr = [];
        let _allPages = nextProps.pages;
        const MAX_PAGE_SIZE = 5;
        for (let i = 1; i <= _allPages; i++) {
            _pagesAllArr.push(i);
            if (i > MAX_PAGE_SIZE) {
                continue;
            }
            _pagesCurrArr.push(i);
            if (_allPages > MAX_PAGE_SIZE) {
                if (i == MAX_PAGE_SIZE) {
                    _pagesCurrArr[MAX_PAGE_SIZE - 1] = _allPages;
                }
            }
        }

        // console.log(_allPages+"==",_pagesAllArr,"--",_pagesCurrArr);
        let _newPage = (_allPages>0&&this.state.page > _allPages) ? _allPages : this.state.page;
        let changed = _newPage != this.state.page;
        //console.log("==changed:"+changed+"=="+_newPage+":"+this.state.page);
        this.setState({
          page: _newPage!=this.state.page?_newPage:this.state.page,
            pages: _allPages,
            pagesCurrArr: _pagesCurrArr,
            pagesAllArr: _pagesAllArr
        });

        if (changed||this.state.page > 0 && this.state.page <= _allPages) {
          //console.log("gotoPage: ", _newPage);
          this.gotoPage(_newPage,null);
        }
    }

    loadMorePage() {

    }

    gotoPage(page, event) {
      if(event){
        event.preventDefault();
        event.stopPropagation();
      }
        //翻页数组中心值（翻页数组最大5）；
        const MiddleValueIndex = 2;
        const FirstValueIndex = 0;
        const LastValueIndex = 4;
        if (page > this.state.pages) {
            this.state.page = (this.state.pages<=0)?1:this.state.pages;
            return;
        } else if (page < 1) {
            this.state.page = 1;
            return;
        }
        // console.log("==curr page=="+page);
        const MAX_PAGE_SIZE = 5;
        let _middleValue = this.state.pagesCurrArr[MiddleValueIndex];
        let _firstValue = this.state.pagesCurrArr[FirstValueIndex];
        let _lastValue = this.state.pagesCurrArr[LastValueIndex];
        let _isLastPage = (this.state.pagesCurrArr.indexOf(this.state.pages - 1) != -1) ? true : false;
        let _isFirstPage = (this.state.pagesCurrArr.indexOf(1) != -1) ? true : false;
        // console.log("===allpage==",this.state.pagesAllArr)

        //如果最后一页点击第一个按钮则需要，清除最后两个，然后把当前位置的前两个
        //页码放到此之前
        if (page <= _firstValue) {
            if (_isFirstPage) {
                this.setState({page: page});
                this.props.onPageChange(page);
                return;
            }
            this.state.pagesCurrArr.pop();
            this.state.pagesCurrArr.unshift(_firstValue - 1);
            //如果第一个元素页码-2没有到头则需要pop两次否则只能pop一次
            //最后一页的上一页需要pop一次因为翻页到最后一页也只有shift一次
            if (!_isLastPage) {
                if (_firstValue - 2 > 1) {
                    this.state.pagesCurrArr.pop();
                    this.state.pagesCurrArr.unshift(_firstValue - 2);
                }
            } else {
                this.state.pagesCurrArr[MAX_PAGE_SIZE - 1] = this.state.pages;
            }
        } else if (page == _middleValue) {
            if (_isLastPage) {
                this.setState({page: page});
                this.props.onPageChange(page);
                return;
            }
            //每次点击到数组中间的值则需要判断是否到最后了
            //否则每次都要删除前两个然后再从当前位置往后追加两个值进来
            let _checkPageEnd = this.state.pages - _middleValue;
            this.state.pagesCurrArr.shift();
            let _nextValue = this.state.pagesAllArr.slice(_middleValue + 1, _middleValue + 2);

            //到最后了就删除一个即可
            if (_checkPageEnd >= MAX_PAGE_SIZE) {
                this.state.pagesCurrArr.shift();
                _nextValue = this.state.pagesAllArr.slice(_middleValue + 1, _middleValue + 3);
                this.state.pagesCurrArr.splice(MiddleValueIndex, 0, _nextValue[0], _nextValue[1]);
            } else {
                this.state.pagesCurrArr.splice(MiddleValueIndex + 1, 0, _nextValue[0]);
            }
        }else if(page==_lastValue){
          // console.log(this.state.pagesAllArr);
          let _nextValue = this.state.pagesAllArr.slice(this.state.pagesAllArr.indexOf(_lastValue-MAX_PAGE_SIZE+1));

          this.state.pagesCurrArr = _nextValue;
          // for(let i=0;i<_nextValue.length;i++){
          //   this.state.pagesCurrArr[i]=_nextValue[i];
          // }
          // this.state.pagesCurrArr.splice(0,_nextValue.length,_nextValue);
          // console.log(_nextValue);
        }
        // console.log(this.state.pagesCurrArr)
        this.setState({page: page});
        this.props.onPageChange(page);
    }

    nextPage(event) {
        this.state.page += 1;
        this.gotoPage(this.state.page, event);
    }

    prevPage(event) {
        this.state.page -= 1;
        this.gotoPage(this.state.page, event);
    }

    render() {
        let _props = this.props;
        let _state = this.state;
        let _isShow = {};
        //如果总页数小于等于1页不需要显示翻页按钮
        if (_state.pages > 1) {
            _isShow = {display: "block"}
        } else {
          _isShow = {display: "none"}
        }
        //只显示5个，从当前页码数组里取数据
        let _pageView = [];
        let _isLastPage = false;
        // console.log(_state);
        // console.log(_state.pagesCurrArr);
        // console.log(_state.pagesAllArr);
        for (let i = 1, len = _state.pagesCurrArr.length; i <= len; i++) {
            if (_state.pagesCurrArr.indexOf(_state.pages - 1) != -1) {
                _isLastPage = true;
            }
            let _val = _state.pagesCurrArr[i - 1];
            let _currCss = "";
            // console.log(_val+"===="+_state.page);
            if (_state.page == _val) {
                _currCss = "current";
            }
            let _pageItemView = (
                <a key={"page-"+_val} href="#" className={_currCss} onClick={this.gotoPage.bind(this,_val)}>{_val}</a>);
            if (!_isLastPage) {
                if (i == len - 1) {
                    _pageItemView = (<span key={"page-"+_val} className="more">...</span>);
                }
            }
            if (i == len) {
                _state.pagesCurrArr[len - 1] = _state.pages;
                _pageItemView = (<a key={"page-"+_state.pages} className={_currCss} href="#"
                                    onClick={this.gotoPage.bind(this,_state.pages)}>{_state.pages}</a>);
            }
            _pageView.push(_pageItemView);
        }
        return (
            <div className="pageination" style={_isShow}>
                <a href="#" className="btn prev" onClick={this.prevPage.bind(this)}>{LangClient.i18n("Prev")}</a>
                <nav className="pages">
                    {_pageView}
                </nav>
                <a href="#" className="btn next" onClick={this.nextPage.bind(this)}>{LangClient.i18n("Next")}</a>
            </div>
        );
    }
}
