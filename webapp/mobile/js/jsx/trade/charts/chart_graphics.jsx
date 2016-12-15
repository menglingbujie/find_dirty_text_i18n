import $ from "jquery";
import Highcharts from "highcharts";
import Config from "../../config/config";
import MMap from "../../tools/mmap";
import ChartConfig from "./chart_config";
import LangClient from "../../tools/Lang-Client";

export default class ChartGraphics {
  constructor(chart) {
    this.myChart = chart;

    this.urlCdn = "";
    if (typeof(window) === "undefined") {
      this.urlCdn = Config.cdn[Config.env][global.process.env.language].url;
    } else {
      this.urlCdn = Config.cdn[Config.env][LangClient.states.lang].url;
    }
  }

  // STOP TRADE
  addStopLine(value) {
    this.addLine(ChartConfig.staticCfg.plineIdStop, value, "", ChartConfig.staticCfg.stopFontColor, ChartConfig.staticCfg.lineColorStop, 'dash', true, 270);
  }

  removeStopLine() {
    this.removeLine(ChartConfig.staticCfg.plineIdStop, true);
  }

  addStopIcon(value) {
    let src = this.urlCdn + "/mobile/images/icon_stop_buy.png";
    let iconSize = 15;
    if (!this.myChart.stopIcon) {
      this.myChart.stopIcon = this.myChart.renderer.image(src, 0, 0, 0, 0);
      this.myChart.stopIcon.add();
    }

    let posX = this.myChart.xAxis[0].toPixels(value, false) - iconSize / 2;
    let posY = this.myChart.plotTop + this.myChart.plotHeight + 2;
    this.myChart.stopIcon.show().attr({x: posX, y: posY, width: iconSize, height: iconSize, id: 'stopicon'});
    this.myChart.stopIcon.toFront();
  }

  removeStopIcon() {
    if (this.myChart.stopIcon) {
      this.myChart.stopIcon.hide();
      this.myChart.stopIcon = null;
      $('#stopicon').remove();
    }
  }

  // REVEAL
  addRevealLine(value) {
    this.addLine(ChartConfig.staticCfg.plineIdReveal, value, "", ChartConfig.staticCfg.revealFontColor, ChartConfig.staticCfg.lineColorReveal, 'dash', true, 270);
  }

  removeRevealLine() {
    this.removeLine(ChartConfig.staticCfg.plineIdReveal, true);
  }

  addRevealIcon(value) {
    let src = this.urlCdn + "/mobile/images/icon_reveal.png";
    let iconSize = 15;
    if (!this.myChart.revealIcon) {
      this.myChart.revealIcon = this.myChart.renderer.image(src, 0, 0, 0, 0);
      this.myChart.revealIcon.add();
    }

    let posX = this.myChart.xAxis[0].toPixels(value, false) - iconSize / 2;
    let posY = this.myChart.plotTop + this.myChart.plotHeight + 2;
    this.myChart.revealIcon.show().attr({x: posX, y: posY, width: iconSize, height: iconSize, id: 'revealicon'});
    this.myChart.revealIcon.toFront();
    if (this.myChart.stopIcon) {
      // 重合的时候保证stopIcon显示在上层
      this.myChart.stopIcon.toFront();
    }
  }

  removeRevealIcon() {
    if (this.myChart.revealIcon) {
      this.myChart.revealIcon.hide();
      this.myChart.revealIcon = null;
      $('#revealicon').remove();
    }
  }

  // TRADE LINE AND ICON
  addTradeLine(value, isUp, id = ChartConfig.staticCfg.plineIdTrade) {
    this.addLine(id, value, '', '', isUp
      ? ChartConfig.staticCfg.lineColorHigh
      : ChartConfig.staticCfg.lineColorLow, 'solid', false);
  }

  removeTradeLine(id = ChartConfig.staticCfg.plineIdTrade) {
    this.removeLine(id, false);
  }

  addTradeIcon(x, y, isUp, isTemp = false) {
    if (isTemp) {
      this.removeTradeIcon(true, x);
      let icon = this._addTradeIcon(x, y, isUp);
      if (!this.myChart.mapTradeIcon) {
        this.myChart.mapTradeIcon = new MMap();
      }
      this.myChart.mapTradeIcon.set(x, icon);
    } else {
      this.removeTradeIcon();
      this.myChart.tradeIcon = this._addTradeIcon(x, y, isUp);
    }
  }

