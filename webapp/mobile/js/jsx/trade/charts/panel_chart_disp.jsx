import React from "react";
import $ from "jquery";
import HighStockChart from "highcharts";
import Highcharts from "highcharts";
import Config from "../../config/config";
import LangClient from "../../tools/Lang-Client";
import MMap from "../../tools/mmap";
import ChartConfig from "./chart_config";
import ChartGraphics from "./chart_graphics";

const ERROR_EXPIRED = 1;

export default class ChartView extends React.Component {
  constructor(props) {
    super(props);

    // 传入
    this.tradeCode = "";
    this.tradeType = 0;
    this.timePointId = 0;

    this.serverTime = 0; // 当前系统时间

    this.minTime = 0; // 时间轴上的最小值
    this.maxTime = 0; // 时间轴上的最大值

    this.stopTradeTime = 0; // 停止交易时间，单位：毫秒
    this.revealTime = 0; // 揭晓时间，单位：毫秒

    this.positionMode = false; // 持仓模式
    this.tradePoint = null; // 建仓点数据

    this.boughtPointArr = []; // 建仓点，非持仓模式的时候

    // 自有
    this.ready = false;

    this.originWidth = 0;
    this.originHeight = 0;

    this.overHead = false;

    this.markerAnimId = 0;
    this.curAlpha = 1.0;
    this.toBig = false;

    this.secondsPerPoint = 1; // 数据点时间间隔
    this.pointIndex = 0;

    this.pixelThresHold = 20; // 相邻点y轴落差，小于落差的点可以考虑忽略（点比较密集的情况下）
    this.priceThresHold = 0; // 相邻点价格差，根据pixelThresHold计算得到

    this.yDecimal = 0; // y轴显示精度
    this.tickMinute = false; // x轴是否按分钟显示
  }

  showToast(text) {
    $(".toast").html(text).fadeIn().delay(3e3).fadeOut();
  }

  componentDidMount() {
    this.initCharts();
  }

  getTradeCode() {
    return this.tradeCode;
  }

  getTradeType() {
    return this.tradeType;
  }

  isPositionMode() {
    return this.positionMode;
  }

  getTradeInfoInPos() {
    if (this.positionMode && this.tradePoint) {
      return this.tradePoint;
    }

    return null;
  }

  //////////////////////////////////////////////////////////////////////////////
  // callback
  // 1, maxTime <= serverTime, need refresh
  checkError(error) {
    this.props.onError(error, this.tradeCode, this.tradeType, this.positionMode);
  }

