/*
  by marylin
  at 20161208
  description:改版首页，没有太多操作，所以从react中抽离出来
 */
(function(win,LangClient){
  function Home(){
    // var bannerData = {status:1,msg:"Get banner data error",banners:[{img:gUrlCdn+"/pc/images/home/bg_banner_1_en.jpg",link:""}]};
    var bannerDataJson = {
      "en":{status:1,msg:"Get banner data error",banners:[
        {img:gUrlCdn+"/pc/images/home/bg_banner_1_en.jpg",link:"/trade"},
        // {img:gUrlCdn+"/pc/images/home/bg_banner_2_en.jpg",link:""},
        {img:gUrlCdn+"/pc/images/home/bg_banner_3_en.jpg",link:"/activity/insurance"}
      ]},
      "zh-CN":{status:1,msg:"Get banner data error",banners:[
        {img:gUrlCdn+"/pc/images/home/bg_banner_1_cn.jpg",link:"/trade"},
        // {img:gUrlCdn+"/pc/images/home/bg_banner_2_cn.jpg",link:""},
        {img:gUrlCdn+"/pc/images/home/bg_banner_3_cn.jpg",link:"/activity/insurance"}
      ]},
      "pl":{status:1,msg:"Get banner data error",banners:[
        {img:gUrlCdn+"/pc/images/home/bg_banner_1_pl.jpg",link:"/trade"},
        // {img:gUrlCdn+"/pc/images/home/bg_banner_2_pl.jpg",link:""},
        {img:gUrlCdn+"/pc/images/home/bg_banner_3_pl.jpg",link:"/activity/insurance"}
      ]},
      "pt":{status:1,msg:"Get banner data error",banners:[
        {img:gUrlCdn+"/pc/images/home/bg_banner_1_pt.jpg",link:"/trade"},
        // {img:gUrlCdn+"/pc/images/home/bg_banner_2_pt.jpg",link:""},
        {img:gUrlCdn+"/pc/images/home/bg_banner_3_pt.jpg",link:"/activity/insurance"}
      ]},
    };
    var bannerData = bannerDataJson[LangClient.states.lang];
    var mMySwiper = null;
    var mScrouselTimer = null;
    var ELE = {
      totalTradeAmount:$("#totalTradeAmountId"),
      totalTradeUsers:$("#totalTradeUsersId"),
      totalUserAmount:$("#totalUserAmountId"),
      carouselList:$("#carouselListId"),
      lisenceLink:$("#lisenceLink"),
      bannerList:$("#bannerListId"),
      tradeCard:$("#tradeCardId")
    }
    var Handler = {
      loopBanner:function(){

      },
      showToast:function(text) {
        try{$(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();}catch(e){alert(e)}
      },
      fetch:function(url,type,data,callback){
        $.ajax({
          url:url,
          type:type,
          data:data,
          success:function(resp){callback(resp)},
          error:function(error){callback(error)}
        })
      },
      formatMoney:function(s,type){
        if (/[^0-9\.]/.test(s))
          return "0";
        if (s == null || s == "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type == 0) {// 不带小数位(默认是有小数位)
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
      }
    }

    function initEvent(){

    }
    var bannerTpl = "<a class='banner swiper-slide' {LINK} style='background-image:url(\"{IMG}\")'></a>";
    function initBanner(){
      //banner可配
      if(bannerData.status!=1){
        Handler.showToast(bannerData.msg)
        return;
      }
      var _arrBanners = bannerData.banners||null;
      if(!_arrBanners||_arrBanners.length<=0){
        Handler.showToast("No banners");
        return;
      }
      var _html = "";
      $.each(_arrBanners,function(idx,val){
        var _link="";
        if(val.link){_link = "href='"+val.link+"'";}
        _html += bannerTpl.replace(/{LINK}/,_link).replace(/{IMG}/,val.img)
      })

      ELE.bannerList.html(_html);

      if(_arrBanners.length>1){
        new Swiper('#bannerContainerId',{
          autoplay:4000,
          speed:600,
          autoHeight:true,
          autoplayDisableOnInteraction:false,
          loop:true,
          roundLengths:true,
          pagination:"#bannerPagination",
          prevButton:"#btnBannerPrevId",
          nextButton:"#btnBannerNextId",
          effect:"fade",
        });
      }

      //banner only one
      // if(_arrBanners.length===1){
      //   var _banner = _arrBanners[0];
      //   var _img = "url("+_banner.img+")";
      //   // ELE.bannerCurr.css("background-image",_img);
      //   // if(_banner.link){
      //   //   ELE.bannerCurr.attr("href",_banner.link);
      //   // }
      // }else{
      //   $.each(_arrBanners,function(key,val){
      //     console.log(val,"==="+key)
      //   })
      // }
    }
    //跑马灯模板
    var carouselTpl = '<li class="swiper-slide item">{TIME}'+LangClient.i18n('ago')
      +' <span class="highlight">{WHO}</span> '+LangClient.i18n('opened a')+'{DIRECTION} '+LangClient.i18n('position on')
      +' <span class="highlight">{PRODUCT}</span> '+LangClient.i18n('at')+' {PRICE_IN} '+LangClient.i18n('price')
      +LangClient.i18n('investing')+' ${AMOUNT} {OTHERS}</li>';

    function initCarousel(){
      if(mScrouselTimer){clearTimeout(mScrouselTimer)}
      Handler.fetch(gLastTradesUrl,"get",{},function(resp){
        if(!resp||resp.status!=1){
          Handler.showToast(resp.msg);
          return;
        }
        var _lists = resp.data;
        if(_lists&&_lists.length>0){
          var _html = "";
          $.map(_lists,function(val,index){
            var _time="",
              _timeCross =Math.abs(resp.timestramp - val.opentime),
              _seconds = _timeCross,
              _day = parseInt(_seconds/86400),
              _hour = parseInt(_seconds%86400/3600),
              _min = parseInt(_seconds%3600/60),
              _sec = Math.ceil(_seconds%60);
            if(_sec==60){_sec--;}
            if(_day>0){
              _time = _day+LangClient.i18n("Day");
              if(_day>1){_time = _day+LangClient.i18n("Days");}
            }else if(_hour>0){
              _time = _hour+LangClient.i18n('Hour');
              if(_hour>1){_time = _hour+LangClient.i18n("Hours");}
            }else if(_min>0){
              _time = _min+LangClient.i18n("Minute");
              if(_min>1){_time = _min+LangClient.i18n("Minutes");}
            }else{
              _time = _sec +LangClient.i18n('Second');
              if(_sec>1){_time = _sec+LangClient.i18n("Seconds");}
            }
            var _profit="";
            if(val.profit != "0.00"){
              _profit = ', '+LangClient.i18n('and')+' <span class="highlight">'+LangClient.i18n('earned')+" $"+val.profit+"</span>";
            }
            var _name = val.first_name+" "+val.last_name;
            _html += carouselTpl.replace(/{TIME}/,_time).replace(/{WHO}/,_name)
              .replace(/{DIRECTION}/,LangClient.i18n(val.direction)).replace(/{PRODUCT}/,LangClient.i18n(val.instrument))
              .replace(/{PRICE_IN}/,val.openprice).replace(/{AMOUNT}/,val.amount).replace(/{OTHERS}/,_profit);
          })
          if(_html){
            ELE.carouselList.html(_html);
            if(mMySwiper){
      				mMySwiper.updateContainerSize();
      				mMySwiper.updateSlidesSize();
      				mMySwiper.updateProgress();
      				mMySwiper.update();
      			}else{
              setTimeout(function(){
                mMySwiper = new Swiper('#carouselContainerId',{
                  autoplay:2000,
                  speed:600,
                  direction:"vertical",
                  autoHeight:true,
                  slidesPerView: 7,
                  autoplayDisableOnInteraction:false,
                  loop:true,
                  roundLengths:true,
                  simulateTouch:false,
                });
              },300)
            }
            mScrouselTimer = setTimeout(initCarousel,6e5);//10 mins update
          }
        }
      })
    }

    function initStatics(){
      Handler.fetch(gStaticsUrl,"get",{},function(resp){
        ELE.totalTradeAmount.html(Handler.formatMoney(resp.in,0));
        ELE.totalTradeUsers.html(Handler.formatMoney(resp.user,0));
        ELE.totalUserAmount.html(Handler.formatMoney(resp.out,0));
      })
    }
    this.init = function(){
      if(LangClient.states.lang!="zh-CN"){
        ELE.lisenceLink.removeClass("cn").removeAttr("href");
        ELE.tradeCard.hide();
      }
      //初始化banner
      initBanner();
      //初始化跑马灯，每10分钟更新一次数据
      initCarousel();
      //初始化统计数据
      initStatics();
      initEvent();
    }
  }
  var home = new Home();
  home.init();
})(window,LangService)