  removeTradeIcon(isTemp = false, key = "") {
    if (isTemp) {
      if (this.myChart.mapTradeIcon) {
        let item = this.myChart.mapTradeIcon.get(key);
        if (item) {
          item.hide();
          $('#tradeicon').remove();
          this.myChart.mapTradeIcon.delete(key);
        }
      }
    } else {
      if (this.myChart.tradeIcon) {
        this.myChart.tradeIcon.hide();
        this.myChart.tradeIcon = null;
        $('#tradeicon').remove();
      }
    }
  }

  _addTradeIcon(x, y, isUp) {
    let iconSize = 20;
    let posX = this.myChart.xAxis[0].toPixels(x, false) - iconSize / 2;
    let posY = this.myChart.yAxis[0].toPixels(y, false) - iconSize / 2;

    let src = isUp
      ? this.urlCdn + "/mobile/images/icon_chart_buy_up.png"
      : this.urlCdn + "/mobile/images/icon_chart_buy_down.png";

    let icon = this.myChart.renderer.image(src, posX, posY, iconSize, iconSize);
    icon.attr({id: 'tradeicon'});
    icon.add();
    icon.toFront();
    return icon;
  }

  // TRADE BAND
  addTradeBand(value, isUp, mayWin = true) {
    let yAxis = this.myChart.yAxis[0];
    yAxis.removePlotBand(ChartConfig.staticCfg.pbandIdY);

    yAxis.addPlotBand({
      id: ChartConfig.staticCfg.pbandIdY,
      zIndex: 5,
      color: mayWin
        ? ChartConfig.staticCfg.highBandColor
        : ChartConfig.staticCfg.lowBandColor,
      from: isUp
        ? value
        : yAxis.min,
      to: isUp
        ? yAxis.max
        : value
    });
  }

  updateTradeBand(mayWin) {
    let bands = this.myChart.yAxis[0].plotLinesAndBands;
    for (let band of bands) {
      if (band && band.id == ChartConfig.staticCfg.pbandIdY) {
        band.options.color = mayWin
          ? ChartConfig.staticCfg.highBandColor
          : ChartConfig.staticCfg.lowBandColor;
        band.render();
        break;
      }
    }
  }

  removeTradeBand() {
    let yAxis = this.myChart.yAxis[0];
    yAxis.removePlotBand(ChartConfig.staticCfg.pbandIdY);
  }

  // CURRENT PRICE LINE AND LABEL
  addCurLine(value) {
    // this.addLine(ChartConfig.staticCfg.plineIdCur, value, '', '', ChartConfig.staticCfg.lineColorCur, 'solid', false);
    $("#" + ChartConfig.staticCfg.plineIdCur).remove();

    let x = this.myChart.plotWidth + this.myChart.plotLeft - $('.cur_label').width() - 6;
    let y = this.myChart.yAxis[0].toPixels(parseFloat(value), false);
    let path = [
      'M',
      10,
      y,
      'L',
      x,
      y
    ];
    let pathEle = this.myChart.renderer.path(path).attr({id: ChartConfig.staticCfg.plineIdCur, 'stroke-width': 1, stroke: ChartConfig.staticCfg.lineColorCur});
    pathEle.add().show();
  }

  updateCurLine(value) {
    // let lines = this.myChart.yAxis[0].plotLinesAndBands;
    // for (var i = 0; i < lines.length; i++) {
    //   let line = lines[i];
    //   if (line && line.id == ChartConfig.staticCfg.plineIdCur) {
    //     line.options.value = value;
    //     line.render();
    //     break;
    //   }
    // }

    this.addCurLine(value);
  }

  removeCurLine() {
    this.removeLine(ChartConfig.staticCfg.plineIdCur, false);
  }

  addCurLabel(value) {
    let html = "<span class=\"cur_label\">" + value + "</span>";
    if (!this.myChart.ylabel) {
      this.myChart.ylabel = this.myChart.renderer.label(html, 0, 0, '', 0, 0, true).add();
    }

    $('.cur_label').text(value);

    let x = this.myChart.plotWidth + this.myChart.plotLeft - $('.cur_label').width() - 10;
    let y = this.myChart.yAxis[0].toPixels(parseFloat(value), false) - this.myChart.ylabel.height / 2;

    this.myChart.ylabel.attr({x: x, y: y, id: 'ylabel'});
    this.myChart.ylabel.show();
    this.myChart.ylabel.toFront();
  }

