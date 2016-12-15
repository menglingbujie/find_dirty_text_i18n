import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";
import Leftlist from "./leftlist";
import Infolist from "./infolist";
import ContanctUs from "./contactUs";
import Devdynamic from "./devdynamic";
import Goldtech from "./goldteacher";
import Comintro from "./comintro";
import Binaryop from "./binaryoption";
import SixtysecBinary from "./sixtysecbinary";
import Binarysignal from "./binarysignal";
import Highlow from "./highlow";
import Onebtnoption from "./onbtnoption";
import FinancialCalendar from "./financial_calendar";
import TradeTerms from "./trade_terms";
import AboutDeposit from "./about_deposit";
import AboutWithdrawal from "./about_withdrawal";
import AboutAccount from "./about_account";
import HowToTrade from "./how_to_trade";
import Forex from "./forex";
import Stocks from "./stocks";
import Indices from "./indices";
import Commodities from "./commodities";
import LegalTermsConditions from "./legal_terms_conditions";
import LegalSecurityPrivacy from "./legal_security_privacy";
import LegalGeneralDisclaimer from "./legal_general_disclaimer";
import Aml from "./aml";
export default class Infodetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      _ancId:"",
      annList:[],
    }
  }

  init(){
    let _this = this;
    $(document).ready(function () {
          //因为这个页面有多个跳转，所以要根据不同的跳转，变成不同的title
          var _currtitle = $("title").text();
          var _currentLang = Cookie.getCookie("language")||"en";
          var _lang = _currentLang;
          if(_lang == "zh-CN"){
             if(location.search&&location.search.replace("?","")=="features"){
               $("title").text("交易特点-"+_currtitle);
             }else if(location.search&&location.search.replace("?","")=="faqs"){
               $("title").text("常见问题-"+_currtitle);
             }else if(location.search&&location.search.replace("?","")=="activity"){
               $("title").text("市场活动-"+_currtitle);
             }
          }else if(_lang=="en"){
            if(location.search&&location.search.replace("?","")=="features"){
              $("title").text("Features-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="faqs"){
              $("title").text("FAQs-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="activity"){
              $("title").text("Bulletin-"+_currtitle);
            }
          }else if(_lang == "pl"){
            if(location.search&&location.search.replace("?","")=="features"){
              $("title").text("O Opcjach-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="faqs"){
              $("title").text("FAQs-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="activity"){
              $("title").text("Promocje-"+_currtitle);
            }
          }else if(_lang == "pt"){
            if(location.search&&location.search.replace("?","")=="features"){
              $("title").text("Aspectos-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="faqs"){
              $("title").text("FAQs-"+_currtitle);
            }else if(location.search&&location.search.replace("?","")=="activity"){
              $("title").text("Promoção-"+_currtitle);
            }
          }

          /*
           * 左边导航条顶层单击
           * */
           //首次默认选中第一项
           $('.wrap_left>ul>li').click(function () {
               wrap_left_click(this);
           });

           function wrap_left_click(obj) {
               $(obj).find('a').addClass('cfonli');
               $(obj).find('span').css("color", "#ffc900");
               $(obj).siblings('li').find('a').removeClass('cfonli');
               $(obj).siblings('li').find('a').removeClass('cfon');
               $(obj).siblings('li').find('span').css("color", "#ffffff");
               var index = parseInt($(obj).attr('value'));
               if (index === -1) {
                   return;
               }
               $('.wrap_right').children().eq(index).css("display", "block").siblings().css("display", "none");
               if(index==0){
                 $('.wrap_right_info_list').css("display", "block");
                 $('.wrap_right_infodetail').css("display", "none");
               }
           }
           function selectLi($ele) {
               var index = parseInt($ele.attr('value'));
               if (index === -1) {
                   return;
               }
               $('.wrap_right').children().eq(index).css("display", "block").siblings().css("display", "none");

               /*$(this).find('a').removeClass('cfon');*/
               $(this).find('a').addClass('cfon');
               //$slib = $(this).parents('ul').parent('li').siblings('li');
               $(this).siblings('li').find('a').removeClass('cfon');
               //$slib.find('a').removeClass('cfon');
               //$slib.find('a').removeClass('cfonli');
               //$slib.find('span').css("color", "#ffffff");
           }
        //  selectLi($('.60Seconds'));
        /*
         * 锚点
         * */
         function anchor(){
            if(location.hash||location.search){
            //   let guide = location.href.split("#")[1];
              //let $currentUl = $(location.hash);
              // if(location.search.match(/\?anc=/)){
              //   let _ancId = location.search.match(/\?anc=(.*)/)[1]
              //   _this.setState({
              //     _ancId:_ancId,
              //   })
              //   console.log(_this.state.annList,"====goto anc==",_ancId);
              //   //公告跳转
              //   let _ele = $(".wrap_left_ul>li").eq(0).find("a");
              //   let _isActive = $(_ele).hasClass("cfonli")
              //   if(!_isActive){
              //     $(_ele).addClass("cfonli");
              //   }
              //   // $.ajax(function(info){
              //   //   if(this.refs.ancDetailId){
              //   //     this.refs.ancDetailId.updateInfo(info);
              //   //   }
              //   // })
              //   // if(_this.state.annList&&_this.state.annList.length>0&&_this.state.annList[_this.state.annList]){
              //   //   console.log(1)
              //   //   $('.wrap_right_infodetail').css("display", "block").siblings().css("display", "none");
              //   // }else{
              //   //   console.log(2)
              //   //   $(".wrap_right_infodetail").css("display","none");
              //   //   $(".wrap_right_infolist").css("display","block");
              //   // }
              //   // console.log("==info list css===",$('.wrap_right_infodetail').css("display"));
              //   return;
              // }
              let $currentUl=$(location.search.replace(/^\?/,"#"));
              if(!$currentUl){return;}

              let $siblingA = $currentUl.siblings('a');
              let $siblingApar = $siblingA.parents('li');

            //  $currentUl.css("display","block");
              $siblingA.removeClass('inactives');
              $siblingA.parent('li').siblings('li').removeClass('inactives');
              $siblingA.addClass('inactives');
              $siblingApar.removeClass("active").addClass("active");
              //$siblingA.siblings('ul').css("display","block");
              //其他下拉框收起
              $siblingApar.siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
              $siblingApar.siblings('li').children('ul').slideUp(100);
              wrap_left_click($siblingApar);
              let fistLi = $currentUl.children().eq(0);
              var index = parseInt(fistLi.attr('value'));
              if (index === -1) {
                  return;
              }
              $('.wrap_right').children().eq(index).css("display", "block").siblings().css("display", "none");
              if(location.hash){
               fistLi = $("."+location.hash.replace("#",""));
               selectLi(fistLi);
               fistLi.find('a').addClass('cfon');
               fistLi.siblings('li').find('a').removeClass('cfon');
             }else{
               fistLi.find('a').addClass('cfon');
               fistLi.siblings('li').find('a').removeClass('cfon');
             }

            }else{
              wrap_left_click($('.wrap_left>ul>li').eq(0));
            }
        }
        anchor();
        $('.nav a').on("click",(event)=>{
          //event.preventDefault();
          setTimeout(()=>{
            anchor();
          },200)
        })

        $('.footer .wrap a').on("click",(event)=>{
          //event.preventDefault();
          setTimeout(()=>{
            anchor();
            document.body.scrollTop = 0;
          },200)
        })
        /*
         * 左边导航条收缩功能实现
         * */
        $('.usinactive').click(function () {
            /*$('.inactive').click(function () {*/
            if ($(this).siblings('ul').children().length <= 0) {
                //其他下拉框收起
                $(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
                $(this).parents('li').siblings('li').children('ul').slideUp(100);
            } else {
                if ($(this).siblings('ul').css('display') == 'none') {
                    $(this).parent('li').siblings('li').removeClass('inactives');
                    $(this).addClass('inactives');
                    $(this).siblings('ul').slideDown(100).children('li');

                    //其他下拉框收起
                    $(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
                    $(this).parents('li').siblings('li').children('ul').slideUp(100);
                } else {
                    //控制自身变成+号
                    $(this).removeClass('inactives');
                    //控制自身菜单下子菜单隐藏
                    $(this).siblings('ul').slideUp(100);
                    //控制自身子菜单变成+号
                    $(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
                    //控制自身菜单下子菜单隐藏
                    $(this).siblings('ul').children('li').children('ul').slideUp(100);
                    //控制同级菜单只保持一个是展开的（-号显示）
                    $(this).siblings('ul').children('li').children('a').removeClass('inactives');
                }
            }
        });
        /*
         * "常见问题"，"标的资产"，"交易术语"中，答案的显示与收缩
         * */
        $('.wrap_right_span').each(function(idx,ele){
          ele.isClick = false;
        })
        $('.wrap_right_span').click(function () {
            this.isClick = !this.isClick;
            var $this = $(this);
             $this.next().slideToggle(400);
            var $cSlib = $(this).parents('li').siblings('li');

             if ($cSlib.children().length > 0) {
                 $cSlib.children('.wrap_right_ans').slideUp(400);
            } else {
                 $(this).parents('li').siblings('li').children('.wrap_right_ans').slideUp(400);
             }
            if(this.isClick){
              $(this).addClass('wrap_right_span_focus');
              $(this).children().eq(0).addClass('wrap_right_span_sub_focus');
            }else{
              $(this).removeClass('wrap_right_span_focus');
              $(this).children().eq(0).removeClass('wrap_right_span_sub_focus');
            }
             $cSlib.children('span').attr('class', 'wrap_right_span');
             $cSlib.children('span').children('span').attr('class', 'wrap_right_simg');

            /*$(this).removeClass('wrap_right_span_focus');
             $(this).children().eq(0).removeClass('wrap_right_span_sub_focus');*/

            /* var $tt = $(this).parents('li').parent('ul').siblings('ul').children('li');
             $tt.children('wrap_right_ans') .removeClass('wrap_right_span_sub_hover');*/
            /*.removeClass('wrap_right_span_hover').removeClass('wrap_right_span_focus')
             .removeClass('wrap_right_span_sub_hover').removeClass('wrap_right_span_sub_focus');*/

            /*$(this).removeClass('wrap_right_span_hover');
             $(this).children().eq(0).removeClass('wrap_right_span_sub_hover');*/

        });
        /*
         * "信息公告"->"详细信息"->单击功能
         * */
        /*$('.wrap_right_infolist_a').click(function () {
            $('.wrap_right_infodetail').css("display", "block").siblings().css("display", "none");
        });*/
        // $('.wrap_right_infolist').on('click','li',function (e) {
        //
        //     $('.wrap_right_infodetail').css("display", "block").siblings().css("display", "none");
        // });
        // /*
        //  * "详细信息"->返回
        //  * */
        // $('.wrap_right_infodetail_theme>a').click(function () {
        //     $('.wrap_right_infolist').css("display", "block").siblings().css("display", "none");
        //     $('.wrap_right_info_list').css("display", "block");
        //     $('.wrap_right_infodetail').css("display", "none");
        //     sessionStorage.removeItem("ancId");
        // });

        /*
         * 左边导航条子项单击
         * */
        $('.wrap_left>ul>li>ul>li').click(function () {

            var index = parseInt($(this).attr('value'));
            if (index === -1) {
                return;
            }
            $('.wrap_right').children().eq(index).css("display", "block").siblings().css("display", "none");

            /*$(this).find('a').removeClass('cfon');*/
            $(this).find('a').addClass('cfon');
            //$slib = $(this).parents('ul').parent('li').siblings('li');
            $(this).siblings('li').find('a').removeClass('cfon');
            //$slib.find('a').removeClass('cfon');
            //$slib.find('a').removeClass('cfonli');
            //$slib.find('span').css("color", "#ffffff");
        });


        /*$(".wrap_right_common_yl > ul > li > span").hover(function(){
         $(this).addClass('wrap_right_span_hover').removerClass();
         $(this).children().eq(0).addClass('wrap_right_span_sub_hover');
         },function(){
         $(this).removeClass('wrap_right_span_hover');
         $(this).children().eq(0).removeClass('wrap_right_span_sub_hover');
         });*/
        //查看更多
        $(".wrap_right_infolist_more").click(function(){
            var count = 10;
            var txt = '<li> <a class="wrap_right_infolist_a" href="#">系统公告信息，标题栏；点开查看详情。<span class="wrap_right_infolist_date">21/09/2016</span></a> </li>';
            for (var i = 1; i < count; i++) {
                  $('.wrap_right_infolist ul').append(txt);

                /*setInterval(function () {
                    $('.wrap_right_infolist ul').animate({
                        height: ($('.wrap_right_infolist ul').height() + 50) + "px"
                    }, 100, function () {
                        $(this).append(txt);
                    });
                }, 100);*/
            }
        });


    });
  }
  componentDidMount(){
    this.init();

  }
  render(){
    // 判断详情页展示的数据
    // let _annList=this.state.annList;
    // let _ancDetail;
    // for (var i = 0; i < _annList.length; i++) {
    //   var curAnc=_annList[i];
    //   if(curAnc.id==this.state._ancId){
    //     _ancDetail = curAnc
    //     break;
    //   }
    // }
    return (<div className="wrap">
        <Leftlist/>
        <div className="wrap_right">
            {/* <!--信息公告--> */}
            <Infolist />
            {/* <!--关于我们-联系我们--> */}
            <ContanctUs/>
            {/* <!--关于我们-发展动态--> */}
            <Devdynamic/>
            {/* <!--关于我们-金牌导师--> */}
            <Goldtech/>
            {/* <!--关于我们-公司介绍--> */}
            <Comintro/>
            {/* <!--二元期权介绍-二元期权--> */}
            <Binaryop/>
            {/* <!--二元期权介绍-60秒二元期权--> */}
            <SixtysecBinary/>
            {/* <!--二元期权介绍-二元期权的信号--> */}
            <Binarysignal/>
            {/* <!--二元期权介绍-看涨/看跌二元期权--> */}
            <Highlow/>
            {/* <!--二元期权介绍--单键二元期权--> */}
            <Onebtnoption/>
            {/* <!--财经日历--> */}
            <FinancialCalendar />
            {/* <!--交易术语--> */}
            <TradeTerms />
             {/* 常见问题-关于入金 */}
            <AboutDeposit />
             {/* 常见问题-关于出金 */}
             <AboutWithdrawal />
            {/* <!--常见问题-关于账号--> */}
            <AboutAccount />
            {/* <!--常见问题-如何交易--> */}
            <HowToTrade />
            {/* <!--标的资产-货币--> */}
            <Forex />
            {/* <!--标的资产-股票--> */}
            <Stocks />
            {/* <!--标的资产-指数--> */}
            <Indices />
            {/* <!--标的资产-商品--> */}
            <Commodities />

            {/* <!--公告详情--> */}
            {/* <Detail ref="ancDetailId" ancDetail={_ancDetail}/> */}

            {/* <!--法律声明--> */}
            <LegalGeneralDisclaimer />
            <LegalTermsConditions />
            <LegalSecurityPrivacy />
            {/*  aml*/}
            <Aml/>

        </div>
    </div>)
  }
}
