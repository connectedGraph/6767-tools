c.preventCheat();
var dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    return {
      programName: "上下瓶色匹配",
      levelGroupArr: ["4个瓶子", "5个瓶子", "6个瓶子", "8个瓶子"],
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameSecondTime: 0,
      gameTimeInterval: 0,
      levelGroup: "",
      rightCount: 0,
      pingZiCount: 4,
      colorArr: ["#FF0000", "#FFA500", "#008000", "#0000FF", "#800080", "#000000", "#00838F", "#8B4513"],
      xiaPaiColorIndexArr: [],
      shangPaiColorIndexArr: [],
      allowSelectPingZi: true,
      selectedPingZiNodeIndexArr: [],
      selectedPingZiIndexArr: [],
      emoji: "",
      scoreDesc: "",
      gameAreaChangeSetTimeout: null
    };
  },
  computed: {
    pingZiListWidth() {
      return this.gameAreaWidth - (this.gameAreaWidth / this.pingZiCount - this.gameAreaWidth * 0.08);
    },
    pingZiListHeight() {
      return (this.gameAreaWidth - 50) * 0.5;
    },
    pingZiListLeft() {
      return (this.gameAreaWidth / this.pingZiCount - this.gameAreaWidth * 0.08) / 2;
    },
    pingZiWidth() {
      return this.gameAreaWidth * 0.08;
    },
    pingZiItemTop() {
      return (this.pingZiListHeight - this.gameAreaWidth * 0.08 * 205 / 69) / 1.5;
    },
    pingZiItemLeft() {
      return (this.pingZiListWidth / this.pingZiCount - this.pingZiWidth) / 2;
    }
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize(true);
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.levelGroup = this.levelGroupArr[0];
    this.generateGameLevel();
  },
  methods: {
    setRelateToolPosition() {
    },
    getGameAreaSize(gameAreaElement) {
      if (this.gameState == 3) {
        return;
      }
      var gameAreaRect = document.querySelector(".game-area").getBoundingClientRect();
      this.gameAreaWidth = gameAreaRect.width;
      if (!gameAreaElement) {
        c.clearSchedule(this.gameAreaChangeSetTimeout);
        this.gameAreaChangeSetTimeout = c.scheduleOnce(() => {
          var shangPaiColorClone = c.clone(this.shangPaiColorIndexArr);
          this.shangPaiColorIndexArr = c.generateRandomNumbers(0, this.colorArr.length, this.pingZiCount);
          setTimeout(() => {
            this.shangPaiColorIndexArr = shangPaiColorClone;
          }, 50);
        }, 10);
      }
    },
    changeLevelGroup(levelGroup) {
      this.levelGroup = levelGroup;
      var levelGroupIndex = this.levelGroupArr.indexOf(levelGroup);
      if (levelGroupIndex == 0) {
        this.pingZiCount = 4;
      } else if (levelGroupIndex == 1) {
        this.pingZiCount = 5;
      } else if (levelGroupIndex == 2) {
        this.pingZiCount = 6;
      } else if (levelGroupIndex == 3) {
        this.pingZiCount = 8;
      }
      this.startGame();
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      this.gameSecondTime = 0;
      c.clearAllSchedule();
      this.gameTimeInterval = c.schedule(() => {
        let elapsedGameTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedGameTime / 1000);
      }, 1000);
      this.rightCount = 0;
      this.allowSelectPingZi = true;
      this.selectedPingZiIndexArr = [];
      this.generateGameLevel();
      this.gameState = 2;
    },
    generateGameLevel() {
      this.xiaPaiColorIndexArr = c.generateRandomNumbers(0, this.colorArr.length, this.pingZiCount);
      this.shangPaiColorIndexArr = c.clone(this.xiaPaiColorIndexArr);
      let xiaPaiMatchCount = 0;
      let compareColorIndexes = () => {
        for (let xiaPaiLoopIndex = 0; xiaPaiLoopIndex < this.xiaPaiColorIndexArr.length; xiaPaiLoopIndex++) {
          if (this.xiaPaiColorIndexArr[xiaPaiLoopIndex] == this.shangPaiColorIndexArr[xiaPaiLoopIndex]) {
            return false;
          }
        }
        return true;
      };
      while (!compareColorIndexes()) {
        this.shangPaiColorIndexArr.sort(function () {
          return Math.random() - 0.5;
        });
        xiaPaiMatchCount++;
      }
    },
    touchPingZi(touchEvent, tappedPingZiIndex) {
      if (!this.allowSelectPingZi) {
        return;
      }
      this.allowSelectPingZi = false;
      var pingZiItems = document.querySelectorAll(".ping-zi-item");
      if (this.selectedPingZiIndexArr.includes(tappedPingZiIndex)) {
        c.playAudio(staticSiteHost + "/audio/brain/dian-ji3.mp3");
        this.selectedPingZiIndexArr.remove(tappedPingZiIndex);
        var firstMoveAnimConfig = {
          targets: pingZiItems[tappedPingZiIndex],
          top: this.pingZiItemTop + "px",
          duration: 100,
          easing: "easeInOutSine",
          complete: firstCompleteAnim => {
            this.allowSelectPingZi = true;
          }
        };
        anime(firstMoveAnimConfig);
      } else {
        c.playAudio(staticSiteHost + "/audio/brain/dian-ji2.mp3");
        this.selectedPingZiIndexArr.push(tappedPingZiIndex);
        anime({
          targets: pingZiItems[tappedPingZiIndex],
          top: this.pingZiItemTop / 2 + "px",
          duration: 100,
          easing: "easeInOutSine",
          complete: secondCompleteAnim => {
            if (this.selectedPingZiIndexArr.length == 2) {
              var firstSelectedPingZi = pingZiItems[this.selectedPingZiIndexArr[0]];
              var firstSelectedPingZiLeft = firstSelectedPingZi.style.left;
              var secondSelectedPingZi = pingZiItems[this.selectedPingZiIndexArr[1]];
              var secondSelectedPingZiLeft = secondSelectedPingZi.style.left;
              anime({
                targets: firstSelectedPingZi,
                left: secondSelectedPingZiLeft,
                duration: 500,
                easing: "easeInOutSine"
              });
              anime({
                targets: secondSelectedPingZi,
                left: firstSelectedPingZiLeft,
                duration: 500,
                easing: "easeInOutSine"
              });
              c.scheduleOnce(() => {
                anime({
                  targets: firstSelectedPingZi,
                  top: this.pingZiItemTop + "px",
                  duration: 100,
                  easing: "easeInOutSine"
                });
                var secondMoveAnimConfig = {
                  targets: secondSelectedPingZi,
                  top: this.pingZiItemTop + "px",
                  duration: 100,
                  easing: "easeInOutSine"
                };
                anime(secondMoveAnimConfig);
                c.scheduleOnce(() => {
                  var firstSelectedColorIndex = this.shangPaiColorIndexArr[this.selectedPingZiIndexArr[0]];
                  var secondSelectedColorIndex = this.shangPaiColorIndexArr[this.selectedPingZiIndexArr[1]];
                  this.shangPaiColorIndexArr[this.selectedPingZiIndexArr[0]] = secondSelectedColorIndex;
                  this.shangPaiColorIndexArr[this.selectedPingZiIndexArr[1]] = firstSelectedColorIndex;
                  console.log(JSON.stringify(this.xiaPaiColorIndexArr) + " " + JSON.stringify(this.shangPaiColorIndexArr));
                  var shangPaiMatchCount = 0;
                  for (var shangPaiLoopIndex = 0; shangPaiLoopIndex < this.shangPaiColorIndexArr.length; shangPaiLoopIndex++) {
                    if (this.shangPaiColorIndexArr[shangPaiLoopIndex] == this.xiaPaiColorIndexArr[shangPaiLoopIndex]) {
                      shangPaiMatchCount++;
                    }
                  }
                  this.rightCount = shangPaiMatchCount;
                  if (this.rightCount == this.pingZiCount) {
                    c.clearAllSchedule();
                    var gameDurationSinceStart = new Date().getTime() - this.gameStartTime;
                    var rankingData = {
                      programName: this.programName,
                      levelGroup: this.levelGroup,
                      time: gameDurationSinceStart
                    };
                    var rankingDataAlias = rankingData;
                    c.game.addRankingList(rankingDataAlias);
                    c.scheduleOnce(() => {
                      this.gameState = 3;
                      this.emoji = "👏";
                      this.scoreDesc = "您通关了，用时 {0} 秒！".replace("{0}", Number((gameDurationSinceStart / 1000).toFixed(3)));
                      c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
                    }, 1000);
                  } else {
                    this.allowSelectPingZi = true;
                  }
                  this.selectedPingZiIndexArr = [];
                }, 110);
              }, 520);
            } else {
              this.allowSelectPingZi = true;
            }
          }
        });
      }
    }
  }
}).use(ElementPlus).mount(".main-body");