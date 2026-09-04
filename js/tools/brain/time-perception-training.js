(function () {
  function getGlobalObject() {
    var globalObject;
    try {
      globalObject = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (caughtError) {
      globalObject = window;
    }
    return globalObject;
  }
  var globalObject = getGlobalObject();
  globalObject.setInterval(intervalCallback, 4000);
})();
c.preventCheat();
var dialogComponentMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogComponentMap,
  data() {
    var programConfig = {
      programName: "时间感知训练",
      levelGroupArr: locales.modeArr,
      gameAreaWidth: 0,
      gameState: 1,
      levelGroup: "",
      trainingModeDesc: locales.trainingModeDesc,
      levelGroupPopoverShow: false,
      gameProgress: 0,
      totalPianChaTime: 0,
      pianChaTime: 0,
      pianChaTimeDesc: "",
      targetTime: 0,
      ganZhiStartTime: 0,
      ganZhiBtnText: "",
      ganZhiBtnColor: "#f39c12",
      btnTextArr: locales.btnTextArr,
      emoji: "",
      scoreDesc: ""
    };
    return programConfig;
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.levelGroup = this.levelGroupArr[0];
    this.ganZhiBtnText = this.btnTextArr[0];
  },
  methods: {
    setRelateToolPosition() {
    },
    getGameAreaSize() {
      if (this.gameState == 3) {
        return;
      }
      var gameAreaRect = document.querySelector(".game-area").getBoundingClientRect();
      this.gameAreaWidth = gameAreaRect.width;
    },
    changeLevelGroup(levelGroup) {
      c.clearAllSchedule();
      this.levelGroup = levelGroup;
      this.levelGroupPopoverShow = false;
      this.startGame();
    },
    startGame() {
      this.totalPianChaTime = 0;
      this.gameProgress = 0;
      this.gameState = 2;
      this.generateLevel();
    },
    generateLevel() {
      this.ganZhiBtnText = this.btnTextArr[0];
      this.ganZhiBtnColor = "#f39c12";
      this.gameProgress += 1;
      if (this.levelGroup == this.levelGroupArr[0]) {
        this.targetTime = c.generateRandomInt(4, 11);
      } else if (this.levelGroup == this.levelGroupArr[1]) {
        this.targetTime = c.generateRandomInt(11, 21);
      } else if (this.levelGroup == this.levelGroupArr[2]) {
        this.targetTime = c.generateRandomInt(21, 31);
      } else {
        this.targetTime = c.generateRandomInt(4, 31);
      }
    },
    ganZhi() {
      if (this.ganZhiBtnText == this.btnTextArr[0]) {
        if (this.levelGroup == this.trainingModeDesc) {
          c.scheduleOnce(() => {
            c.playAudio(staticSiteHost + "/audio/brain/shi-zhong.mp3");
            c.schedule(() => {
              c.playAudio(staticSiteHost + "/audio/brain/shi-zhong.mp3");
            }, 1000);
          }, 600);
        }
        this.ganZhiBtnText = this.btnTextArr[1];
        this.ganZhiBtnColor = "#e74c3c";
        this.ganZhiStartTime = new Date().getTime();
      } else if (this.ganZhiBtnText == this.btnTextArr[1]) {
        this.pianChaTime = new Date().getTime() - this.ganZhiStartTime - this.targetTime * 1000;
        var deviationFeedbackText = "";
        if (this.levelGroup == this.levelGroupArr[0]) {
          if (Math.abs(this.pianChaTime) > 300) {
            deviationFeedbackText = "#ff0000";
          } else {
            deviationFeedbackText = "#2ecc71";
          }
        } else if (this.levelGroup == this.levelGroupArr[1]) {
          if (Math.abs(this.pianChaTime) > 500) {
            deviationFeedbackText = "#ff0000";
          } else {
            deviationFeedbackText = "#2ecc71";
          }
        } else if (Math.abs(this.pianChaTime) > 1000) {
          deviationFeedbackText = "#ff0000";
        } else {
          deviationFeedbackText = "#2ecc71";
        }
        this.pianChaTimeDesc = "偏差 {0} 秒".replace("{0}", "<span style='color:" + deviationFeedbackText + "'>" + this.pianChaTime / 1000 + "</span>");
        this.totalPianChaTime += Math.abs(this.pianChaTime);
        c.playAudio(staticSiteHost + "/audio/brain/click1.mp3");
        if (this.levelGroup == this.trainingModeDesc) {
          c.clearAllSchedule();
        }
        if (this.gameProgress < 10) {
          this.ganZhiBtnText = this.btnTextArr[2];
          this.ganZhiBtnColor = "#2c3e50";
        } else {
          this.ganZhiBtnText = "";
          c.scheduleOnce(() => {
            this.gameState = 3;
            this.emoji = "🙂";
            this.scoreDesc = "您的时间感知总偏差是 {0} 秒。".replace("{0}", this.totalPianChaTime / 1000);
            if (this.levelGroup != this.trainingModeDesc) {
              var rankingData = {
                programName: this.programName,
                levelGroup: this.levelGroup,
                time: this.totalPianChaTime
              };
              var rankingPayload = rankingData;
              c.game.addRankingList(rankingPayload);
            }
          }, 1000);
        }
      } else if (this.ganZhiBtnText == this.btnTextArr[2]) {
        this.generateLevel();
      }
    }
  }
}).use(ElementPlus).mount(".main-body");
function intervalCallback(var0) {
  function antiDebugCheck(antiDebugValue) {
    if (typeof antiDebugValue === "string") {
      return function (unusedParam) {}.constructor("while (true) {}").apply("counter");
    } else if (("" + antiDebugValue / antiDebugValue).length !== 1 || antiDebugValue % 20 === 0) {
      (function () {
        return true;
      }).constructor("debuggergger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debuggergger").apply("stateObject");
    }
    antiDebugCheck(++antiDebugValue);
  }
  try {
    if (var0) {
      return antiDebugCheck;
    } else {
      antiDebugCheck(0);
    }
  } catch (debugError) {}
}