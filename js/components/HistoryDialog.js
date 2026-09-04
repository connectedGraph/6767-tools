var historyDialog = {
  name: "history-dialog",
  props: {
    programName: {
      type: String,
      default: ""
    },
    levelGroupDescArr: {
      type: Array,
      default: []
    },
    levelGroupCodeArr: {
      type: Array,
      default: []
    },
    scoreShow: {
      type: Boolean,
      default: true
    },
    scoreText: {
      type: String,
      default: "得分"
    },
    timeShow: {
      type: Boolean,
      default: true
    },
    timeText: {
      type: String,
      default: "用时"
    },
    tooltipTemplate: {
      type: String,
      default: "{第 {0} 关\n用时: {1} 秒\n{2}}"
    }
  },
  data() {
    return {
      dialogVisible: false,
      isLoadingData: false,
      levelGroupIndex: null,
      dataList: null,
      dataListForTable: null,
      tableSize: c.isMobile() ? "small" : "default",
      isLogin: false,
      chartInstance: null,
      resizeHandler: null,
      historyViewStyle: "chart"
    };
  },
  template: "\n        <el-dialog v-model=\"dialogVisible\" width=\"600\" modal-class=\"history-dialog\" v-cloak>\n            <template #header>\n                <div style=\"display:flex;flex-wrap: wrap;\">\n                    <span style='font-size:18px;'>历史记录</span>\n                    <div v-if=\"levelGroupDescArr.length>0\" class=\"flex-center\" style=\"margin-left:5px;\">\n                        <el-dropdown trigger=\"click\" :disabled=\"isLoadingData\" v-on:command=\"showHistory\">\n                            <span class=\"group-head\">\n                                （{{levelGroupDescArr[levelGroupIndex]}}<i class=\"my-icon my-icon-jiantou-down\" style=\"font-size:14px;margin-left:3px;\"></i>）\n                            </span>\n                            <template #dropdown>\n                                <el-dropdown-menu>\n                                    <el-dropdown-item v-for=\"(item,index) in levelGroupDescArr\" :command=\"index\">{{item}}</el-dropdown-item>\n                                </el-dropdown-menu>\n                            </template>\n                        </el-dropdown>\n                    </div>\n                    <el-radio-group v-if=\"!isLoadingData\" v-model=\"historyViewStyle\" v-on:change=\"changeHistoryViewStyle\" size=\"small\" style=\"margin-left:10px;\">\n                        <el-radio-button value=\"chart\" label=\"chart\">折线图</el-radio-button>\n                        <el-radio-button value=\"table\" label=\"table\">表格</el-radio-button>\n                    </el-radio-group>\n                </div>\n            </template>\n            <div v-if=\"!isLogin\" class=\"history-tip\">此功能需要登录，<a href='javascript:;' v-on:click='goSign' style='color: var(--el-color-primary);'>点击登录</a></div>\n            <template v-else>\n                <div v-if=\"isLoadingData\" class=\"history-tip\">正在加载...</div>\n                <template v-if=\"historyViewStyle=='chart'\">\n                    <div v-if=\"!isLoadingData && (dataList==null || dataList.length==0)\" class=\"history-tip\">无数据</div>\n                    <div v-if=\"!isLoadingData && dataList!=null && dataList.length>0\" class=\"chart-wrapper\">\n                        <div class=\"canvas-container\" id=\"canvasContainer\">\n                            <canvas id=\"chartCanvas\"></canvas>\n                            <div class=\"chart-tooltip\" id=\"chartTooltip\"></div>\n                        </div>\n                    </div>\n                </template>\n                <template v-else>\n                    <el-table v-if=\"!isLoadingData\" :data=\"dataListForTable\" empty-text=\"无数据\" :size='tableSize'>\n                        <el-table-column v-if=\"scoreShow\" property=\"score\" :label=\"scoreText\" min-width=\"52\" align=\"center\"></el-table-column>\n                        <el-table-column v-if=\"timeShow\" property=\"time\" :label=\"timeText\" min-width=\"68\" align=\"center\">\n                            <template #default=\"scope\">\n                                {{ msToSec(scope.row.time) }}\n                            </template>\n                        </el-table-column>\n                        <el-table-column property=\"createTime\" label=\"时间\" min-width=\"136\" align=\"center\">\n                            <template #default=\"scope\">\n                                {{ formatTime(scope.row.createTime) }}\n                            </template>\n                        </el-table-column>\n                    </el-table>\n                </template>\n            </template>\n        </el-dialog>\n    ",
  watch: {
    dialogVisible(visible) {
      if (!visible) {
        this.destroyChart();
      }
    }
  },
  beforeUnmount() {
    this.destroyChart();
  },
  methods: {
    showHistory(historyId) {
      if (c.isNullOrEmpty(c.cookie.get("Token"))) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
      let historyViewStyle = c.localStorage.get("historyViewStyle");
      if (!c.isNullOrEmpty(historyViewStyle)) {
        this.historyViewStyle = historyViewStyle;
      }
      if (!c.isNullOrEmpty(historyId)) {
        if (historyId != -1 && this.levelGroupIndex < this.levelGroupCodeArr.length) {
          this.levelGroupIndex = historyId;
        } else {
          this.levelGroupIndex = 0;
        }
      }
      this.dialogVisible = true;
      if (this.isLogin) {
        this.getHistoryData();
      }
    },
    getHistoryData() {
      if (this.isLoadingData) {
        return;
      }
      this.isLoadingData = true;
      c.ajaxPost({
        url: "/NlxlRecord/GetList",
        data: {
          programName: this.programName,
          levelGroup: this.levelGroupIndex != null ? this.levelGroupCodeArr[this.levelGroupIndex] : null,
          takeCount: 1000
        },
        sign: true,
        showLoading: false
      }).then(result => {
        this.dataList = result.data;
        this.dataListForTable = c.clone(result.data).reverse();
        setTimeout(() => {
          if (this.historyViewStyle == "chart") {
            this.renderChart();
          }
        }, 80);
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.isLoadingData = false;
      });
    },
    renderChart() {
      this.destroyChart();
      if (this.dataList == null || this.dataList.length == 0) {
        return;
      }
      const chartCanvasEl = document.getElementById("chartCanvas");
      if (!chartCanvasEl) {
        console.log("canvas is null ");
        return;
      }
      this.chartInstance = new LineChart(chartCanvasEl, {
        lineColor: "#4a6cf7",
        pointColor: "#f56565",
        axisColor: "#4a5568",
        lineWidth: 2,
        pointRadius: 4,
        smallPointRadius: 2,
        marginLeft: 45,
        marginRight: 0,
        marginTop: 10,
        marginBottom: 10,
        yTickCount: 6,
        tickLength: 6,
        fontSize: 13,
        labelColor: "#4a5568",
        cursorColor: "#e53e3e",
        defaultShowCount: 200,
        maxZoomShowCount: 15
      });
      setTimeout(() => {
        this.chartInstance.drawChart(this.dataList, this.tooltipTemplate);
      }, 80);
      this.resizeHandler = this.debounceResize(() => {
        this.chartInstance?.resize();
      }, 120);
      window.addEventListener("resize", this.resizeHandler);
    },
    destroyChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      if (this.resizeHandler) {
        window.removeEventListener("resize", this.resizeHandler);
        this.resizeHandler = null;
      }
    },
    debounceResize(callback, delay) {
      let timerId;
      return function () {
        clearTimeout(timerId);
        timerId = setTimeout(callback, delay);
      };
    },
    goSign() {
      this.dialogVisible = false;
      mainNavVueObj.goSignIn();
    },
    changeHistoryViewStyle(newViewStyle) {
      c.localStorage.set("historyViewStyle", newViewStyle);
      if (newViewStyle == "chart") {
        setTimeout(() => {
          this.renderChart();
        }, 80);
      } else {
        this.destroyChart();
      }
    },
    formatTime(timestamp) {
      const dateObj = new Date(timestamp);
      const padZero = num => String(num).padStart(2, "0");
      return dateObj.getFullYear() + "-" + padZero(dateObj.getMonth() + 1) + "-" + padZero(dateObj.getDate()) + " " + padZero(dateObj.getHours()) + ":" + padZero(dateObj.getMinutes()) + ":" + padZero(dateObj.getSeconds());
    },
    msToSec(milliseconds) {
      return Number((milliseconds / 1000).toFixed(3)) + "秒";
    }
  }
};
class LineChart {
  static DEFAULTS = {
    lineColor: "#2a6df4",
    pointColor: "#f56565",
    axisColor: "#3d4a5c",
    lineWidth: 2.8,
    pointRadius: 4.5,
    smallPointRadius: 2.2,
    marginLeft: 60,
    marginRight: 18,
    marginTop: 18,
    marginBottom: 44,
    yTickCount: 5,
    tickLength: 6,
    fontSize: 13,
    labelColor: "#4a5568",
    tooltipFontSize: 14,
    tooltipBgColor: "rgba(0,0,0,0.82)",
    tooltipTextColor: "#ffffff",
    tooltipPadding: 12,
    tooltipLineHeight: 28,
    cursorColor: "#e53e3e",
    defaultShowCount: 300,
    maxZoomShowCount: 20,
    dragThreshold: 2
  };
  constructor(historyData, options = {}) {
    if (!historyData) {
      throw new Error("LineChart: 需要传入 canvas 元素");
    }
    this.canvas = historyData;
    this.ctx = historyData.getContext("2d");
    this._cfg = Object.assign({}, LineChart.DEFAULTS, options);
    this._data = [];
    this._viewYValues = [];
    this._globalMinY = 0;
    this._globalMaxY = 1;
    this._viewStartIndex = 0;
    this._viewShowCount = 0;
    this._tooltipTemplate = "{0}";
    this._drawX = 0;
    this._drawY = 0;
    this._drawWidth = 0;
    this._drawHeight = 0;
    this._xScale = 0;
    this._yScale = 0;
    this._currentPointRadius = this._cfg.pointRadius;
    this._touchMode = "none";
    this._lastTouchDist = 0;
    this._lastSingleX = 0;
    this._isDragging = false;
    this._dragStartX = 0;
    this._dragStartIndex = 0;
    this._cursorIndex = -1;
    this._tooltipEl = document.getElementById("chartTooltip");
    if (!this._tooltipEl) {
      this._tooltipEl = document.createElement("div");
      this._tooltipEl.className = "chart-tooltip";
      document.getElementById("canvasContainer").appendChild(this._tooltipEl);
    }
    this._dpr = 1;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
    this._bindEvents();
    this._resize();
  }
  get config() {
    return this._cfg;
  }
  drawChart(chartData, template = "{0}") {
    if (!chartData || chartData.length === 0) {
      console.warn("LineChart: 数据为空");
      return;
    }
    this._data = chartData.slice();
    this._tooltipTemplate = template || "{0}";
    this._calcGlobalYRange();
    this._viewShowCount = Math.min(this._cfg.defaultShowCount, this._data.length);
    this._viewStartIndex = Math.max(0, this._data.length - this._viewShowCount);
    this._updateView();
    this._hideTooltip();
    this._cursorIndex = -1;
  }
  resetChart() {
    this._data = [];
    this._viewYValues = [];
    this._globalMinY = 0;
    this._globalMaxY = 1;
    this._viewStartIndex = 0;
    this._viewShowCount = 0;
    this._cursorIndex = -1;
    this._hideTooltip();
    this._clearCanvas();
  }
  resize() {
    this._resize();
    if (this._data.length > 0) {
      this._updateView();
    }
  }
  _resize() {
    const canvasRect = this.canvas.getBoundingClientRect();
    const canvasParent = this.canvas.parentElement;
    const parentRect = canvasParent.getBoundingClientRect();
    this._dpr = window.devicePixelRatio || 1;
    const containerWidth = parentRect.width || 800;
    const sixtyPercentWidth = containerWidth * 0.6;
    this.canvas.width = containerWidth * this._dpr;
    this.canvas.height = sixtyPercentWidth * this._dpr;
    this.canvas.style.width = containerWidth + "px";
    this.canvas.style.height = sixtyPercentWidth + "px";
    this._canvasWidth = containerWidth;
    this._canvasHeight = sixtyPercentWidth;
    this.ctx.scale(this._dpr, this._dpr);
    this._calcLayout();
  }
  _calcLayout() {
    const config = this._cfg;
    const canvasWidth = this._canvasWidth;
    const canvasHeight = this._canvasHeight;
    this._drawX = config.marginLeft;
    this._drawY = config.marginTop;
    this._drawWidth = canvasWidth - config.marginLeft - config.marginRight;
    this._drawHeight = canvasHeight - config.marginTop - config.marginBottom;
    if (this._drawWidth < 10) {
      this._drawWidth = 10;
    }
    if (this._drawHeight < 10) {
      this._drawHeight = 10;
    }
  }
  _calcGlobalYRange() {
    const yValues = this._data.map(dataItem => this._extractY(dataItem));
    let yAxisMaxValue = 0;
    let maxDataValue = Math.max(...yValues, 0);
    if (maxDataValue === 0) {
      maxDataValue = 1;
    }
    const rangePadding = (maxDataValue - yAxisMaxValue) * 0.1;
    maxDataValue = maxDataValue + rangePadding;
    maxDataValue = Math.ceil(maxDataValue);
    this._globalMinY = yAxisMaxValue;
    this._globalMaxY = maxDataValue;
  }
  _extractY(dataPoint) {
    if (dataPoint.score !== null && dataPoint.score !== undefined) {
      return dataPoint.score;
    }
    if (dataPoint.time !== undefined) {
      return dataPoint.time / 1000;
    }
    return 0;
  }
  _formatTime(timeValue) {
    const parsedDate = new Date(timeValue);
    const padToTwoDigits = numberToPad => String(numberToPad).padStart(2, "0");
    return parsedDate.getFullYear() + "-" + padToTwoDigits(parsedDate.getMonth() + 1) + "-" + padToTwoDigits(parsedDate.getDate()) + " " + padToTwoDigits(parsedDate.getHours()) + ":" + padToTwoDigits(parsedDate.getMinutes()) + ":" + padToTwoDigits(parsedDate.getSeconds());
  }
  _msToSec(msValue) {
    return Number((msValue / 1000).toFixed(3));
  }
  _updateView() {
    if (!this._data.length) {
      this._clearCanvas();
      return;
    }
    const viewData = this._data.slice(this._viewStartIndex, this._viewStartIndex + this._viewShowCount);
    this._viewYValues = viewData.map(dataPoint => this._extractY(dataPoint));
    this._currentPointRadius = this._viewYValues.length > 20 ? this._cfg.smallPointRadius : this._cfg.pointRadius;
    const viewYValuesCount = this._viewYValues.length;
    this._xScale = viewYValuesCount === 1 ? 0 : this._drawWidth / (viewYValuesCount - 1);
    const yRange = this._globalMaxY - this._globalMinY || 1;
    this._yScale = this._drawHeight / yRange;
    this._drawAll();
  }
  _clearCanvas() {
    const canvasCtx = this.ctx;
    canvasCtx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
  }
  _drawAll() {
    const ctx = this.ctx;
    const canvasWidth = this._canvasWidth;
    const canvasHeight = this._canvasHeight;
    const config = this._cfg;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.beginPath();
    ctx.rect(this._drawX, this._drawY, this._drawWidth, this._drawHeight);
    ctx.clip();
    if (this._viewYValues.length >= 2) {
      ctx.beginPath();
      ctx.lineWidth = config.lineWidth;
      ctx.strokeStyle = config.lineColor;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const startPos = this._getPos(0);
      ctx.moveTo(startPos.x, startPos.y);
      for (let yValueIndex = 1; yValueIndex < this._viewYValues.length; yValueIndex++) {
        const currentPos = this._getPos(yValueIndex);
        ctx.lineTo(currentPos.x, currentPos.y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = config.pointColor;
    for (let viewYIndex = 0; viewYIndex < this._viewYValues.length; viewYIndex++) {
      const pos = this._getPos(viewYIndex);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this._currentPointRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    this._drawAxes(ctx);
    if (this._cursorIndex >= 0 && this._cursorIndex < this._viewYValues.length) {
      this._drawCursor(ctx);
    }
    this._drawTickLabels(ctx);
  }
  _getPos(index) {
    const xPos = this._drawX + index * this._xScale;
    const viewYValue = this._viewYValues[index];
    const yPos = this._drawY + this._drawHeight - (viewYValue - this._globalMinY) * this._yScale;
    return {
      x: xPos,
      y: yPos
    };
  }
  _drawAxes(axesConfig) {
    const chartConfig = this._cfg;
    const {
      _drawX: drawX,
      _drawY: drawY,
      _drawWidth: drawWidth,
      _drawHeight: drawHeight
    } = this;
    const chartBottomY = drawY + drawHeight;
    axesConfig.save();
    axesConfig.lineWidth = 2;
    axesConfig.strokeStyle = chartConfig.axisColor;
    axesConfig.fillStyle = chartConfig.axisColor;
    axesConfig.beginPath();
    axesConfig.moveTo(drawX, chartBottomY);
    axesConfig.lineTo(drawX + drawWidth, chartBottomY);
    axesConfig.stroke();
    axesConfig.beginPath();
    axesConfig.moveTo(drawX, chartBottomY);
    axesConfig.lineTo(drawX, drawY);
    axesConfig.stroke();
    const tickValues = this._calcTickValues();
    const yRange = this._globalMaxY - this._globalMinY || 1;
    for (const tickValue of tickValues) {
      const tickYPos = chartBottomY - (tickValue - this._globalMinY) / yRange * drawHeight;
      if (tickYPos >= drawY && tickYPos <= chartBottomY) {
        axesConfig.beginPath();
        axesConfig.moveTo(drawX, tickYPos);
        axesConfig.lineTo(drawX - chartConfig.tickLength, tickYPos);
        axesConfig.stroke();
      }
    }
    axesConfig.restore();
  }
  _calcTickValues() {
    const maxY = this._globalMaxY;
    const yTickCount = this._cfg.yTickCount;
    const ticks = [];
    if (maxY <= 0) {
      return [0];
    }
    const factorList = [];
    let startValue = 1;
    while (startValue <= maxY * 10) {
      factorList.push(startValue);
      factorList.push(startValue * 2);
      factorList.push(startValue * 5);
      startValue *= 10;
    }
    factorList.sort((firstValue, secondValue) => firstValue - secondValue);
    let candidateFactor = 1;
    for (const stepSize of factorList) {
      const endValue = Math.floor(maxY / stepSize) * stepSize;
      const stepCount = Math.floor(endValue / stepSize) + 1;
      if (stepCount <= yTickCount) {
        candidateFactor = stepSize;
        for (let currentValue = 0; currentValue <= endValue; currentValue += stepSize) {
          ticks.push(currentValue);
        }
        break;
      }
    }
    if (ticks.length === 0) {
      ticks.push(0, maxY);
    }
    return [...new Set(ticks)];
  }
  _drawTickLabels(tickLabels) {
    const drawConfig = this._cfg;
    const {
      _drawX: drawX,
      _drawY: drawY,
      _drawHeight: drawHeight
    } = this;
    const bottomY = drawY + drawHeight;
    const tickValues = this._calcTickValues();
    const ySpan = this._globalMaxY - this._globalMinY || 1;
    tickLabels.save();
    tickLabels.font = drawConfig.fontSize + "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    tickLabels.textAlign = "right";
    tickLabels.textBaseline = "middle";
    tickLabels.fillStyle = drawConfig.labelColor;
    for (const currentTickValue of tickValues) {
      const tickY = bottomY - (currentTickValue - this._globalMinY) / ySpan * drawHeight;
      if (tickY >= drawY && tickY <= bottomY) {
        let tickLabel = Math.round(currentTickValue).toString();
        if (currentTickValue >= 1000) {
          tickLabel = Number((currentTickValue / 1000).toFixed(1)).toString() + "k";
        }
        tickLabels.fillText(tickLabel, drawX - drawConfig.tickLength - 8, tickY);
      }
    }
    tickLabels.restore();
  }
  _drawCursor(canvasContext) {
    if (this._cursorIndex < 0 || this._cursorIndex >= this._viewYValues.length) {
      return;
    }
    const cursorPosition = this._getPos(this._cursorIndex);
    const viewConfig = this._cfg;
    const {
      _drawX: drawXPos,
      _drawY: drawY,
      _drawHeight: drawHeight
    } = this;
    const bottomY = drawY + drawHeight;
    canvasContext.save();
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = viewConfig.cursorColor;
    canvasContext.setLineDash([5, 5]);
    canvasContext.beginPath();
    canvasContext.moveTo(cursorPosition.x, bottomY);
    canvasContext.lineTo(cursorPosition.x, drawY);
    canvasContext.stroke();
    canvasContext.setLineDash([]);
    canvasContext.strokeStyle = viewConfig.cursorColor;
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.arc(cursorPosition.x, cursorPosition.y, this._currentPointRadius + 3, 0, Math.PI * 2);
    canvasContext.stroke();
    canvasContext.restore();
  }
  _updateTooltip(tooltipEl, tooltipX, tooltipY) {
    if (tooltipEl < 0 || tooltipEl >= this._viewYValues.length) {
      this._hideTooltip();
      return;
    }
    const targetIndex = this._viewStartIndex + tooltipEl;
    const historyRecord = this._data[targetIndex];
    if (!historyRecord) {
      this._hideTooltip();
      return;
    }
    const tooltipTemplate = this._tooltipTemplate;
    let tooltipHtml = "";
    const scoreValue = historyRecord.score;
    const timeMs = historyRecord.time;
    const createTimeStamp = historyRecord.createTime || Date.now();
    const formattedTime = this._formatTime(createTimeStamp);
    if (scoreValue === null || scoreValue === undefined) {
      const timeInSeconds = this._msToSec(timeMs);
      tooltipHtml = tooltipTemplate.replace(/\{0\}/g, timeInSeconds).replace(/\{1\}/g, formattedTime);
    } else if (timeMs !== null && timeMs !== undefined) {
      const seconds = this._msToSec(timeMs);
      tooltipHtml = tooltipTemplate.replace(/\{0\}/g, scoreValue).replace(/\{1\}/g, seconds).replace(/\{2\}/g, formattedTime);
    } else {
      tooltipHtml = tooltipTemplate.replace(/\{0\}/g, scoreValue).replace(/\{1\}/g, formattedTime);
    }
    const targetPos = this._getPos(tooltipEl);
    const canvasRect = this.canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / this._canvasWidth;
    const scaleY = canvasRect.height / this._canvasHeight;
    const targetLeft = canvasRect.left + targetPos.x * scaleX;
    const targetTop = canvasRect.top + targetPos.y * scaleY;
    const tooltipElement = this._tooltipEl;
    tooltipElement.innerHTML = tooltipHtml.replace(/\\n/g, "<br/>");
    tooltipElement.classList.add("visible");
    const tooltipWidth = tooltipElement.offsetWidth || 200;
    const tooltipHeight = tooltipElement.offsetHeight || 50;
    let adjustedLeft = targetLeft - tooltipWidth / 2;
    let tooltipTop = targetTop - tooltipHeight - 16;
    const containerRect = this.canvas.parentElement.getBoundingClientRect();
    if (adjustedLeft < containerRect.left + 8) {
      adjustedLeft = containerRect.left + 8;
    }
    if (adjustedLeft + tooltipWidth > containerRect.right - 8) {
      adjustedLeft = containerRect.right - 8 - tooltipWidth;
    }
    if (tooltipTop < containerRect.top + 8) {
      tooltipTop = containerRect.top + 8;
    }
    tooltipElement.style.left = adjustedLeft - containerRect.left + "px";
    tooltipElement.style.top = tooltipTop - containerRect.top + "px";
  }
  _hideTooltip() {
    this._tooltipEl.classList.remove("visible");
  }
  _getNearestIndex(targetX) {
    const yValuesLength = this._viewYValues.length;
    if (yValuesLength === 0) {
      return -1;
    }
    const clampedX = Math.min(Math.max(targetX, this._drawX), this._drawX + this._drawWidth);
    let nearestPointIndex = 0;
    let minDistance = Infinity;
    for (let yIndex = 0; yIndex < yValuesLength; yIndex++) {
      const pointX = this._drawX + yIndex * this._xScale;
      const distanceX = Math.abs(clampedX - pointX);
      if (distanceX < minDistance) {
        minDistance = distanceX;
        nearestPointIndex = yIndex;
      }
    }
    return nearestPointIndex;
  }
  _bindEvents() {
    const canvasEl = this.canvas;
    canvasEl.addEventListener("mousedown", this._onMouseDown.bind(this));
    window.addEventListener("mousemove", this._onMouseMove.bind(this));
    window.addEventListener("mouseup", this._onMouseUp.bind(this));
    canvasEl.addEventListener("wheel", this._onWheel.bind(this), {
      passive: false
    });
    canvasEl.addEventListener("touchstart", this._onTouchStart.bind(this), {
      passive: false
    });
    canvasEl.addEventListener("touchmove", this._onTouchMove.bind(this), {
      passive: false
    });
    canvasEl.addEventListener("touchend", this._onTouchEnd.bind(this), {
      passive: false
    });
    canvasEl.addEventListener("touchcancel", this._onTouchEnd.bind(this), {
      passive: false
    });
    const resizeObserver = new ResizeObserver(() => this._resize());
    resizeObserver.observe(canvasEl.parentElement);
    this._resizeObserver = resizeObserver;
  }
  _onMouseDown(mouseDownEvent) {
    if (this._viewYValues.length === 0) {
      return;
    }
    const mouseDownCanvasRect = this.canvas.getBoundingClientRect();
    const canvasScaleX = this._canvasWidth / mouseDownCanvasRect.width;
    const canvasX = (mouseDownEvent.clientX - mouseDownCanvasRect.left) * canvasScaleX;
    this._touchMode = "single";
    this._lastSingleX = canvasX;
    this._isDragging = true;
    this._dragStartX = canvasX;
    this._dragStartIndex = this._viewStartIndex;
    const nearestIndex = this._getNearestIndex(canvasX);
    if (nearestIndex >= 0) {
      this._cursorIndex = nearestIndex;
      this._updateTooltip(nearestIndex, mouseDownEvent.clientX, mouseDownEvent.clientY);
      this._drawAll();
    }
    mouseDownEvent.preventDefault();
  }
  _onMouseMove(mouseMoveEvent) {
    const canvasBoundingRect = this.canvas.getBoundingClientRect();
    const canvasScaleXMove = this._canvasWidth / canvasBoundingRect.width;
    const scaledPointerX = (mouseMoveEvent.clientX - canvasBoundingRect.left) * canvasScaleXMove;
    const isPointerInBounds = mouseMoveEvent.clientX >= canvasBoundingRect.left && mouseMoveEvent.clientX <= canvasBoundingRect.right && mouseMoveEvent.clientY >= canvasBoundingRect.top && mouseMoveEvent.clientY <= canvasBoundingRect.bottom;
    if (!isPointerInBounds) {
      if (this._touchMode === "none") {
        this._hideTooltip();
        if (this._cursorIndex >= 0) {
          this._cursorIndex = -1;
          this._drawAll();
        }
      }
      return;
    }
    if (this._touchMode === "single" && this._isDragging) {
      const scaledDeltaX = scaledPointerX - this._lastSingleX;
      const xScale = this._xScale;
      if (Math.abs(scaledDeltaX) > 2 && xScale > 0) {
        const indexDelta = Math.round(scaledDeltaX / xScale);
        let newViewStartIndex = this._viewStartIndex - indexDelta;
        newViewStartIndex = Math.max(0, Math.min(newViewStartIndex, this._data.length - this._viewShowCount));
        if (newViewStartIndex !== this._viewStartIndex) {
          this._viewStartIndex = newViewStartIndex;
          this._updateView();
          const mouseMoveCanvasRect = this.canvas.getBoundingClientRect();
          const canvasWidthScale = this._canvasWidth / mouseMoveCanvasRect.width;
          const canvasPointerX = (mouseMoveEvent.clientX - mouseMoveCanvasRect.left) * canvasWidthScale;
          const nearestDownIndex = this._getNearestIndex(canvasPointerX);
          if (nearestDownIndex >= 0) {
            this._cursorIndex = nearestDownIndex;
            this._updateTooltip(nearestDownIndex, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
          }
        }
        this._lastSingleX = scaledPointerX;
      }
    } else if (this._touchMode === "none") {
      const nearestHoverIndex = this._getNearestIndex(scaledPointerX);
      if (nearestHoverIndex >= 0 && nearestHoverIndex !== this._cursorIndex) {
        this._cursorIndex = nearestHoverIndex;
        this._updateTooltip(nearestHoverIndex, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
        this._drawAll();
      } else if (nearestHoverIndex >= 0) {
        this._updateTooltip(nearestHoverIndex, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
      }
    }
  }
  _onMouseUp(mouseUpEvent) {
    if (this._touchMode === "single") {
      this._isDragging = false;
      this._touchMode = "none";
    }
  }
  _onWheel(wheelEvent) {
    wheelEvent.preventDefault();
    if (this._data.length === 0 || this._viewYValues.length === 0) {
      return;
    }
    const zoomStep = wheelEvent.deltaY > 0 ? 0.9 : 1.1;
    const zoomCanvasRect = this.canvas.getBoundingClientRect();
    const zoomScaleX = this._canvasWidth / zoomCanvasRect.width;
    const mouseCanvasX = (wheelEvent.clientX - zoomCanvasRect.left) * zoomScaleX;
    const worldX = (mouseCanvasX - this._drawX) / this._xScale;
    const pointerIndex = this._viewStartIndex + worldX;
    let newShowCount = Math.round(this._viewShowCount / zoomStep);
    newShowCount = Math.max(this._cfg.maxZoomShowCount, Math.min(newShowCount, this._data.length));
    let viewStartIndex = Math.round(pointerIndex - newShowCount / 2);
    viewStartIndex = Math.max(0, Math.min(viewStartIndex, this._data.length - newShowCount));
    this._viewShowCount = newShowCount;
    this._viewStartIndex = viewStartIndex;
    this._updateView();
    const wheelCanvasRect = this.canvas.getBoundingClientRect();
    const wheelScaleX = this._canvasWidth / wheelCanvasRect.width;
    const wheelCanvasX = (wheelEvent.clientX - wheelCanvasRect.left) * wheelScaleX;
    const wheelNearestIndex = this._getNearestIndex(wheelCanvasX);
    if (wheelNearestIndex >= 0) {
      this._cursorIndex = wheelNearestIndex;
      this._updateTooltip(wheelNearestIndex, wheelEvent.clientX, wheelEvent.clientY);
    }
  }
  _onTouchStart(touchEvent) {
    if (this._viewYValues.length === 0) {
      return;
    }
    const touches = touchEvent.touches;
    const canvasRectForTouchStart = this.canvas.getBoundingClientRect();
    const canvasScaleForTouchStart = this._canvasWidth / canvasRectForTouchStart.width;
    if (touches.length === 1) {
      this._touchMode = "single";
      const firstTouch = touches[0];
      const relativeX = (firstTouch.clientX - canvasRectForTouchStart.left) * canvasScaleForTouchStart;
      this._lastSingleX = relativeX;
      this._isDragging = true;
      this._dragStartX = relativeX;
      this._dragStartIndex = this._viewStartIndex;
      const relativeNearestIndex = this._getNearestIndex(relativeX);
      if (relativeNearestIndex >= 0) {
        this._cursorIndex = relativeNearestIndex;
        this._updateTooltip(relativeNearestIndex, firstTouch.clientX, firstTouch.clientY);
        this._drawAll();
      }
    } else if (touches.length >= 2) {
      this._touchMode = "double";
      const firstTouchStart = touches[0];
      const secondTouchStart = touches[1];
      const firstTouchStartPosition = {
        x: (firstTouchStart.clientX - canvasRectForTouchStart.left) * canvasScaleForTouchStart,
        y: 0
      };
      const secondTouchStartPosition = {
        x: (secondTouchStart.clientX - canvasRectForTouchStart.left) * canvasScaleForTouchStart,
        y: 0
      };
      this._lastTouchDist = Math.hypot(firstTouchStartPosition.x - secondTouchStartPosition.x, 0);
      this._hideTooltip();
      this._cursorIndex = -1;
    }
    touchEvent.preventDefault();
  }
  _onTouchMove(touchMoveEvent) {
    if (this._viewYValues.length === 0) {
      return;
    }
    const touchList = touchMoveEvent.touches;
    const canvasRectForTouchMove = this.canvas.getBoundingClientRect();
    const canvasScaleForTouchMove = this._canvasWidth / canvasRectForTouchMove.width;
    if (this._touchMode === "single" && touchList.length === 1) {
      const pointerEvent = touchList[0];
      const currentGraphX = (pointerEvent.clientX - canvasRectForTouchMove.left) * canvasScaleForTouchMove;
      if (this._isDragging) {
        const deltaX = currentGraphX - this._lastSingleX;
        const xScale = this._xScale;
        if (Math.abs(deltaX) > 2 && xScale > 0) {
          const deltaIndices = Math.round(deltaX / xScale);
          let newViewStartIndex = this._viewStartIndex - deltaIndices;
          newViewStartIndex = Math.max(0, Math.min(newViewStartIndex, this._data.length - this._viewShowCount));
          if (newViewStartIndex !== this._viewStartIndex) {
            this._viewStartIndex = newViewStartIndex;
            this._updateView();
            const canvasRectForPointer = this.canvas.getBoundingClientRect();
            const canvasScale = this._canvasWidth / canvasRectForPointer.width;
            const pointerCanvasX = (pointerEvent.clientX - canvasRectForPointer.left) * canvasScale;
            const pointerNearestIndex = this._getNearestIndex(pointerCanvasX);
            if (pointerNearestIndex >= 0) {
              this._cursorIndex = pointerNearestIndex;
              this._updateTooltip(pointerNearestIndex, pointerEvent.clientX, pointerEvent.clientY);
            }
          }
          this._lastSingleX = currentGraphX;
        }
      }
    } else if (this._touchMode === "double" && touchList.length >= 2) {
      const pinchFirstTouch = touchList[0];
      const secondTouch = touchList[1];
      const firstTouchPos = {
        x: (pinchFirstTouch.clientX - canvasRectForTouchMove.left) * canvasScaleForTouchMove,
        y: 0
      };
      const secondTouchPos = {
        x: (secondTouch.clientX - canvasRectForTouchMove.left) * canvasScaleForTouchMove,
        y: 0
      };
      const touchXDistance = Math.hypot(firstTouchPos.x - secondTouchPos.x, 0);
      const distanceRatio = touchXDistance / this._lastTouchDist;
      const touchMidX = (firstTouchPos.x + secondTouchPos.x) / 2;
      const midXOffset = (touchMidX - this._drawX) / this._xScale;
      const zoomedViewStartIndex = this._viewStartIndex + midXOffset;
      let newViewShowCount = Math.round(this._viewShowCount / distanceRatio);
      newViewShowCount = Math.max(this._cfg.maxZoomShowCount, Math.min(newViewShowCount, this._data.length));
      let targetStartIndex = Math.round(zoomedViewStartIndex - newViewShowCount / 2);
      targetStartIndex = Math.max(0, Math.min(targetStartIndex, this._data.length - newViewShowCount));
      this._viewShowCount = newViewShowCount;
      this._viewStartIndex = targetStartIndex;
      this._updateView();
      this._lastTouchDist = touchXDistance;
    }
    touchMoveEvent.preventDefault();
  }
  _onTouchEnd(touchEndEvent) {
    this._touchMode = "none";
    this._isDragging = false;
  }
  zoomIn() {
    if (this._data.length === 0) {
      return;
    }
    const zoomedShowCount = Math.max(this._cfg.maxZoomShowCount, Math.round(this._viewShowCount * 0.7));
    if (zoomedShowCount === this._viewShowCount) {
      return;
    }
    const zoomCenterIndex = this._viewStartIndex + this._viewShowCount / 2;
    let zoomStartIndex = Math.round(zoomCenterIndex - zoomedShowCount / 2);
    zoomStartIndex = Math.max(0, Math.min(zoomStartIndex, this._data.length - zoomedShowCount));
    this._viewShowCount = zoomedShowCount;
    this._viewStartIndex = zoomStartIndex;
    this._updateView();
    this._cursorIndex = -1;
    this._hideTooltip();
  }
  zoomOut() {
    if (this._data.length === 0) {
      return;
    }
    const shrunkShowCount = Math.min(this._data.length, Math.round(this._viewShowCount / 0.7));
    if (shrunkShowCount === this._viewShowCount) {
      return;
    }
    const shrinkCenterIndex = this._viewStartIndex + this._viewShowCount / 2;
    let shrinkStartIndex = Math.round(shrinkCenterIndex - shrunkShowCount / 2);
    shrinkStartIndex = Math.max(0, Math.min(shrinkStartIndex, this._data.length - shrunkShowCount));
    this._viewShowCount = shrunkShowCount;
    this._viewStartIndex = shrinkStartIndex;
    this._updateView();
    this._cursorIndex = -1;
    this._hideTooltip();
  }
  resetView() {
    if (this._data.length === 0) {
      return;
    }
    this._viewShowCount = Math.min(this._cfg.defaultShowCount, this._data.length);
    this._viewStartIndex = Math.max(0, this._data.length - this._viewShowCount);
    this._updateView();
    this._cursorIndex = -1;
    this._hideTooltip();
  }
  getDataCount() {
    return this._data.length;
  }
  getViewRange() {
    return {
      start: this._viewStartIndex,
      count: this._viewShowCount,
      total: this._data.length
    };
  }
  destroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    this._hideTooltip();
  }
}