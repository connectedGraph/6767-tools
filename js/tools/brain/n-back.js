c.preventCheat();
const gameConfig = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: gameConfig,
  data() {
    return {
      programName: "NBack",
      levelGroupArr: ["1-back", "2-back", "3-back", "4-back", "5-back", "6-back", "7-back", "8-back"],
      gameState: 0,
      backCount: 1,
      levelGroup: "1-back",
      gameStartTime: 0,
      gameTimeStr: 0,
      gameProgress: 0,
      questionArr: [],
      answerArr: [],
      emoji: "",
      scoreDesc: ""
    };
  },
  computed: {
    questionImgPosition() {
      if (this.questionArr.length == 0) {
        return "10000px 10000px";
      }
      let lastQuestionRow = Math.floor(this.questionArr[this.questionArr.length - 1] / 9);
      let lastQuestionCol = this.questionArr[this.questionArr.length - 1] % 9;
      return lastQuestionCol * 12.5 + "% " + lastQuestionRow * 20 + "%";
    },
    answerImgPosition() {
      if (this.answerArr.length == 0) {
        return ["10000px 10000px", "10000px 10000px", "10000px 10000px", "10000px 10000px"];
      }
      let gridCoordinates = [];
      for (var answerArrIndex = 0; answerArrIndex < this.answerArr.length; answerArrIndex++) {
        let answerRow = Math.floor(this.answerArr[answerArrIndex] / 9);
        let answerCol = this.answerArr[answerArrIndex] % 9;
        gridCoordinates.push(answerCol * 12.5 + "% " + answerRow * 20 + "%");
      }
      return gridCoordinates;
    }
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
    changeLevelGroup(targetGroup, targetLevel) {
      this.backCount = targetGroup;
      this.levelGroup = targetLevel;
      this.gameState = 1;
      this.startGame();
    },
    startGame() {
      this.questionArr = [];
      this.answerArr = [];
      this.gameStartTime = new Date().getTime();
      c.schedule(() => {
        var elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameTimeStr = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.generateLevel();
    },
    generateLevel() {
      if (this.questionArr.length == 0) {
        let counter = 0;
        const timerId = c.schedule(() => {
          anime({
            targets: ".question-img",
            opacity: 0,
            duration: 60,
            complete: completionParam1 => {
              let randomCardIndex = c.generateRandomInt(0, 52);
              this.questionArr.push(randomCardIndex);
              anime({
                targets: ".question-img",
                opacity: 1,
                duration: 60,
                complete: completionParam2 => {
                  counter++;
                  if (counter == this.backCount + 1) {
                    c.clearSchedule(timerId);
                    c.scheduleOnce(() => {
                      this.generateAnswerList();
                    }, 1000);
                  }
                }
              });
            }
          });
        }, 1500, true);
      } else {
        anime({
          targets: ".question-img",
          opacity: 0,
          duration: 60,
          complete: completionParam3 => {
            let randomCardIndex2 = c.generateRandomInt(0, 52);
            this.questionArr.push(randomCardIndex2);
            anime({
              targets: ".question-img",
              opacity: 1,
              duration: 60,
              complete: completionParam4 => {
                this.generateAnswerList();
              }
            });
          }
        });
      }
    },
    generateAnswerList() {
      this.answerArr = c.generateRandomNumbers(0, 52, 4);
      let nBackPreviousItem = this.questionArr[this.questionArr.length - 1 - this.backCount];
      if (!this.answerArr.includes(nBackPreviousItem)) {
        this.answerArr.splice(c.generateRandomInt(0, 4), 1, nBackPreviousItem);
      }
    },
    chooseImg(selectedImgIndex) {
      if (this.answerArr.length == 0) {
        return;
      }
      let elapsedTimeMs = new Date().getTime() - this.gameStartTime;
      let nBackCurrentItem = this.questionArr[this.questionArr.length - 1 - this.backCount];
      if (this.answerArr[Number(selectedImgIndex)] == nBackCurrentItem) {
        this.gameProgress++;
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        if (this.gameProgress == 20) {
          this.emoji = "😎";
          this.scoreDesc = "您通关了，用时 " + Number((elapsedTimeMs / 1000).toFixed(2)) + " 秒！";
          c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
        } else {
          this.generateLevel();
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
        this.scoreDesc = "您通过了 " + this.gameProgress + " 个关卡，用时 " + Number((elapsedTimeMs / 1000).toFixed(2)) + " 秒。";
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
      }
      c.clearAllSchedule();
      this.gameState = 2;
      const configData = {
        programName: this.programName,
        levelGroup: this.levelGroup,
        score: this.gameProgress,
        time: elapsedTimeMs
      };
      var configRef = configData;
      c.game.addRankingList(configRef);
    },
    restartGame() {
      this.gameTimeStr = 0;
      this.gameProgress = 0;
      this.gameState = 1;
      this.startGame();
    }
  }
}).use(ElementPlus).mount(".main-body");