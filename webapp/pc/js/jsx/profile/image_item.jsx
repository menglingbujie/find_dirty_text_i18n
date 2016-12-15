import React from "react";
import $ from "jquery";
import Config from "../config/config";
import Cookie from "../tools/cookie";
import LangClient from "../tools/Lang-Client";
import Tip from "./tip";

export default class ImageItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      tip: null
    };

    this.timer = 0;

    this.urlCdn = "";
    if (typeof(window) === "undefined") {
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    } else {
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  showToast(text) {
    $(".toast").html(LangClient.i18n(text)).fadeIn().delay(3e3).fadeOut();
  }

  showFileSelection(id) {
    this.hideTip();
    document.getElementById(id).click();
  }

  onFileChange(id) {
    let element = document.getElementById(id);
    let files = (element && element.files) || null;
    let file = (files && files.length > 0 && files[0]) || null;
    if (!file) {
      return;
    }

    let ext = this.getFileExt(file.name);
    if (this.props.locale == "cn") {
      if ((file.size >= 2 * 1024 * 1024) || !(ext && /^(jpg|JPG|png|PNG)$/.test(ext))) {
        this.showTip(LangClient.i18n("Only supports PNG, JPG, maximum size 2MB"));
        return;
      }
    } else {
      if ((file.size >= 2 * 1024 * 1024) || !(ext && /^(jpg|JPG|png|PNG|pdf|PDF)$/.test(ext))) {
        this.showTip(LangClient.i18n("Only supports PNG, JPG, PDF, maximum size 2MB"));
        return;
      }
    }

    let formData = new FormData();
    formData.append('photo', file);

    let url = "//" + Config.host[Config.env] + Config.api.tools.upload_photo;
    url += ("?access-token=" + Cookie.getCookie("token"));

    this.showTip(LangClient.i18n("Uploading..."));

    $.ajax({
      url: url,
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: (resp) => {
        if (!resp) {
          this.hideTip();
          return;
        }

        let url = resp.imgurl;
        let msg = resp.msg;
        if (url) {
          url = "//" + Config.host[Config.env] + url;
          this.setState({url: url});
          this.showTip(LangClient.i18n("Upload success"), "normal");
          this.props.onShowImage(url);
        } else if (msg) {
          this.showTip(LangClient.i18n(msg));
        }
      },
      error: (e) => {
        let err = e
          ? (e.statusText || "")
          : "";
        if (err) {
          this.showTip(err);
        } else {
          this.hideTip();
        }
      }
    });
  }

  getFileExt(file) {
    return (-1 !== file.indexOf('.'))
      ? file.replace(/.*[.]/, '')
      : '';
  }

  showTip(tip, type = "") {
    if (tip && typeof(tip) == 'string') {
      this.setState({
        tip: {
          id: this.props.id,
          msg: tip,
          type: type
        }
      });

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        if (this.state.tip && this.state.tip.type == "normal") {
          this.hideTip();
        }
      }, 3000);
    } else {
      this.setState({tip: tip});
    }
  }

  hideTip() {
    this.showTip(null);
  }

  render() {
    let id = this.props.id;
    let desc = this.props.desc;
    let url = this.state.url || this.props.url;
    let imgCss = url
      ? "icon image"
      : "icon image hide";

    let ext = url
      ? this.getFileExt(url)
      : "";
    if (ext.toLowerCase() == "pdf") {
      url = this.urlCdn + "/pc/images/icon_pdf_thumbnail.jpg";
    }

    return (
      <div className="pic" onClick={this.showFileSelection.bind(this, id)}>
        <i className="icon camera"></i>
        <span className="tip">{desc}</span>
        <input className="ipt photo" type="file" id={id} name="photo" onChange={this.onFileChange.bind(this, id)}/>
        <img className={imgCss} src={url}/>
        <Tip self_key={id} tip={this.state.tip}/>
      </div>
    );
  }
}
