c.preventCheat();
var dialogComponentMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogComponentMap,
  data() {
    return {
      programName: "斯特鲁普效应",
      levelGroupArr: ["模式一", "模式二", "模式三"],
      gameState: 0,
      levelGroup: "模式一",
      gameStartTime: 0,
      gameTimeStr: 0,
      gameProgress: 0,
      emoji: "",
      scoreDesc: "",
      colorArr: ["#FF0000", "#FFA500", "#008000", "#0000FF", "#800080", "#808080", "#000000"],
      colorTextArr: ["红", "橙", "绿", "蓝", "紫", "灰", "黑"],
      colorIndexForModeOne: null,
      colorTextIndexForModeOne: null,
      upColorIndexForModeTwo: null,
      upColorTextIndexForModeTwo: null,
      downColorIndexForModeTwo: null,
      downColorTextIndexForModeTwo: null,
      colorIndexForModeThree: null,
      colorTextIndexForModeThree: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
  },
  methods: {
    setRelateToolPosition() {
    },
    goChangeLevelGroup() {
      c.clearAllSchedule();
      this.gameTimeStr = 0;
      this.gameProgress = 0;
      this.gameState = 0;
    },
    changeLevelGroup(levelGroup) {
      this.levelGroup = levelGroup;
      this.gameState = 1;
      this.startGame();
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      c.schedule(() => {
        var totalElapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameTimeStr = Math.floor(totalElapsedTime / 1000);
      }, 1000);
      this.generateLevel();
    },
    generateLevel() {
      if (this.levelGroup == this.levelGroupArr[0]) {
        this.modeOneGenerateQuestion();
      } else if (this.levelGroup == this.levelGroupArr[1]) {
        this.modeTwoGenerateQuestion();
      } else if (this.levelGroup == this.levelGroupArr[2]) {
        this.modeThreeGenerateQuestion();
      }
    },
    modeOneGenerateQuestion() {
      this.colorIndexForModeOne = c.generateRandomInt(0, this.colorArr.length);
      if (c.generateRandomInt(0, 2) == 1) {
        this.colorTextIndexForModeOne = this.colorIndexForModeOne;
      } else {
        this.colorTextIndexForModeOne = c.generateRandomInt(0, this.colorArr.length);
      }
    },
    modeTwoGenerateQuestion() {
      this.upColorTextIndexForModeTwo = c.generateRandomInt(0, this.colorArr.length);
      if (c.generateRandomInt(0, 2) == 1) {
        this.downColorIndexForModeTwo = this.upColorTextIndexForModeTwo;
      } else {
        this.downColorIndexForModeTwo = c.generateRandomInt(0, this.colorArr.length);
      }
      this.upColorIndexForModeTwo = c.generateRandomInt(0, this.colorArr.length);
      this.downColorTextIndexForModeTwo = c.generateRandomInt(0, this.colorArr.length);
    },
    modeThreeGenerateQuestion() {
      this.colorIndexForModeThree = c.generateRandomInt(0, this.colorArr.length);
      this.colorTextIndexForModeThree = c.generateRandomInt(0, this.colorArr.length);
    },
    answer(userAnswer) {
      let reactionTime = new Date().getTime() - this.gameStartTime;
      let isAnswerCorrect = false;
      if (this.levelGroup == this.levelGroupArr[0]) {
        isAnswerCorrect = this.colorIndexForModeOne == this.colorTextIndexForModeOne && userAnswer == "1" || this.colorIndexForModeOne != this.colorTextIndexForModeOne && userAnswer == "0";
      } else if (this.levelGroup == this.levelGroupArr[1]) {
        isAnswerCorrect = this.upColorTextIndexForModeTwo == this.downColorIndexForModeTwo && userAnswer == "1" || this.upColorTextIndexForModeTwo != this.downColorIndexForModeTwo && userAnswer == "0";
      } else if (this.levelGroup == this.levelGroupArr[2]) {
        isAnswerCorrect = this.colorTextIndexForModeThree == Number(userAnswer);
      }
      if (isAnswerCorrect) {
        this.gameProgress++;
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        if (this.gameProgress == 20) {
          this.emoji = "😎";
          this.scoreDesc = "您通关了，用时 " + Number((reactionTime / 1000).toFixed(2)) + " 秒！";
          c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
        } else {
          if (this.levelGroup == this.levelGroupArr[0]) {
            this.modeOneGenerateQuestion();
          } else if (this.levelGroup == this.levelGroupArr[1]) {
            this.modeTwoGenerateQuestion();
          } else if (this.levelGroup == this.levelGroupArr[2]) {
            this.modeThreeGenerateQuestion();
          }
          return;
        }
      } else {
        if (this.gameProgress <= 2) {
          this.emoji = "😥";
        } else if (this.gameProgress <= 10) {
          this.emoji = "🙂";
        } else {
          this.emoji = "👏";
        }
        this.scoreDesc = "您通过了 " + this.gameProgress + " 个关卡，用时 " + Number((reactionTime / 1000).toFixed(2)) + " 秒。";
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
      }
      c.clearAllSchedule();
      this.gameState = 2;
      var rankingData = {
        programName: this.programName,
        levelGroup: this.levelGroup,
        score: this.gameProgress,
        time: reactionTime
      };
      var rankingDataRef = rankingData;
      c.game.addRankingList(rankingDataRef);
    },
    restartGame() {
      this.gameTimeStr = 0;
      this.gameProgress = 0;
      this.gameState = 1;
      this.startGame();
    }
  }
}).use(ElementPlus).mount(".main-body");