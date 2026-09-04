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
      programName: "对称方块",
      gameAreaWidth: 0,
      gameState: 1,
      countdown: 180,
      score: 0,
      gameTimeInterval: null,
      gamePlayObj: null,
      targetPointIndexList: [],
      tapedPointIndexArr: [],
      allowTap: false,
      resultTipIcon: "",
      resultTipColor: "",
      resultTipShow: false,
      ROW_COUNT: 8,
      LEFT_COL_NUM: 4,
      RIGHT_COL_NUM: 4,
      emoji: "",
      scoreDesc: ""
    };
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
    startGame() {
      c.clearAllSchedule();
      this.score = 0;
      this.gameState = 2;
      this.countdown = 180;
      this.gameTimeInterval = c.schedule(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          c.clearSchedule(this.gameTimeInterval);
          this.gameState = 3;
          var scoreEmoji = "";
          if (this.score <= 3) {
            scoreEmoji = "😥";
          } else if (this.score <= 5) {
            scoreEmoji = "🙂";
          } else if (this.score < 10) {
            scoreEmoji = "👏";
          } else {
            scoreEmoji = "😎";
          }
          this.emoji = scoreEmoji;
          this.scoreDesc = "您获得了 " + this.score + " 分。";
          var rankingData = {
            programName: this.programName,
            score: this.score
          };
          var rankingEntry = rankingData;
          c.game.addRankingList(rankingEntry);
        }
      }, 1000);
      c.scheduleOnce(() => {
        this.gamePlayObj = document.querySelector(".block-box");
        this.generateLevel();
      }, 80);
    },
    generateLevel() {
      this.resultTipShow = false;
      this.tapedPointIndexArr = [];
      this.targetPointIndexList = [];
      let randomStartCol = c.generateRandomInt(0, this.LEFT_COL_NUM);
      this.targetPointIndexList.push(randomStartCol);
      for (let rowIndex = 1; rowIndex < this.ROW_COUNT; rowIndex++) {
        let initialIndexArray = [randomStartCol + this.LEFT_COL_NUM];
        if (randomStartCol % 4 == 0) {
          initialIndexArray.push(randomStartCol + this.LEFT_COL_NUM + 1);
        } else if (randomStartCol % 4 == this.LEFT_COL_NUM - 1) {
          initialIndexArray.push(randomStartCol + this.LEFT_COL_NUM - 1);
        } else {
          initialIndexArray.push(randomStartCol + this.LEFT_COL_NUM + 1);
          initialIndexArray.push(randomStartCol + this.LEFT_COL_NUM - 1);
        }
        randomStartCol = initialIndexArray[c.generateRandomInt(0, initialIndexArray.length)];
        this.targetPointIndexList.push(randomStartCol);
      }
      let randomIndexes = c.generateRandomNumbers(0, this.ROW_COUNT * this.LEFT_COL_NUM, this.ROW_COUNT - 2);
      randomIndexes.forEach(randomIndex => {
        if (!this.targetPointIndexList.includes(randomIndex)) {
          this.targetPointIndexList.push(randomIndex);
        }
      });
      this.gamePlayObj.style.right = "-300px";
      this.gamePlayObj.style.opacity = 0;
      this.gamePlayObj.style.rotate = "0deg";
      this.gamePlayObj.style.transform = "scale(1)";
      anime({
        targets: this.gamePlayObj,
        right: 0,
        opacity: 1,
        duration: 300,
        easing: "easeInOutSine",
        complete: param0 => {
          this.allowTap = true;
        }
      });
    },
    clickBlock(block) {
      if (!this.allowTap || this.tapedPointIndexArr.includes(block)) {
        return;
      }
      if (this.targetPointIndexList.includes(block)) {
        this.tapedPointIndexArr.push(block);
        if (this.targetPointIndexList.length == this.tapedPointIndexArr.length) {
          c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
          this.score++;
          this.allowTap = false;
          this.resultTipIcon = "✔";
          this.resultTipColor = "#2AAD67";
          this.resultTipShow = true;
          c.scheduleOnce(() => {
            anime({
              targets: this.gamePlayObj,
              right: 300,
              opacity: 0,
              duration: 300,
              easing: "easeInOutSine",
              complete: param1 => {
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
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        c.scheduleOnce(() => {
          anime({
            targets: this.gamePlayObj,
            right: 300,
            opacity: 0,
            duration: 300,
            easing: "easeInOutSine",
            complete: param2 => {
              this.generateLevel();
            }
          });
        }, 500);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");