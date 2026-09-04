(function () {
  const createIntervalManager = function () {
    let globalObject;
    try {
      globalObject = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (error) {
      globalObject = window;
    }
    return globalObject;
  };
  const intervalManager = createIntervalManager();
  intervalManager.setInterval(intervalCallback, 4000);
})();
c.preventCheat();
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    const gameConfig = {
      programName: "坐标迷航",
      levelGroupArr: locales.modeArr,
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      levelGroup: "",
      gameProgress: 1,
      gamePlayObj: null,
      tapedBlockIndexArr: [],
      tapedErrorBlockIndex: null,
      allowTap: false,
      daoHangCount: 5,
      feiChuan1Show: false,
      feiChuan1PositionIndex: 0,
      jianTou1Show: false,
      jianTou1Rotate: 0,
      feiChuan2Show: false,
      feiChuan2PositionIndex: 0,
      jianTou2Show: false,
      jianTou2Rotate: 0,
      emoji: "",
      scoreDesc: "",
      beatPercent: null
    };
    return gameConfig;
  },
  computed: {
    feiChuanFontSize() {
      return (this.gameAreaWidth - 30 - 60) / 7 + "px";
    },
    feiChuanLineHeight() {
      return (this.gameAreaWidth - 30) / 7 + "px";
    },
    jianTouFontSize() {
      if (this.levelGroup == this.levelGroupArr[0]) {
        return this.gameAreaWidth + "px";
      } else {
        return this.gameAreaWidth / 2 + "px";
      }
    },
    jianTouLineHeight() {
      if (this.levelGroup == this.levelGroupArr[0]) {
        return this.gameAreaWidth + "px";
      } else {
        return this.gameAreaWidth / 2 + "px";
      }
    },
    jianTouTop() {
      if (this.levelGroup == this.levelGroupArr[0]) {
        return "0";
      } else {
        return "25%";
      }
    }
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.levelGroup = this.levelGroupArr[0];
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
      c.scheduleOnce(() => {
        this.gamePlayObj = document.querySelector(".color-block-box");
        this.generateLevel();
      }, 80);
    },
    generateLevel() {
      this.tapedBlockIndexArr = [];
      this.tapedErrorBlockIndex = null;
      this.feiChuan1Show = true;
      this.jianTou1Show = false;
      this.jianTou2Show = false;
      this.jianTou1Transform = "rotate(0deg)";
      this.jianTou2Transform = "rotate(0deg)";
      if (this.levelGroup == this.levelGroupArr[0]) {
        this.feiChuan2Show = false;
        this.feiChuan1PositionIndex = 24;
        this.feiChuan2PositionIndex = 1000;
      } else {
        this.feiChuan2Show = true;
        this.feiChuan1PositionIndex = 23;
        this.feiChuan2PositionIndex = 25;
      }
      this.gamePlayObj.style.right = "-300px";
      this.gamePlayObj.style.opacity = 0;
      this.gamePlayObj.style.rotate = "0deg";
      this.gamePlayObj.style.transform = "scale(1)";
      const gamePlayData = {
        targets: this.gamePlayObj,
        right: 0,
        opacity: 1,
        duration: 300,
        easing: "easeInOutSine"
      };
      anime(gamePlayData);
      this.daoHangCount = 3 + Math.floor(this.gameProgress / 2);
      c.scheduleOnce(() => {
        this.feiChuan1Show = false;
        this.feiChuan2Show = false;
        let driftInterval = 1500 - this.gameProgress * 100;
        if (driftInterval < 500) {
          driftInterval = 500;
        }
        let scheduleHandle = c.schedule(() => {
          let feiChuan1Direction = this.getFangXiang(this.feiChuan1PositionIndex);
          let feiChuan1PosRotate = this.getOositionAndRotate(feiChuan1Direction, this.feiChuan1PositionIndex, this.jianTou1Rotate);
          this.feiChuan1PositionIndex = feiChuan1PosRotate.positionIndex;
          this.jianTou1Rotate = feiChuan1PosRotate.rotate;
          this.jianTou1Show = true;
          if (this.levelGroup == this.levelGroupArr[1]) {
            let feiChuan2Direction = this.getFangXiang(this.feiChuan2PositionIndex);
            while (this.daoHangCount == 1 && feiChuan1Direction == feiChuan2Direction) {
              feiChuan2Direction = this.getFangXiang(this.feiChuan2PositionIndex);
            }
            feiChuan1PosRotate = this.getOositionAndRotate(feiChuan2Direction, this.feiChuan2PositionIndex, this.jianTou2Rotate);
            this.feiChuan2PositionIndex = feiChuan1PosRotate.positionIndex;
            this.jianTou2Rotate = feiChuan1PosRotate.rotate;
            this.jianTou2Show = true;
          }
          this.daoHangCount--;
          c.scheduleOnce(() => {
            this.jianTou1Show = false;
            this.jianTou2Show = false;
            if (this.daoHangCount == 0) {
              this.allowTap = true;
              c.clearSchedule(scheduleHandle);
            }
          }, driftInterval * 0.7);
        }, driftInterval, true, this.daoHangCount - 1);
      }, 1500);
    },
    getFangXiang(directionIndex) {
      let availableDirections = [0, 1, 2, 3, 4, 5, 6, 7];
      if (directionIndex <= 6) {
        availableDirections = availableDirections.filter(directionCandidate => directionCandidate != 0);
        availableDirections = availableDirections.filter(directionOption => directionOption != 1);
        availableDirections = availableDirections.filter(currentDrift => currentDrift != 7);
      }
      if (directionIndex % 7 == 6) {
        availableDirections = availableDirections.filter(item => item != 1);
        availableDirections = availableDirections.filter(driftValue => driftValue != 2);
        availableDirections = availableDirections.filter(coordinateValue => coordinateValue != 3);
      }
      if (directionIndex >= 42) {
        availableDirections = availableDirections.filter(directionCode => directionCode != 3);
        availableDirections = availableDirections.filter(arrayItem => arrayItem != 4);
        availableDirections = availableDirections.filter(value => value != 5);
      }
      if (directionIndex % 7 == 0) {
        availableDirections = availableDirections.filter(numValue => numValue != 5);
        availableDirections = availableDirections.filter(element => element != 6);
        availableDirections = availableDirections.filter(driftItem => driftItem != 7);
      }
      let randomElement = availableDirections[c.generateRandomInt(0, availableDirections.length)];
      return randomElement;
    },
    getOositionAndRotate(direction, positionIndex, rotate) {
      if (direction == 0) {
        rotate = 270;
        positionIndex -= 7;
      } else if (direction == 1) {
        rotate = 315;
        positionIndex -= 6;
      } else if (direction == 2) {
        rotate = 0;
        positionIndex += 1;
      } else if (direction == 3) {
        rotate = 45;
        positionIndex += 8;
      } else if (direction == 4) {
        rotate = 90;
        positionIndex += 7;
      } else if (direction == 5) {
        rotate = 135;
        positionIndex += 6;
      } else if (direction == 6) {
        rotate = 180;
        positionIndex -= 1;
      } else if (direction == 7) {
        rotate = 225;
        positionIndex -= 8;
      }
      const positionRotateInfo = {
        positionIndex: positionIndex,
        rotate: rotate
      };
      return positionRotateInfo;
    },
    clickBlock(block) {
      console.log(block);
      if (!this.allowTap || this.tapedBlockIndexArr.includes(block)) {
        return;
      }
      let isTappedBlock = false;
      if (block == this.feiChuan1PositionIndex) {
        this.tapedBlockIndexArr.push(block);
        this.feiChuan1Show = true;
      } else if (block == this.feiChuan2PositionIndex) {
        this.tapedBlockIndexArr.push(block);
        this.feiChuan2Show = true;
      } else {
        isTappedBlock = true;
      }
      if (isTappedBlock) {
        this.allowTap = false;
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        this.tapedErrorBlockIndex = block;
        this.feiChuan1Show = true;
        if (this.levelGroup == this.levelGroupArr[1]) {
          this.feiChuan2Show = true;
        }
        c.clearAllSchedule();
        c.scheduleOnce(() => {
          let previousProgress = this.gameProgress - 1;
          var progressEmoji = "";
          if (previousProgress <= 2) {
            progressEmoji = "😥";
          } else if (previousProgress <= 10) {
            progressEmoji = "🙂";
          } else {
            progressEmoji = "👏";
            c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
          }
          this.emoji = progressEmoji;
          this.scoreDesc = "您通过了 " + previousProgress + " 个关卡，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒。";
          this.gameState = 3;
          var levelInfo = {
            programName: this.programName,
            levelGroup: this.levelGroup,
            score: previousProgress,
            time: this.gameEndTime - this.gameStartTime
          };
          this.beatPercent = null;
          c.game.addRankingList(levelInfo, rankingListData => {
            this.beatPercent = rankingListData;
          });
        }, 1000);
      } else {
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        if (this.tapedBlockIndexArr.length == this.levelGroupArr.indexOf(this.levelGroup) + 1) {
          this.allowTap = false;
          this.gameEndTime = new Date().getTime();
          c.scheduleOnce(() => {
            this.gameProgress++;
            anime({
              targets: this.gamePlayObj,
              right: 300,
              opacity: 0,
              duration: 300,
              easing: "easeInOutSine",
              complete: completionResult => {
                this.generateLevel();
              }
            });
          }, 800);
        }
      }
    }
  }
}).use(ElementPlus).mount(".main-body");
function intervalCallback(callbackData) {
  function antiDebugFunc(inputValue) {
    if (typeof inputValue === "string") {
      return function (dummyParam) {}.constructor("while (true) {}").apply("counter");
    } else if (("" + inputValue / inputValue).length !== 1 || inputValue % 20 === 0) {
      (function () {
        return true;
      }).constructor("debuggergger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debuggergger").apply("stateObject");
    }
    antiDebugFunc(++inputValue);
  }
  try {
    if (callbackData) {
      return antiDebugFunc;
    } else {
      antiDebugFunc(0);
    }
  } catch (caughtError) {}
}