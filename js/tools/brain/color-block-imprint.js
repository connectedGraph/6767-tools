c.preventCheat();
(function () {
  var globalObject;
  try {
    var globalThisRef = Function("return (function() {}.constructor(\"return this\")( ));");
    globalObject = globalThisRef();
  } catch (error) {
    globalObject = window;
  }
  globalObject.setInterval(intervalCallback, 4000);
})();
var dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    var programMeta = {
      programName: "色块印记",
      levelGroupIndex: 0,
      levelGroupDescArr: locales.levelGroupDescArr,
      levelGroupCodeArr: ["不旋转矩阵", "旋转矩阵"],
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameProgress: 1,
      lives: 3,
      gamePlayObj: null,
      targetBlockIndexArr: [],
      tapedBlockIndexArr: [],
      allowTap: false,
      resultTipIcon: "",
      resultTipColor: "",
      resultTipShow: false,
      emoji: "",
      scoreDesc: ""
    };
    return programMeta;
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
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
      this.levelGroupIndex = levelGroup;
      if (this.gameState == 2) {
        this.startGame();
      }
    },
    startGame() {
      c.clearAllSchedule();
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.gameProgress = 1;
      this.gameState = 2;
      this.lives = 3;
      c.scheduleOnce(() => {
        this.gamePlayObj = document.querySelector(".color-block-box");
        this.generateLevel();
      }, 80);
    },
    generateLevel() {
      this.resultTipShow = false;
      this.gamePlayObj.style.right = "-300px";
      this.gamePlayObj.style.opacity = 0;
      this.gamePlayObj.style.rotate = "0deg";
      this.gamePlayObj.style.transform = "scale(1)";
      var gamePlayOptions = {
        targets: this.gamePlayObj,
        right: 0,
        opacity: 1,
        duration: 300,
        easing: "easeInOutSine"
      };
      anime(gamePlayOptions);
      let progressStep = 3;
      if (this.gameProgress <= 1) {
        progressStep = 3;
      } else if (this.gameProgress <= 3) {
        progressStep = 4;
      } else if (this.gameProgress <= 6) {
        progressStep = 5;
      } else if (this.gameProgress <= 10) {
        progressStep = 6;
      } else if (this.gameProgress <= 15) {
        progressStep = 7;
      } else if (this.gameProgress <= 20) {
        progressStep = 8;
      } else if (this.gameProgress <= 25) {
        progressStep = 9;
      } else {
        progressStep = 10;
      }
      this.targetBlockIndexArr = c.generateRandomNumbers(0, 25, progressStep);
      this.tapedBlockIndexArr = c.clone(this.targetBlockIndexArr);
      c.scheduleOnce(() => {
        this.tapedBlockIndexArr = [];
        if (this.levelGroupIndex == 0) {
          this.allowTap = true;
        } else {
          let randomOffset = 0;
          while (randomOffset == 0) {
            randomOffset = c.generateRandomInt(-3, 4);
          }
          console.log(randomOffset);
          console.log(Math.abs(randomOffset) * 800);
          anime({
            targets: this.gamePlayObj,
            rotate: randomOffset * 90,
            scale: [{
              value: 0.707,
              duration: 300
            }, {
              value: 0.707,
              duration: Math.abs(randomOffset) * 800 - 600
            }, {
              value: 1,
              duration: 300
            }],
            duration: Math.abs(randomOffset) * 800,
            easing: "easeInOutSine",
            complete: completeCallback => {
              this.allowTap = true;
            }
          });
        }
      }, 2000);
    },
    clickColorBlock(clickedColorBlock) {
      console.log(clickedColorBlock);
      if (!this.allowTap || this.tapedBlockIndexArr.includes(clickedColorBlock)) {
        return;
      }
      if (this.targetBlockIndexArr.includes(clickedColorBlock)) {
        this.gameEndTime = new Date().getTime();
        this.tapedBlockIndexArr.push(clickedColorBlock);
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        if (this.targetBlockIndexArr.length == this.tapedBlockIndexArr.length) {
          this.allowTap = false;
          this.resultTipIcon = "✔";
          this.resultTipColor = "#2AAD67";
          this.resultTipShow = true;
          c.scheduleOnce(() => {
            this.gameProgress++;
            anime({
              targets: this.gamePlayObj,
              right: 300,
              opacity: 0,
              duration: 300,
              easing: "easeInOutSine",
              complete: completeHandler => {
                this.generateLevel();
              }
            });
          }, 500);
        }
      } else {
        this.allowTap = false;
        this.resultTipIcon = "✖";
        this.resultTipColor = "#f00";
        this.resultTipShow = true;
        this.lives--;
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        if (this.lives == 0) {
          c.clearAllSchedule();
          c.scheduleOnce(() => {
            let previousGameProgress = this.gameProgress - 1;
            var progressEmoji = "";
            if (previousGameProgress <= 2) {
              progressEmoji = "😥";
            } else if (previousGameProgress <= 10) {
              progressEmoji = "🙂";
            } else {
              progressEmoji = "👏";
              c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
            }
            this.emoji = progressEmoji;
            this.scoreDesc = "您通过了 " + previousGameProgress + " 个关卡，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒。";
            this.gameState = 3;
            var rankingData = {
              programName: this.programName,
              levelGroup: this.levelGroupCodeArr[this.levelGroupIndex],
              score: previousGameProgress,
              time: this.gameEndTime - this.gameStartTime
            };
            var rankingDataRef = rankingData;
            c.game.addRankingList(rankingDataRef);
          }, 500);
        } else {
          c.scheduleOnce(() => {
            anime({
              targets: this.gamePlayObj,
              right: 300,
              opacity: 0,
              duration: 300,
              easing: "easeInOutSine",
              complete: doneCallback => {
                this.generateLevel();
              }
            });
          }, 500);
        }
      }
    }
  }
}).use(ElementPlus).mount(".main-body");
function intervalCallback(var0) {
  function antiDebugCheck(debugValue) {
    if (typeof debugValue === "string") {
      return function (unusedParam) {}.constructor("while (true) {}").apply("counter");
    } else if (("" + debugValue / debugValue).length !== 1 || debugValue % 20 === 0) {
      (function () {
        return true;
      }).constructor("debuggergger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debuggergger").apply("stateObject");
    }
    antiDebugCheck(++debugValue);
  }
  try {
    if (var0) {
      return antiDebugCheck;
    } else {
      antiDebugCheck(0);
    }
  } catch (caughtError) {}
}