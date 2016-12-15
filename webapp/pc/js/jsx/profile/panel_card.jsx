import React from "react";
import $ from "jquery";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from "../tools/Lang-Client";
import BankList from "../data/bank_list";
import Country from "../data/country_all";
import ImageItem from "./image_item";
import Tip from "./tip";

export default class PanelCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
      status: -1,
      card_info: null,
      symbol: "down",
      idCard: "",
      bankId: "",
      bankName: "",
      countryKey: "",
      countryOfBank: "",
      picCount: 1,
      tip: null
    };

    this.locale = "";
    this.showDropList = false;

    this.data = {
      rules: {
        cn: [
          LangClient.i18n("1. It is important that you always provide us with correct and accurate information in order for us to process your withdrawal request in time."), LangClient.i18n("2. Document authentication process takes 1 to 3 working days. After your authentication has been approved, we will use this same bank account to transfer money."), LangClient.i18n("3. If you want to change you withdrawal account information, please send us an email at: account@ultrabanc.com")
        ],
        other: [
          LangClient.i18n("1. Attachments needed to be uploaded:"),
          LangClient.i18n("(1) Proof of ID - ID with photo, such as passport, driver\'s license, or any other form of government issued identity card."),
          LangClient.i18n("(2) Proof of residence - Confirm that you are resident in a country accepted by Ultrabanc with one of the following documents: recent utility bill (water, electricity or telephone bill) or  a bank/credit card statement."),
          LangClient.i18n("(3) Front picture of bank card."),
          LangClient.i18n('(4) Completed and signed <a target="_blank" href="http://source.ultrabanc.com/ultra/ASSESSMENT_OF_APPROPRIATENESS_EN_(11.10).pdf">Assessment of Appropriateness</a>.'),
          LangClient.i18n('(5) If your deposit was made by credit card, please also fill in and submit the <a target="_blank" href="http://source.ultrabanc.com/ultra/Personal_Investor_Agreement_EN(11.14).pdf">Personal Investor Agreement</a>.'),
          LangClient.i18n("2. For the first withdrawal request, we need to authenticate your withdraw account information in order to ensure that your withdrawal payment can be made on time, thus please provide accurate information."),
          LangClient.i18n("3. Documents authentication process will take 1-3 working days. All other withdrawal requests will be funded through this bank account in 1 to 3 working days.")
        ]
      },
      inputs: {
        cn: [
          {
            id: "id_holder_name",
            placeholder: LangClient.i18n("Account Name"),
            value: "",
            key: ""
          }, {
            id: "id_card_no",
            placeholder: LangClient.i18n("Bank Account Number"),
            value: "",
            key: ""
          }, {
            id: "id_bank_name",
            placeholder: LangClient.i18n("Bank Name"),
            value: "",
            key: "banklist"
          }, {
            id: "id_bank_city",
            placeholder: LangClient.i18n("Country of Bank\'s Branch"),
            value: "",
            key: ""
          }, {
            id: "id_mobile",
            placeholder: LangClient.i18n("Bank\'s Phone Number"),
            value: "",
            key: ""
          }
        ],
        other: [
          {
            id: "id_bank_country",
            placeholder: LangClient.i18n("Country of Bank"),
            value: "",
            key: "countrylist"
          }, {
            id: "id_first_name",
            placeholder: LangClient.i18n("First Name"),
            value: "",
            key: ""
          }, {
            id: "id_last_name",
            placeholder: LangClient.i18n("Last Name"),
            value: "",
            key: ""
          }, {
            id: "id_address",
            placeholder: LangClient.i18n("Detailed Address"),
            value: "",
            key: ""
          }, {
            id: "id_bank_name",
            placeholder: LangClient.i18n("Bank Name"),
            value: "",
            key: ""
          }, {
            id: "id_card_no",
            placeholder: LangClient.i18n("Bank Account Number"),
            value: "",
            key: ""
          }, {
            id: "id_swift_code",
            placeholder: LangClient.i18n("swift code"),
            value: "",
            key: ""
          }, {
            id: "id_bank_address",
            placeholder: LangClient.i18n("Bank\'s Branch Address"),
            value: "",
            key: ""
          }
        ]
      },
      images: {
        cn: [
          {
            id: "id_pic_0",
            desc: LangClient.i18n("Front of Bank Card"),
            url: ""
          }, {
            id: "id_pic_1",
            desc: LangClient.i18n("Back of Bank Card"),
            url: ""
          }, {
            id: "id_pic_2",
            desc: LangClient.i18n("Front of ID"),
            url: ""
          }, {
            id: "id_pic_3",
            desc: LangClient.i18n("Back of ID"),
            url: ""
          }
        ],
        other: [
          {
            id: "id_pic_0",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_1",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_2",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_3",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_4",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_5",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_6",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }, {
            id: "id_pic_7",
            desc: LangClient.i18n("Please refer to the Rules"),
            url: ""
          }
        ]
      }
    };
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {
    this.fetchCardInfo();

    var funcEvtKeyDown = (event) => {
      this.evtKeydown(event)
    };
    document.body.addEventListener("click", funcEvtKeyDown, false);

    this.funcClearUp = () => {
      document.body.removeEventListener("click", funcEvtKeyDown, false);
    };
  }

  componentWillReceiveProps(nextProps, nextState) {}

  componentWillUnmount() {
    if (this.funcClearUp) {
      this.funcClearUp();
    }

    // document.body.removeEventListener("click", (event) => {
    //   this.evtKeydown(event)
    // }, false);
  }

  getLocale(status, country = "") {
    if (status == -1 || status == 2) {
      // 没有提交过审核信息或者是审核不通过的时候，根据客户端展示的语言决定显示那种提交资料的格式
      let language = Cookie.getCookie("language");
      if (language == "zh-cn" || language == "zh-CN") {
        return "cn";
      } else {
        return "other";
      }
    } else {
      // 如果是正在审核或者审核通过，根据提交资料里的country信息决定显示那种格式
      if (country && country.toLowerCase() != "cn") {
        return "other";
      } else {
        return "cn";
      }
    }
  }

  fetchCardInfo() {
    let token = Cookie.getCookie("token");
    let language = Cookie.getCookie("language");
    if (!token) {
      this.props.needToLogin();
    }

    let url = "//" + Config.host[Config.env] + Config.api.account.get_bank_info;
    $.ajax({
      url: url,
      method: "GET",
      data: {
        "access-token": token,
        language: language
      },
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.status != 1) {
          this.showToast(resp.msg);
        }

        let cardInfo = resp.data;
        if (cardInfo) {
          let status = cardInfo.status;

          let name = cardInfo.name || "";
          let firstName = cardInfo.first_name || "";
          let lastName = cardInfo.last_name || "";
          let phoneNumber = cardInfo.phonenumber || "";
          let address = cardInfo.address || "";
          let bankCode = cardInfo.bank_code || "";
          let bankCity = cardInfo.bank_city || "";
          let bankAddress = cardInfo.bank_adress || "";
          let swiftCode = cardInfo.swift_code || "";

          let countryKey = cardInfo.country || "";
          let countryOfBank = countryKey
            ? (Country[countryKey].name || "")
            : "";
          let bankId = cardInfo.bank_id || "";
          let bankName = cardInfo.bank_name || "";
          let idCard = cardInfo.ID_card || "";
          let imageArray = cardInfo.imgs || [];

          if (status == 2) {
            // // 审核不通过的时候，不再显示用户之前提交的信息，输入框都是初始状态
            // name = firstName = lastName = phoneNumber = address = bankCode = bankCity = bankAddress = swiftCode = countryKey = countryOfBank = bankId = bankName = idCard = "";
            // this.state.picCount = 1;
            // this.locale = this.getLocale(status);
            // this.updateImageUrl("id_pic_0", "");
            // this.updateImageUrl("id_pic_1", "");
            // this.updateImageUrl("id_pic_2", "");
            // this.updateImageUrl("id_pic_3", "");
            // this.updateImageUrl("id_pic_4", "");
            // this.updateImageUrl("id_pic_5", "");
            // this.updateImageUrl("id_pic_6", "");
            // this.updateImageUrl("id_pic_7", "");

            // 保留输入框内容，显示附件缩略图
            this.locale = this.getLocale(status);
            imageArray.map((value, index) => {
              let id = "id_pic_" + index;
              this.updateImageUrl(id, value);
            });

            if (this.locale != "cn") {
              let count = imageArray.length + 1;
              this.state.picCount = count > 8
                ? 8
                : count;
            }
          }

          this.updateInputValue("id_holder_name", name);
          this.updateInputValue("id_first_name", firstName);
          this.updateInputValue("id_last_name", lastName);
          this.updateInputValue("id_mobile", phoneNumber);
          this.updateInputValue("id_address", address);
          this.updateInputValue("id_bank_name", bankName);
          this.updateInputValue("id_card_no", bankCode);
          this.updateInputValue("id_bank_city", bankCity);
          this.updateInputValue("id_bank_address", bankAddress);
          this.updateInputValue("id_swift_code", swiftCode);

          this.setState({
            status: status,
            card_info: cardInfo,
            countryKey: countryKey,
            countryOfBank: countryOfBank,
            bankId: bankId,
            bankName: bankName,
            idCard: idCard
          });
        } else {
          this.setState({status: -1, card_info: null});
        }
      },
      error: (e) => {}
    });
  }

  evtKeydown(event) {
    if (event.target.className) {
      if (!event.target.className.toString().match(/item drop|icon arrow|name/)) {
        if (!$("div.droplist").is(":hidden")) {
          this.hideBankList();
          this.hideCountryList();
        }
      }
    } else {
      if (!$("div.droplist").is(":hidden")) {
        this.hideBankList();
        this.hideCountryList();
      }
    }
  }

  onInputChange(inputId, event) {
    let text = $(event.target).val();
    if (inputId == "id_idinfo") {
      this.setState({idCard: text});
    } else {
      this.updateInputValue(inputId, text);
    }
  }

  onInputFocus(inputId) {
    let tip = this.state.tip
    if (tip && tip.id == inputId) {
      this.setState({tip: null});
    }
  }

  onInputKillFocus(inputId, key) {}

  onClickDropList() {
    $("div.droplist").toggle();
    this.showDropList = !this.showDropList;
    if (this.showDropList) {
      this.setState({symbol: "up"});
    } else {
      this.setState({symbol: "down"});
    }

    let tip = this.state.tip;
    if (tip && (tip.id == "id_bank_name" || tip.id == "id_bank_country")) {
      this.setState({tip: null});
    }
  }

  hideBankList() {
    let status = this.state.status;
    if (status == -1 || status == 2) {
      $("div.droplist").hide();
      this.showDropList = false;
      this.setState({symbol: "down"});
    }
  }

  onClickBankItem(bankId, bankName, event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideBankList();
    this.setState({bankId: bankId, bankName: bankName});
  }

  hideCountryList() {
    let status = this.state.status;
    if (status == -1 || status == 2) {
      $("div.droplist").hide();
      this.showDropList = false;
      this.setState({symbol: "down"});
    }
  }

  onClickCountryItem(key, name, event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideCountryList();
    this.setState({countryKey: key, countryOfBank: name});
  }

  updateInputValue(id, value) {
    let datas = this.data.inputs[this.locale];
    if (datas) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].id == id) {
          datas[i].value = value;
          this.setState({refresh: true});
          break;
        }
      }
    }
  }

  updateImageUrl(id, url) {
    let datas = this.data.images[this.locale];
    if (datas) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].id == id) {
          datas[i].url = url;
          this.updatePicUrl(id, url);
          this.setState({refresh: true});
          break;
        }
      }
    }
  }

  getStatusText(status) {
    let text = "";
    switch (status) {
      case 0:
        text = "Documents are being authenticated, please wait patiently.";
        break;
      case 1:
        text = "Documents have been authenticated with success.";
        break;
      case 2:
        text = "Documents\' authentication failed, please review your documents and informations and resubmit.";
        break;
      default:
        text = "Please provide correct and accurate information to ensure a smooth documents authentication process!";
    }

    return LangClient.i18n(text);
  }

  onShowImage(id, url) {
    this.updateImageUrl(id, url);

    if (this.locale != "cn") {
      let selCnt = 0;
      for (var i = 0; i < this.data.images[this.locale].length; i++) {
        if (this.data.images[this.locale][i].url) {
          selCnt += 1;
        }
      }

      if (selCnt < this.state.picCount || selCnt >= 8) {
        return;
      }

      this.setState({
        picCount: selCnt + 1
      });
    }
  }

  onClickSubmit() {
    if ($("#btn_submit_cardinfo").hasClass("disabled")) {
      return;
    }

    let token = Cookie.getCookie("token");
    if (!token) {
      this.props.needToLogin();
      return;
    }

    let result1 = this.checkInputValid();
    if (!result1.valid) {
      this.showErr(result1);
      return;
    }

    let result2 = this.checkImageValid();
    if (!result2.valid) {
      this.showPicErr(result2);
      return;
    }

    let url = "//" + Config.host[Config.env] + Config.api.account.set_bank_info;
    url += ("?access-token=" + token);

    let bankName = this.state.bankName;
    if (this.locale != "cn") {
      bankName = this.getInputValue("id_bank_name");
    }

    let postData = {
      name: this.getInputValue("id_holder_name"),
      first_name: this.getInputValue("id_first_name"),
      last_name: this.getInputValue("id_last_name"),
      country: this.state.countryKey,
      ID_card: $("#id_idinfo").val(),
      phonenumber: this.getInputValue("id_mobile"),
      address: this.getInputValue("id_address"),
      bank_id: this.state.bankId,
      bank_name: bankName,
      bank_code: this.getInputValue("id_card_no"),
      bank_city: this.getInputValue("id_bank_city"),
      bank_adress: this.getInputValue("id_bank_address"),
      swift_code: this.getInputValue("id_swift_code"),
      imgs: this.getImageArray()
    };

    $.ajax({
      url: url,
      method: "POST",
      data: postData,
      success: (resp) => {
        if (!resp) {
          return;
        }

        if (resp.status == 1) {
          this.fetchCardInfo();
        } else {
          let msg = resp.msg;
          this.showToast(LangClient.i18n(msg));
        }
      },
      error: (e) => {}
    });
  }

  checkInputValid() {
    let array = this.data.inputs[this.locale];
    for (var i = 0; i < array.length; i++) {
      if (array[i].key == "banklist") {
        if (!this.state.bankId || !this.state.bankName) {
          return {valid: false, id: array[i].id, msg: LangClient.i18n("Field must be filled in")};
        }
      } else if (array[i].key == "countrylist") {
        if (!this.state.countryKey || !this.state.countryOfBank) {
          return {valid: false, id: array[i].id, msg: LangClient.i18n("Field must be filled in")};
        }
      } else if (!array[i].value) {
        return {valid: false, id: array[i].id, msg: LangClient.i18n("Field must be filled in")};
      }
    }

    if (this.locale == "cn") {
      // 手机格式
      let mobileValue = $("#id_mobile").val();
      if (!(/^1[34578]\d{9}$/.test(mobileValue))) {
        return {valid: false, id: "id_mobile", msg: "手机号码格式不正确，请重新输入"};
      }

      // 身份证号格式
      let idCardValue = $("#id_idinfo").val();
      if (!idCardValue) {
        return {valid: false, id: "id_idinfo", msg: LangClient.i18n("Field must be filled in")}
      } else if (!(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(idCardValue))) {
        return {valid: false, id: "id_idinfo", msg: LangClient.i18n("The format of ID Number is wrong, please enter again.")}
      }
    }

    return {valid: true, id: "", msg: ""};
  }

  checkImageValid() {
    // 国内要求全部附件都上传，国外至少一个
    let array = this.data.images[this.locale];
    if (this.locale == "cn") {
      for (var i = 0; i < array.length; i++) {
        if (!array[i].url) {
          return {valid: false, id: array[i].id, msg: LangClient.i18n("Must upload attachments")};
        }
      }

      return {valid: true, id: "", msg: ""};
    } else {
      for (var i = 0; i < this.state.picCount; i++) {
        if (array[i].url) {
          return {valid: true, id: "", msg: ""};
        }
      }

      return {valid: false, id: array[0].id, msg: LangClient.i18n("Must upload attachments")};
    }
  }

  getInputValue(id) {
    let array = this.data.inputs[this.locale];
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == id) {
        return array[i].value;
      }
    }

    return "";
  }

  getImageArray() {
    let imageArray = [];
    let array = this.data.images[this.locale];
    for (var i = 0; i < array.length; i++) {
      if (array[i].url) {
        imageArray.push(array[i].url);
      }
    }

    return imageArray;
  }

  showErr(err) {
    this.setState({tip: err});
  }

  showPicErr(err) {
    let ref = this.refs[err.id];
    if (ref) {
      ref.showTip(err);
    }
  }

  updatePicUrl(id, url) {
    let ref = this.refs[id];
    if (ref) {
      if (!url) {
        ref.setState({url: url, tip: null});
      } else {
        ref.setState({url: url});
      }
    }
  }

  sortJson(order, key, type) {
    var ordAlpah = (order == 'asc')
      ? '>'
      : '<';
    var sortFun = new Function("alert('empty function')");
    if (type === "string") {
      sortFun = new Function('a', 'b', 'return a.' + key + ordAlpah + 'b.' + key + '?1:-1');
    } else if (type === "number") {
      sortFun = new Function('a', 'b', 'return parseInt(a.' + key + ")" + ordAlpah + 'parseInt(b.' + key + ')?1:-1');
    }
    return sortFun;
  }

  render() {
    let cardInfo = this.state.card_info;
    let propCardInfo = this.props.cardinfo;

    let status = this.state.status;
    let sysMsg = cardInfo
      ? (cardInfo.msg || "")
      : "";
    if (!cardInfo && propCardInfo) {
      cardInfo = propCardInfo;
      status = propCardInfo.status;
      sysMsg = propCardInfo.msg;
    }

    let disabled = (status == 0 || status == 1)
      ? true
      : false;

    let country = cardInfo
      ? (cardInfo.country || "")
      : "";
    this.locale = this.getLocale(status, country);

    // titles view or attachments view
    let attachView = "";
    let titleView = "";
    if (!disabled) {
      // 未提交时或审核失败后
      let imageViews = this.data.images[this.locale].map((value, index) => {
        if (this.locale == "cn" || index < this.state.picCount) {
          return (<ImageItem ref={value.id} key={index} id={value.id} locale={this.locale} desc={value.desc} url={value.url} onShowImage={this.onShowImage.bind(this, value.id)}/>);
        }
      });

      let noticeDesc = this.locale == "cn"
        ? LangClient.i18n("Only supports PNG, JPG, maximum size 2MB")
        : LangClient.i18n("Only supports PNG, JPG, PDF, maximum size 2MB");

      attachView = (
        <div className="right">
          <span className="blk_title">{LangClient.i18n("Upload")}</span>
          <div className="block attach">
            {imageViews}
            <span className="desc">{noticeDesc}</span>
          </div>
        </div>
      );
    } else {
      let titles = this.data.inputs[this.locale].map((value, index) => {
        return (
          <div key={index} className="field">
            <div className="item title">{value.placeholder}</div>
          </div>
        );
      });

      titleView = (
        <div className="titles">
          <span className="blk_title"></span>
          <div className="block">
            {titles}
          </div>
        </div>
      );
    }

    // id card input view
    let blkIdTitleView = "";
    let blkIdInputView = "";
    if (this.locale == "cn") {
      blkIdTitleView = (
        <span className="blk_title">{LangClient.i18n("ID")}</span>
      );

      let itemView = "";
      if (disabled) {
        itemView = (
          <div className="field">
            <span id="id_idinfo" className="item desc">{this.state.idCard}</span>
          </div>
        );
      } else {
        itemView = (
          <div className="field">
            <input id="id_idinfo" className="item ipt" type="text" placeholder={LangClient.i18n("ID Number")} value={this.state.idCard} onChange={this.onInputChange.bind(this, "id_idinfo")} onFocus={this.onInputFocus.bind(this, "id_idinfo")} onBlur={this.onInputKillFocus.bind(this, "id_idinfo")}/>
            <Tip self_key="id_idinfo" tip={this.state.tip}/>
          </div>
        );
      }

      blkIdInputView = (
        <div className="block id">
          {itemView}
        </div>
      );
    }

    // bank drop list view
    let bankListView = "";
    if (this.locale == "cn") {
      let bankList = BankList[this.locale];
      if (bankList) {
        let children = bankList.map((value, index) => {
          return (
            <li key={value.id} onClick={this.onClickBankItem.bind(this, value.id, value.name)}>{value.name}</li>
          );
        });
        bankListView = (
          <div className="droplist">
            <ul>
              {children}
            </ul>
          </div>
        );
      }
    }

    // country drop list view
    let countryListView = "";
    if (this.locale == "other") {
      let _countryData = [];
      for (let key in Country) {
        _countryData.push({key: key, nation: Country[key].name});
      }
      _countryData = _countryData.sort(this.sortJson("asc", "nation", "string"));

      let children = _countryData.map((value, index) => {
        if (value.key.toLowerCase() == "cn") {
          return "";
        }
        return (
          <li key={value.key} onClick={this.onClickCountryItem.bind(this, value.key, value.nation)}>{value.nation}</li>
        );
      });

      countryListView = (
        <div className="droplist">
          <ul>
            {children}
          </ul>
        </div>
      );
    }

    // inputs view
    let inputViews = this.data.inputs[this.locale].map((value, index) => {
      if (disabled) {
        let dispText = value.value;
        if (value.key == "banklist") {
          dispText = this.state.bankName;
        } else if (value.key == "countrylist") {
          dispText = this.state.countryOfBank;
        }
        return (
          <div key={value.id} className="field">
            <span className="item desc">{dispText}</span>
          </div>
        );
      } else {
        if (value.key == "banklist") {
          let bankText = this.state.bankName || value.placeholder;
          let arrowIconCss = "icon arrow " + this.state.symbol;
          return (
            <div key={value.id} className="field">
              <div className="item drop" onClick={this.onClickDropList.bind(this)}>
                <span className="name">{bankText}</span>
                <i className={arrowIconCss}></i>
                {bankListView}
                <Tip self_key={value.id} tip={this.state.tip}/>
              </div>
            </div>
          );
        } else if (value.key == "countrylist") {
          let countryText = this.state.countryOfBank || value.placeholder;
          let arrowIconCss = "icon arrow " + this.state.symbol;
          return (
            <div key={value.id} className="field">
              <div className="item drop" onClick={this.onClickDropList.bind(this)}>
                <span className="name">{countryText}</span>
                <i className={arrowIconCss}></i>
                {countryListView}
                <Tip self_key={value.id} tip={this.state.tip}/>
              </div>
            </div>
          );
        } else {
          return (
            <div key={value.id} className="field">
              <input id={value.id} className="item ipt" type="text" placeholder={value.placeholder} value={value.value} onChange={this.onInputChange.bind(this, value.id)} onFocus={this.onInputFocus.bind(this, value.id)} onBlur={this.onInputKillFocus.bind(this, value.id)}/>
              <Tip self_key={value.id} tip={this.state.tip}/>
            </div>
          );
        }
      }
    });

    // rules view
    let ruleViews = this.data.rules[this.locale].map((value, index) => {
      var _html = {
        __html: value
      };
      return (
        <span key={index} className="rule item" dangerouslySetInnerHTML={_html}></span>
      );
    });

    let statusTip = sysMsg || this.getStatusText(status);

    let sectionBtnCss = disabled
      ? "section btn hide"
      : "section btn";

    let btnCss = disabled
      ? "btn submit disabled"
      : "btn submit";

    let sectionInfoStyle = this.locale == "cn"
      ? {
        overflow: "visible"
      }
      : {};

    return (
      <div className="panel card">
        <div className="wrap">
          <div className="headtip">
            <i className="icon notice"></i>
            <span className="tip">{statusTip}</span>
          </div>
          <div className="content_wrap">
            <div className="section info" style={sectionInfoStyle}>
              {titleView}
              <div className="left">
                <span className="blk_title">{LangClient.i18n("Bank Card")}</span>
                <div className="block card">
                  {inputViews}
                </div>
                {blkIdTitleView}
                {blkIdInputView}
              </div>
              {attachView}
            </div>
            <div className={sectionBtnCss}>
              <a id="btn_submit_cardinfo" className={btnCss} onClick={this.onClickSubmit.bind(this)}>{LangClient.i18n("Submit")}</a>
            </div>
            <div className="section rule">
              <span className="rule title">{LangClient.i18n("Rules:")}</span>
              {ruleViews}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