  // 1, reached stopTradeTime
  // 2, reached revealTime
  // 3, reached maxTime
  checkSignal(curPointTime) {
    let signal = 0;
    if (this.tradeType == 1) {
      // 短期期权
      if (this.positionMode) {
        // 持仓查看模式，判断是否到达揭晓时间和maxTime
        if (curPointTime >= this.maxTime * 1000) {
          signal = ChartConfig.signal.END;
        } else if (curPointTime >= this.revealTime * 1000) {
          signal = ChartConfig.signal.REVEAL;
        }
      } else {
        // 没有交易停止线和揭晓线，只判断是否到达maxTime
        if (curPointTime >= this.maxTime * 1000) {
          signal = ChartConfig.signal.END;
        }
      }
    } else if (this.tradeType == 2) {
      // 买涨买跌，三个时间点都判断
      if (curPointTime >= this.maxTime * 1000) {
        signal = ChartConfig.signal.END;
      } else if (curPointTime >= this.revealTime * 1000) {
        signal = ChartConfig.signal.REVEAL;
      } else if (curPointTime >= this.stopTradeTime * 1000) {
        signal = ChartConfig.signal.STOP_TRADE;
      }
    }

    if (signal > 0) {
      if (!this.positionMode || (this.positionMode && signal != ChartConfig.signal.STOP_TRADE)) {
        this.setReady(false);
      }

      this.props.onSignal(signal, this.tradeCode, this.tradeType, this.positionMode);
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // show curve interface
  showCurve(tradeCode, tradeType, timePointId, endTime, stopTradeTime = 0, revealTime = 0, tradeInfo = null) {
    if (!tradeCode || !tradeType || !timePointId || !endTime) {
      // console.log("Show curve error: invalid param");
      return;
    }

    if ((endTime <= this.serverTime) || (!tradeInfo && stopTradeTime && stopTradeTime <= this.serverTime)) {
      // console.log("Invalid timestamp for request kline-data: ", endTime);
      this.checkError(ERROR_EXPIRED);
      return;
    }

    if (tradeInfo && revealTime <= this.serverTime) {
      // console.log("Reveal time param invalid for position mode: ", revealTime);
      return;
    }

    this.tradeCode = tradeCode;
    this.tradeType = tradeType;
    this.timePointId = timePointId;
    this.maxTime = endTime;
    this.stopTradeTime = stopTradeTime;
    this.revealTime = revealTime;
    this.tradePoint = tradeInfo;
    this.positionMode = tradeInfo
      ? true
      : false;

    this._requestCurveData();
  }

  _requestCurveData() {
    this.setReady(false);

    this.myChart.reflow();
    // this.myChart.showLoading(LangClient.i18n("Loading..."));

    let _host = Config.host[Config.env];
    let _url = "//" + _host + Config.api.trade.k_line_history2;

    $.post(_url, {
      name: this.tradeCode,
      time_point_id: this.timePointId,
      expiry_time: this.maxTime,
      lang: Cookie.getCookie("language") || "en"
    }, (data, state, resp) => {
      this.myChart.hideLoading();
      this.clearChart();

      this.props.onSignal(ChartConfig.signal.PREPARE, this.tradeCode, this.tradeType, this.positionMode);

      if (data.status != 1) {
        if (data.msg) {
          this.myChart.showLoading(data.msg);
        } else {
          this.myChart.showLoading(LangClient.i18n("loading failed") + " " + LangClient.i18n("Please hit F5 to refresh"));
        }
        return;
      }

      if (!data.data || data.data.length == 0) {
        return;
      }

      let _seriesData = [];
      data.data.map((val, index) => {
        if (val.end_price == null || val.end_price === "undefined") {
          return;
        }

        if (this.yDecimal == 0) {
          // 在parseFloat之前计算yDecimal，parseFloat后得到的值可能精度变了
          this.yDecimal = this.getDecimalLength(val.end_price);
        }

        let _price = parseFloat(val.end_price);
        _seriesData.push([
          parseInt(val.end_time) * 1000,
          parseFloat(_price)
        ]);
      });

      if (_seriesData.length > 0) {
        this.secondsPerPoint = this.calcSecondsPerPoint(_seriesData);
        this._showCurveInChart(_seriesData);
      }
    });
  }

  _showCurveInChart(seriesData) {
    let len = seriesData.length;
    if (len == 0) {
      return;
    }

    // update chart data before inserted into the plot
    this.checkPositionPoint(seriesData);

    // update xaxis tick
    this.minTime = seriesData[0][0] / 1000;
    this.myChart.xAxis[0].update({tickPositions: this.getTickPositons()});
    this.myChart.xAxis[0].setExtremes(this.minTime * 1000, this.maxTime * 1000);

    // add data series
    this.addDataSeries(seriesData);

    // add marker series
    this.addMarkerSeries([seriesData[len - 1]]);
    this.setMarkerAnimation();

    // add stop and reveal lines
    if (this.stopTradeTime && this.stopTradeTime < this.maxTime) {
      this.chartGraphics.addStopLine(this.stopTradeTime * 1000);
      this.chartGraphics.addStopIcon(this.stopTradeTime * 1000);
    }

    if (this.revealTime && this.revealTime < this.maxTime) {
      this.chartGraphics.addRevealLine(this.revealTime * 1000);
      this.chartGraphics.addRevealIcon(this.revealTime * 1000);
    }

    // add current-value line and label
    let lastPrice = seriesData[len - 1][1];
    if (this.serverTime < this.maxTime) {
      this.chartGraphics.addCurLine(lastPrice);

      lastPrice = Number(lastPrice).toFixed(this.yDecimal);
      this.chartGraphics.addCurLabel(lastPrice);
    }

    // add trade line and icon if exists
    this.addPositionInfo(lastPrice);

    this.setReady(true);
    this.props.onSignal(ChartConfig.signal.SHOW, this.tradeCode, this.tradeType, this.positionMode);
  }

  updateXAxis() {
    let offset = Math.ceil((this.maxTime - this.minTime) / 7.0 * 4.0);
    this.minTime += offset;
    this.maxTime += offset;
    this.myChart.xAxis[0].update({tickPositions: this.getTickPositons()});
    this.myChart.xAxis[0].setExtremes(this.minTime * 1000, this.maxTime * 1000);
    this.myChart.redraw();
    this.setReady(true);
  }

  clearChart() {
    this.secondsPerPoint = 1;
    this.yDecimal = 0;
    this.tickMinute = false;

    this.clearTempMarker();

    var dataSer = this.myChart.get(ChartConfig.staticCfg.serIdData);
    if (dataSer != null) {
      dataSer.remove(true);
    }

    var markerSer = this.myChart.get(ChartConfig.staticCfg.serIdMarker);
    if (markerSer != null) {
      markerSer.remove(true);
    }

    this.chartGraphics.removeStopLine();
    this.chartGraphics.removeStopIcon();
    this.chartGraphics.removeRevealLine();
    this.chartGraphics.removeRevealIcon();

    this.chartGraphics.removeCurLine();
    this.chartGraphics.removeCurLabel();

    this.chartGraphics.removeTradeIcon();
    this.chartGraphics.removeTradeLine();
    this.chartGraphics.removeTradeBand();
  }

  checkPositionPoint(seriesData) {
    if (this.positionMode) {
      let tradePt = [
        parseInt(this.tradePoint.opentime) * 1000,
        parseFloat(this.tradePoint.openprice)
      ];

      let insertIdx = 0;
      for (var i = seriesData.length - 1; i >= 0; i--) {
        if (tradePt[0] == seriesData[i][0]) {
          insertIdx = -1;
          break;
        } else if (tradePt[0] > seriesData[i][0]) {
          insertIdx = i + 1;
          break
        }
      }

      if (insertIdx >= 0) {
        if (insertIdx < seriesData.length) {
          seriesData.splice(insertIdx, 0, tradePt);
        } else {
          seriesData.push(tradePt);
        }
      }
    }
  }

  addPositionInfo(lastPrice) {
    if (this.positionMode) {
      let priceTime = parseInt(this.tradePoint.opentime) * 1000;
      let tradePrice = parseFloat(this.tradePoint.openprice);
      let isUp = this.tradePoint.direction == "high"
        ? true
        : false;
      let mayWin = (isUp && tradePrice <= lastPrice) || (!isUp && tradePrice >= lastPrice);

      this.chartGraphics.addTradeLine(tradePrice, isUp);
      this.chartGraphics.addTradeIcon(priceTime, tradePrice, isUp);
      this.chartGraphics.addTradeBand(tradePrice, isUp, mayWin);
    }
  }

  addDataSeries(seriesData) {
    this.myChart.addSeries({
      id: ChartConfig.staticCfg.serIdData,
      type: 'area',
      lineWidth: 1,
      color: ChartConfig.staticCfg.seriesLineColor,
      fillColor: ChartConfig.staticCfg.seriesFillColor,
      threshold: null,
      showInLegend: false,
      data: seriesData,
      marker: {
        symbol: 'circle',
        radius: ChartConfig.staticCfg.marker_rad_data,
        fillColor: ChartConfig.staticCfg.marker_color_data,
        states: {
          hover: {
            lineWidth: 0,
            lineWidthPlus: 0,
            radius: ChartConfig.staticCfg.marker_rad_data,
            radiusPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      }
    });
  }

  addMarkerSeries(seriesData) {
    this.myChart.addSeries({
      id: ChartConfig.staticCfg.serIdMarker,
      marker: {
        enabled: true,
        symbol: 'circle',
        radius: ChartConfig.staticCfg.marker_rad_mark,
        fillColor: ChartConfig.staticCfg.marker_color_data,
        states: {
          hover: {
            enabled: false
          }
        }
      },
      data: seriesData
    });
  }

  calcSecondsPerPoint(chartsData) {
    let len = chartsData.length
    if (len > 0) {
      let timeBegin = chartsData[0][0];
      let timeEnd = chartsData[len - 1][0];
      let secondsPerPoint = Math.round((timeEnd - timeBegin) / 1000 / len);

      return secondsPerPoint > 1
        ? secondsPerPoint
        : 1;
    }

    return 1;
  }

  getDecimalLength(value) {
    let str = value.toString();
    let arr = str.split(".");
    return arr.length > 1
      ? arr[1].length
      : 0;
  }

  getTickPositons() {
    var arr = [];
    let inter = (this.maxTime - this.minTime) / (ChartConfig.staticCfg.tickAmount - 1);
    for (var i = 0; i < ChartConfig.staticCfg.tickAmount; i++) {
      arr.push(Math.floor(this.minTime + i * inter) * 1000);
    }
    arr[0] = this.minTime * 1000;
    arr[ChartConfig.staticCfg.tickAmount - 1] = this.maxTime * 1000;

    this.tickMinute = true;
    for (var i = 0; i < arr.length; i++) {
      let date = new Date(arr[i]);
      if (date.getSeconds() != 0) {
        this.tickMinute = false;
        break;
      }
    }

    return arr;
  }

  setReady(value) {
    this.ready = value;
  }

  isReady() {
    return this.ready;
  }

  setMarkerAnimation() {
    if (this.markerAnimId > 0) {
      return;
    }

    let _that = this;
    this.markerAnimId = setInterval(function() {
      let maxValue = 1,
        minValue = 0.5;
      let value = _that.toBig
        ? _that.curAlpha + 0.17
        : _that.curAlpha - 0.17;
      if (value >= maxValue) {
        _that.toBig = false;
        value = maxValue;
      } else if (value <= minValue) {
        _that.toBig = true;
        value = minValue;
      }
      _that.curAlpha = value;

      let color = "rgba(255, 255, 255, " + Number(_that.curAlpha).toFixed(2) + ")";

      let series = _that.myChart.get(ChartConfig.staticCfg.serIdMarker);
      if (series) {
        series.update({
          marker: {
            fillColor: color
          }
        });
      }
    }, 333);
  }

  clearMarkerAnimation() {
    if (this.markerAnimId > 0) {
      clearInterval(this.markerAnimId);
      this.markerAnimId = 0;

      this.curAlpha = 1.0;
      this.toBig = false;

      let series = this.myChart.get(ChartConfig.staticCfg.serIdMarker);
      if (series) {
        series.update({
          marker: {
            fillColor: ChartConfig.staticCfg.marker_color_data
          }
        });
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // data drive
  update(data, timestamp) {
    this.serverTime = timestamp;

    if (!this.isReady() || !data) {
      return;
    }

    let socketData = [
      [
        data.timestamp * 1000,
        parseFloat(data.price)
      ]
    ];
    this._onUpdate(socketData);
  }

  _onUpdate(socketData) {
    let socLen = socketData.length;
    if (!this.myChart || !socLen) {
      return;
    }

    this.myChart.reflow();

    var yAxis = this.myChart.yAxis[0];
    var series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    if (!series) {
      return;
    }

    var len = series.data.length;
    if (len <= 0) {
      // kline的数据还未返回
      return;
    }

    // 判断时间信息，过滤无效的数据点
    let lastPt = series.data[len - 1];
    let newDataArr = [];
    for (var i = 0; i < socLen; i++) {
      let socData = socketData[i];
      if (socData[0] <= lastPt.x) {
        // 时间只增不减
        continue;
      }

      newDataArr.push([socData[0], socData[1]]);
    }

    let newLen = newDataArr.length;
    if (newLen == 0) {
      return;
    }

    // add point
    for (var i = 0; i < newLen; i++) {
      series.addPoint(newDataArr[i], i == newLen - 1
        ? true
        : false, false);

      // 给新增的点设置id，方便后续逻辑的查找
      let newPoint = series.data[series.data.length - 1];
      if (newPoint) {
        newPoint.id = this.getPointId(this.pointIndex++);
      }
    }

    // check whether some points should be removed
    this.checkExtraPoints(series);

    // update current point marker
    lastPt = series.data[series.data.length - 1];
    var seriesM = this.myChart.get(ChartConfig.staticCfg.serIdMarker);
    if (seriesM) {
      seriesM.data[0].update([
        lastPt.x, lastPt.y
      ], true);
    }

    // update current price line and label
    this.chartGraphics.updateCurLine(lastPt.y);

    let value = lastPt.y;
    value = Number(value).toFixed(this.yDecimal);
    this.chartGraphics.updateCurLabel(value);

    if (this.positionMode) {
      let tradePrice = this.tradePoint.openprice;
      let isUp = this.tradePoint.direction == "high"
        ? true
        : false;
      let mayWin = (isUp && tradePrice <= value) || (!isUp && tradePrice >= value);
      this.chartGraphics.addTradeBand(tradePrice, isUp, mayWin);
    }

    // check whether reached time node
    this.checkSignal(lastPt.x);
  }

  checkExtraPoints(series) {
    if (this.pointIndex >= this.secondsPerPoint && this.secondsPerPoint > 1) {
      this.pointIndex = 0;
      for (var i = 0; i < this.secondsPerPoint - 1; i++) {
        let id = this.getPointId(i);
        let point = this.myChart.get(id);
        if (point) {
          let index = point.index;
          if (index > 0) {
            let prePoint = series.points[index - 1];
            if (prePoint) {
              let value = Math.abs(point.y - prePoint.y).toFixed(this.yDecimal);
              value = parseFloat(value);
              if (value >= this.priceThresHold) {
                continue;
              }
            }
          }
          point.remove();
        }
      }
    }
  }

  getPointId(index) {
    return "id_new_point_" + index;
  }

  //////////////////////////////////////////////////////////////////////////////
  // init
  initCharts() {
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    let _that = this;
    this.myChart = new HighStockChart.Chart({
      chart: {
        animation: Highcharts.svg,
        backgroundColor: ChartConfig.staticCfg.chartBkColor,
        renderTo: this.refs.charts,
        marginTop: 3,
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        plotBorderColor: ChartConfig.staticCfg.chartBorderColor,
        style: {
          // fontSize: 18,
          fontFamily: 'inherit'
        },
        events: {
          redraw: function() {
            _that.onChartRedraw();
          }
        }
      },
      loading: {
        labelStyle: {
          fontWeight: 'bold',
          color: ChartConfig.staticCfg.titleFontColor
        },
        style: {
          backgroundColor: ChartConfig.staticCfg.chartBkColor
        }
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false,
        animation: false,
        shared: true,
        formatter: function() {
          return this.y;
        }
      },
      scrollbar: {
        enabled: false
      },
      navigator: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            // 移动端暂时不处理mouse over的逻辑
            // events: {
            //   mouseOver: function() {
            //     _that.onPointMouseOver(this);
            //   },
            //   mouseOut: function() {
            //     _that.onPointMouseOut(this);
            //   }
            // }
          },
          marker: {
            enabled: false
          },
          lineWidth: 1,
          states: {
            hover: {
              enabled: true,
              lineWidth: 1,
              radius: 0,
              halo: {
                size: 0
              }
            }
          }
        }
      },
      xAxis: {
        lineWidth: 0,
        gridLineWidth: 1,
        gridLineColor: ChartConfig.staticCfg.chartGridLineColor,
        gridLineDashStyle: 'dash',
        type: 'linear',
        startOnTick: true,
        endOnTick: true,
        tickLength: 0,
        tickWidth: 0,
        labels: {
          y: 15,
          style: {
            color: ChartConfig.staticCfg.labelAxisFontColor,
            textOverflow: "none"
          },
          formatter: function() {
            let tickPositions = this.axis.tickPositions;
            let index = tickPositions.indexOf(this.value);
            if (index % 2 == 0) {
              return "";
            }

            let format = _that.tickMinute
              ? "%H:%M"
              : "%H:%M:%S";
            return Highcharts.dateFormat(format, this.value);
          }
        },
        events: {
          afterSetExtremes: function(event) {
            _that.onSetExtremes(event, true);
          }
        }
      },
      yAxis: {
        opposite: true,
        gridLineWidth: 1,
        gridLineColor: ChartConfig.staticCfg.chartGridLineColor,
        gridLineDashStyle: 'dash',
        tickAmount: 6,
        labels: {
          y: 12,
          x: -45,
          style: {
            color: ChartConfig.staticCfg.labelAxisFontColor
          },
          formatter: function() {
            if (this.isFirst) {
              return "";
            }
            return Number(this.value).toFixed(_that.yDecimal);
          }
        },
        title: {
          text: ''
        },
        events: {
          afterSetExtremes: function(event) {
            _that.onSetExtremes(event, false);
          }
        }
      },
      series: [
        {
          id: ChartConfig.staticCfg.serIdData,
          showInLegend: false,
          type: "area",
          lineWidth: 1,
          color: ChartConfig.staticCfg.seriesLineColor,
          fillColor: ChartConfig.staticCfg.seriesFillColor,
          tooltip: {
            valueDecimals: 2
          },
          data: []
        }
      ]
    });

    // init chart graphics helper object
    this.chartGraphics = new ChartGraphics(this.myChart);

    // add event listener
    // 移动端暂时不处理mouse over的逻辑
    // window.addEventListener("mousemove", (event) => {
    //   this.checkOutChart(event);
    // });
  }

  checkOutChart(event) {
    let chart = this.myChart;
    if (chart) {
      let e = chart.pointer.normalize(event);
      let isInside = chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop);
      if (!isInside) {
        this.chartGraphics.hideHoverLabel();
      }
    }
  }

  onChartRedraw() {
    let width = this.myChart.plotWidth;
    let height = this.myChart.plotHeight;

    let series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    if (series == null || series.data.length == 0) {
      return;
    }

    if (width != this.originWidth || height != this.originHeight) {
      this.originWidth = width;
      this.originHeight = height;
      this.chartWindowChanged();
    }
  }

  onPointMouseOver(point) {
    let id = point.series.options.id;
    if (id == ChartConfig.staticCfg.serIdMarker) {
      return;
    }

    if (!this.overHead) {
      let isLastPt = this.isLastPt(point.x, point.y);
      if (isLastPt) {
        this.clearMarkerAnimation();
      }

      let price = Number(parseFloat(point.y)).toFixed(this.yDecimal);
      this.chartGraphics.showHoverLabel(point.x, price, point.plotX, point.plotY, false);
    }
  }

  onPointMouseOut(point) {
    let id = point.series.options.id;
    if (id == ChartConfig.staticCfg.serIdMarker) {
      return;
    }

    let isLastPt = this.isLastPt(point.x, point.y);
    if (isLastPt) {
      this.setMarkerAnimation();
    }

    this.chartGraphics.hideHoverLabel();
  }

  onSetExtremes(event, isXAxis) {
    if (!isXAxis) {
      this.priceThresHold = parseFloat((event.max - event.min) * this.pixelThresHold / this.myChart.plotHeight).toFixed(this.yDecimal);
      this.priceThresHold = parseFloat(this.priceThresHold);
    }

    this.chartWindowChanged();
  }

  chartWindowChanged() {
    // 坐标轴发生变化或窗口大小发生变化
    this.updateIconAndLabels();
    this.updateTempMarker();
  }

  updateIconAndLabels() {
    let series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    let length = series
      ? series.data.length
      : 0;
    if (length == 0) {
      return;
    }

    this.chartGraphics.removeTradeBand();
    this.chartGraphics.removeTradeIcon();
    this.chartGraphics.removeStopIcon();
    this.chartGraphics.removeRevealIcon();
    this.chartGraphics.removeCurLabel();

    let lastPrice = series.data[length - 1].y;

    if (this.positionMode) {
      let tradePrice = this.tradePoint.openprice;
      let priceTime = parseInt(this.tradePoint.opentime) * 1000;
      let expTime = parseInt(this.tradePoint.expiretime) * 1000;
      let isUp = this.tradePoint.direction == "high"
        ? true
        : false;
      let mayWin = (isUp && tradePrice <= lastPrice) || (!isUp && tradePrice >= lastPrice);

      let expired = this.serverTime > expTime;
      if (!expired) {
        this.chartGraphics.addTradeBand(this.tradePoint.price, isUp, mayWin);
        this.chartGraphics.addTradeIcon(priceTime, tradePrice, isUp);
      } else {
        this.chartGraphics.removeTradeLine();
      }
    }

    if (this.stopTradeTime > 0) {
      this.chartGraphics.addStopIcon(this.stopTradeTime * 1000);
    }

    if (this.revealTime > 0) {
      this.chartGraphics.addRevealIcon(this.revealTime * 1000);
    }

    if (this.serverTime < this.maxTime) {
      lastPrice = Number(lastPrice).toFixed(this.yDecimal);
      this.chartGraphics.updateCurLabel(lastPrice);
    }
  }

  isLastPt(x, y) {
    let series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    if (series) {
      let len = series.data.length;
      if (len > 0) {
        let lastPt = series.data[len - 1];
        if (lastPt.x == x && lastPt.y == y) {
          return true;
        }
      }
    }

    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // temp trade point interface
  addTempTradePoint(tradeInfo) {
    if (this.positionMode || !tradeInfo) {
      return;
    }

    let id = tradeInfo.id;
    let instru = tradeInfo.instrument;
    let catId = parseInt(tradeInfo.tradecat);
    let price = parseFloat(tradeInfo.openprice);
    let expTime = parseInt(tradeInfo.expiretime) * 1000;
    let openTime = parseInt(tradeInfo.opentime) * 1000;
    if (instru != this.tradeCode || catId != this.tradeType || this.serverTime >= expTime) {
      return;
    }

    for (var i = 0; i < this.boughtPointArr.length; i++) {
      if (this.boughtPointArr[i].id == id) {
        return;
      }
    }

    this.boughtPointArr.push(tradeInfo);

    let series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    let lastPt = series.data[series.data.length - 1];
    if (openTime > lastPt.x) {
      // 插入一个数据点
      this._onUpdate([
        [openTime, price]
      ]);
    }

    this.updateTempMarker();
  }

  updateTempMarker() {
    for (var i = 0; i < this.boughtPointArr.length; i++) {
      let data = this.boughtPointArr[i];
      if (!data) {
        continue;
      }

      let id = data.id;
      let price = parseFloat(data.openprice);
      let time = parseInt(data.opentime) * 1000;
      let isUp = data.direction == "high"
        ? true
        : false;
      let expTime = parseInt(data.expiretime);
      let expired = this.serverTime >= expTime;

      let lineId = "pline_temp_id_" + id;
      if (!expired) {
        this.chartGraphics.addTradeLine(price, isUp, lineId);
        this.chartGraphics.addTradeIcon(time, price, isUp, true);
      } else {
        this.chartGraphics.removeTradeLine(lineId);
        this.chartGraphics.removeTradeIcon(true, time);
      }
    }
  }

  clearTempMarker() {
    for (var i = 0; i < this.boughtPointArr.length; i++) {
      let data = this.boughtPointArr[i];
      if (!data) {
        continue;
      }

      let id = data.id;
      let time = parseInt(data.opentime) * 1000;

      let lineId = "pline_temp_id_" + id;
      this.chartGraphics.removeTradeLine(lineId);
      this.chartGraphics.removeTradeIcon(true, time);
    }

    this.boughtPointArr = [];
  }

  onMouseMove(event) {
    // 移动端暂时不处理mouse over的逻辑
    return;

    if (!this.myChart) {
      return;
    }

    var series = this.myChart.get(ChartConfig.staticCfg.serIdData);
    if (!series) {
      return;
    }

    var chart = this.myChart;
    let e = chart.pointer.normalize(event);

    let posX = e.chartX - chart.plotLeft;
    let posY = e.chartY - chart.plotTop;
    let x = chart.xAxis[0].toValue(e.chartX);
    let y = chart.yAxis[0].toValue(e.chartY);
    let isInside = chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop);

    let data = series.data;
    let lastX = chart.xAxis[0].min;
    if (data.length > 0) {
      lastX = data[data.length - 1].x;
    }
    this.overHead = x > lastX;

    if (isInside) {
      if (this.overHead) {
        this.chartGraphics.showHoverLabel(x, y, posX, posY, true);
      }
    } else {
      this.chartGraphics.hideHoverLabel();
    }
  }

  render() {
    return (
      <div className="panel chart">
        <div ref="charts" id="charts" onMouseMove={this.onMouseMove.bind(this)}></div>
        <span className="measure_span"></span>
      </div>
    );
  }
}
