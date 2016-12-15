export default class ChartConfig {}

ChartConfig.signal = {
  PREPARE: 1,
  SHOW: 2,
  STOP_TRADE: 3,
  REVEAL: 4,
  END: 5
}

ChartConfig.staticCfg = {
  serIdData: "series_id_data",
  serIdMarker: "series_id_marker",
  plineIdStop: "plotline_id_stop",
  plineIdReveal: "plotline_id_reveal",
  plineIdCur: "plotline_id_current",
  plineIdHover: "plotline_id_hover",
  plineIdTrade: "plotline_id_trade",
  pbandIdY: "plotband_id_yaxis",

  titleFontColor: "white",

  chartBkColor: "#000f15",
  chartBorderColor: "rgba(255, 255, 255, 0.2)",
  chartGridLineColor: "rgba(255, 255, 255, 0.1)",
  seriesLineColor: "rgba(255, 201, 0, 0.6)",
  seriesFillColor: "rgba(255, 201, 0, 0.05)",

  lineColorStop: "#7a8285",
  lineColorReveal: "red",
  lineColorHover: "rgba(255, 201, 0, 0.6)",
  lineColorCur: "#aaaaaa",
  lineColorLow: "rgba(255, 0, 0, 0.5)",
  lineColorHigh: "rgba(0, 187, 0, 0.5)",

  stopFontColor: "#a8aaab",
  revealFontColor: "#e90102",

  labelBkColor: "#666666",
  labelFontColor: "#f7f7f7",
  labelAxisFontColor: "#6c6d6d",

  lowBandColor: "rgba(255, 0, 0, 0.2)",
  highBandColor: "rgba(0, 187, 0, 0.2)",

  marker_rad_data: 2.5,
  marker_color_data: "#ffc900",

  marker_rad_mark: 2.8,
  marker_color_mark: "#ffffff",

  tickAmount: 8
};
