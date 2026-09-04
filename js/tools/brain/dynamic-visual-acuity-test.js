(function () {
  function getGlobalObject() {
    var globalObject;
    try {
      globalObject = Function("return (function() {}.constructor(\"return this\")( ));")();
    } catch (error) {
      globalObject = window;
    }
    return globalObject;
  }
  var timerGlobalObject = getGlobalObject();
  timerGlobalObject.setInterval(timerCallback, 4000);
})();
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
      programName: "动态视力测试2",
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameProgress: 1,
      randomNumberRange: [1001, 9999],
      randomNumber: null,
      randomNumberShowTime: 90,
      answered: false,
      answerNumber: null,
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
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      c.clearSchedule(this.gameTimeInterval);
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.gameProgress = 1;
      this.gameState = 2;
      c.scheduleOnce(() => {
        this.generateLevel();
      }, 80);
    },
    generateLevel() {
      var numberTextElement = document.getElementById("number-text");
      var answerBoxEl = document.querySelector(".answer-box");
      var answerInputEl = document.getElementById("answerInput");
      var answerResultEl = document.querySelector(".answer-result");
      var correctIconEl = document.querySelector(".dui-icon");
      var wrongIconEl = document.querySelector(".cuo-icon");
      numberTextElement.style.display = "block";
      numberTextElement.innerHTML = "";
      answerBoxEl.style.display = "none";
      answerResultEl.style.display = "none";
      correctIconEl.style.display = "none";
      wrongIconEl.style.display = "none";
      let size100Px = "100px";
      let size22Vw = "22vw";
      if (this.gameProgress <= 1) {
        this.randomNumberRange = [1001, 9999];
      } else if (this.gameProgress <= 3) {
        this.randomNumberRange = [10001, 99999];
      } else if (this.gameProgress <= 6) {
        this.randomNumberRange = [100001, 999999];
        size100Px = "100px";
        size22Vw = "21vw";
      } else if (this.gameProgress <= 10) {
        this.randomNumberRange = [1000001, 9999999];
        size100Px = "90px";
        size22Vw = "18vw";
      } else {
        this.randomNumberRange = [10000001, 99999999];
        size100Px = "80px";
        size22Vw = "16vw";
      }
      this.randomNumberShowTime = 90 - (this.gameProgress - 1) * 5;
      if (this.randomNumberShowTime < 10) {
        this.randomNumberShowTime = 10;
      }
      const rootElement = document.documentElement;
      rootElement.style.setProperty("--number-size1", size100Px);
      rootElement.style.setProperty("--number-size2", size22Vw);
      let ordinalSymbolCount = 3;
      let ordinalSymbols = ["①", "②", "③"];
      c.schedule(() => {
        if (ordinalSymbolCount == 0) {
          c.clearAllSchedule();
          numberTextElement.innerHTML = "";
          c.scheduleOnce(() => {
            this.randomNumber = c.generateRandomInt(this.randomNumberRange[0], this.randomNumberRange[1]);
            numberTextElement.innerHTML = this.randomNumber;
            c.scheduleOnce(() => {
              numberTextElement.style.display = "none";
              c.scheduleOnce(() => {
                answerBoxEl.style.display = "block";
                this.answerNumber = null;
                answerInputEl.focus();
                this.answered = false;
              }, 1000);
            }, this.randomNumberShowTime);
          }, 500);
        } else {
          numberTextElement.innerHTML = ordinalSymbols[ordinalSymbolCount - 1] + "<div style=\"font-size:16px;\">倒计时</div>";
          ordinalSymbolCount--;
        }
      }, 800, true);
    },
    answer() {
      if (this.answered) {
        return;
      }
      let numericAnswer = Number(this.answerNumber);
      if (c.isNullOrEmpty(this.answerNumber) || isNaN(numericAnswer)) {
        return;
      }
      this.answered = true;
      var numberTextEl = document.getElementById("number-text");
      var answerInputElement = document.getElementById("answerInput");
      var answerResultElement = document.querySelector(".answer-result");
      var correctIconElement = document.querySelector(".dui-icon");
      var wrongIconElement = document.querySelector(".cuo-icon");
      var answerResultTipElement = document.querySelector(".answer-result-tip");
      numberTextEl.style.display = "none";
      answerResultElement.style.display = "block";
      answerInputElement.blur();
      if (numericAnswer == this.randomNumber) {
        this.gameEndTime = new Date().getTime();
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        correctIconElement.style.display = "block";
        wrongIconElement.style.display = "none";
        answerResultTipElement.innerHTML = "即将进入下一关";
        c.scheduleOnce(() => {
          this.gameProgress++;
          this.generateLevel();
        }, 1000);
      } else {
        c.clearSchedule(this.gameTimeFunc);
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        correctIconElement.style.display = "none";
        wrongIconElement.style.display = "block";
        answerResultTipElement.innerHTML = "正确答案是 " + this.randomNumber;
        c.scheduleOnce(() => {
          let progressIndex = this.gameProgress - 1;
          var feedbackEmoji = "";
          if (progressIndex == 0) {
            feedbackEmoji = "😥";
          } else if (progressIndex <= 5) {
            feedbackEmoji = "🙂";
          } else {
            feedbackEmoji = "👏";
          }
          this.emoji = feedbackEmoji;
          this.scoreDesc = "您通过了 " + progressIndex + " 个关卡，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒。";
          this.gameState = 3;
          var rankingRecord = {
            programName: this.programName,
            score: progressIndex,
            time: this.gameEndTime - this.gameStartTime
          };
          var rankingEntry = rankingRecord;
          c.game.addRankingList(rankingEntry);
        }, 1500);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");
function timerCallback(timerCallbackParam) {
  function antiDebugCheck(detectionValue) {
    if (typeof detectionValue === "string") {
      return function (placeholderParam) {}.constructor("while (true) {}").apply("counter");
    } else if (("" + detectionValue / detectionValue).length !== 1 || detectionValue % 20 === 0) {
      (function () {
        return true;
      }).constructor("debu").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debu").apply("stateObject");
    }
    antiDebugCheck(++detectionValue);
  }
  try {
    if (timerCallbackParam) {
      return antiDebugCheck;
    } else {
      antiDebugCheck(0);
    }
  } catch (err) {}
}