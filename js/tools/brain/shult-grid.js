c.preventCheat();
const dialogComponentMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogComponentMap,
  data() {
    const gameConfig = {
      programName: "舒尔特方格",
      levelGroupArr: ["4×4", "5×5", "6×6", "7×7", "8×8", "9×9"],
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameAreaWidth: 0,
      gridNumber: 5,
      gridTemplate: "1fr 1fr 1fr 1fr 1fr",
      numberArr: [],
      currentNumber: 1,
      errorIndex: -1,
      rightIndex: -1,
      errorCount: 0,
      emoji: "",
      scoreDesc: "",
      lockPage: false
    };
    return gameConfig;
  },
  mounted() {
    this.generateGameLevel();
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
      let gamePlayRect = document.querySelector(".game-play").getBoundingClientRect();
      this.gameAreaWidth = gamePlayRect.width;
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      c.clearSchedule(this.gameTimeInterval);
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTimeMs = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTimeMs / 1000);
      }, 1000);
      this.currentNumber = 1;
      this.errorCount = 0;
      this.gameState = 2;
      this.generateGameLevel();
    },
    generateGameLevel() {
      this.numberArr = [];
      for (let numberIndex = 1; numberIndex <= this.gridNumber * this.gridNumber; numberIndex++) {
        this.numberArr.push(numberIndex);
      }
      this.numberArr.sort(() => {
        return Math.random() - 0.5;
      });
      let gridRowValues = [];
      for (let gridRowIndex = 1; gridRowIndex <= this.gridNumber; gridRowIndex++) {
        gridRowValues.push("1fr");
      }
      this.gridTemplate = gridRowValues.join(" ");
      this.rightIndex = -1;
      this.errorIndex = -1;
    },
    changeGridNumber(newGridNumber) {
      this.gridNumber = newGridNumber;
      this.gameState = 1;
      this.generateGameLevel();
      c.clearAllSchedule();
      this.gameSecondTime = 0;
      setTimeout(() => {
        this.getGameAreaSize();
      }, 50);
    },
    clickNumberBlock(clickedNumber, clickEvent) {
      if (typeof clickEvent == "undefined" || !clickEvent.isTrusted || /HeadlessChrome|PhantomJS|Selenium/.test(navigator.userAgent)) {
        return;
      }
      if (this.currentNumber - 1 == this.numberArr.length) {
        return;
      }
      if (this.numberArr[clickedNumber] == this.currentNumber) {
        this.currentNumber++;
        this.rightIndex = clickedNumber;
        if (this.currentNumber - 1 == this.numberArr.length) {
          this.gameEndTime = new Date().getTime();
          c.clearAllSchedule();
          let gameDurationMs = this.gameEndTime - this.gameStartTime;
          let durationSeconds = Number((gameDurationMs / 1000).toFixed(3));
          this.emoji = "👏";
          this.scoreDesc = "全部点击完成，用时 " + durationSeconds + " 秒";
          c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
          this.gameState = 3;
          var gameSnapshot = {
            programName: this.programName,
            levelGroup: this.gridNumber + "×" + this.gridNumber,
            time: gameDurationMs
          };
          c.game.addRankingList(gameSnapshot);
        } else {
          c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        }
      } else {
        this.errorIndex = clickedNumber;
        c.scheduleOnce(() => {
          this.errorIndex = -1;
        }, 300);
        this.errorCount++;
        if (this.errorCount >= this.gridNumber * 1.5) {
          this.gameState = 3;
          this.emoji = "😥";
          this.scoreDesc = "由于您的错误次数太多了，游戏结束！";
          c.clearAllSchedule();
        }
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
      }
    },
    changeLockPageState() {
      if (this.lockPage) {
        document.body.classList.remove("overflow-hidden");
      } else {
        document.body.classList.add("overflow-hidden");
      }
      this.lockPage = !this.lockPage;
    }
  }
}).use(ElementPlus).mount(".main-body");