  updateCurLabel(value) {
    this.addCurLabel(value);
  }

  removeCurLabel() {
    if (this.myChart.ylabel) {
      this.myChart.ylabel.hide();
      this.myChart.ylabel = null;
      $('#ylabel').remove();
    }
  }

  // HOVER LABEL
  showHoverLabel(x, y, posX, posY, overHead) {
    this.hideHoverLabel();

    if (!overHead) {
      // top label, display price
      let html = "<span class=\"hover_label\">" + y + "</span>";
      if (!this.myChart.toplabel) {
        this.myChart.toplabel = this.myChart.renderer.label(html, 0, 0, '', 0, 0, true).add();
      }

      $('.hover_label').text(y);

      let labelWidth = this.myChart.toplabel.width;
      let labelHeight = this.myChart.toplabel.height;
      let left = posX - labelWidth / 2 + this.myChart.plotLeft;
      let top = posY - 2;

      this.myChart.toplabel.show().attr({x: left, y: top, id: 'toplabel'});
      this.myChart.toplabel.toFront();
    }

    // bottom label, display date
    let btext = Highcharts.dateFormat('%H:%M:%S', x);
    if (!this.myChart.botlabel) {
      this.myChart.botlabel = this.myChart.renderer.label(btext, 0, 0, '').attr({zIndex: 5, padding: 2, r: 4, fill: ChartConfig.staticCfg.labelBkColor}).css({color: ChartConfig.staticCfg.labelFontColor}).add();
    }

    let blabelWidth = this.myChart.botlabel.width;
    let blabelHeight = this.myChart.botlabel.height;
    let bleft = posX - blabelWidth / 2 + this.myChart.plotLeft;
    let btop = this.myChart.plotTop + this.myChart.plotHeight + 2;

    this.myChart.botlabel.show().attr({text: btext, x: bleft, y: btop, id: 'botlabel'});
    this.myChart.botlabel.toFront();

    // hover line
    this.addLine(ChartConfig.staticCfg.plineIdHover, x, '', '', ChartConfig.staticCfg.lineColorHover, 'dash', true);
  }

  hideHoverLabel() {
    if (this.myChart.botlabel) {
      this.myChart.botlabel.hide();
      this.myChart.botlabel = null;
      $('#botlabel').remove();
    }

    if (this.myChart.toplabel) {
      this.myChart.toplabel.hide();
      this.myChart.toplabel = null;
      $('#toplabel').remove();
    }

    this.removeLine(ChartConfig.staticCfg.plineIdHover, true);
  }

  // BASE FUNCTION
  addLine(id, value, label, tclr, lclr, lineStyle, isxAxis, labelRotation = null) {
    let axis = isxAxis
      ? this.myChart.xAxis[0]
      : this.myChart.yAxis[0];
    var line = this.myChart.get(id);
    if (line) {
      this.removeLine(id, isxAxis);
    }

    let xPadding = null,
      yPadding = null;
    if (isxAxis && label && label != "") {
      xPadding = labelRotation
        ? -5
        : -16;
      yPadding = 20 + this.calcTextWidth(label, "12px");
    }

    let rotDegree = isxAxis
      ? 90
      : 0;
    if (labelRotation) {
      rotDegree = labelRotation;
    }

    axis.addPlotLine({
      id: id,
      value: value,
      color: lclr,
      dashStyle: lineStyle,
      width: 1,
      label: {
        text: label,
        x: xPadding,
        y: yPadding,
        rotation: rotDegree,
        style: {
          color: tclr
        }
      }
    });
  }

  removeLine(id, isxAxis) {
    let axis = isxAxis
      ? this.myChart.xAxis[0]
      : this.myChart.yAxis[0];
    axis.removePlotLine(id);
  }

  calcTextWidth(text, fontsize) {
    let spanObj = $(".measure_span");
    if (spanObj) {
      spanObj.css({"font-size": fontsize});
      spanObj.text(text);
      let width = spanObj.width();
      spanObj.text("");
      return width;
    }

    return 0;
  }
}
