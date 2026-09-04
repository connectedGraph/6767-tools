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
      programName: "空格键计数器",
      levelGroupArr: ["3秒", "5秒", "10秒", "15秒", "30秒", "60秒"],
      gameDuration: 10,
      gameState: 0,
      time: 0,
      timeStr: "0",
      score: 0,
      timeInterval: null,
      unitTimeClickCount: 0,
      unitTimeClickCountInterval: null,
      usedCheat: false,
      gameResultDialogVisible: false,
      animalIndex: 0,
      rankDesc: "",
      cpsDesc: "",
      scoreDesc: "",
      comment: "",
      rate: 0
    };
  },
  computed: {
    avgClick() {
      if (this.time == 0 || this.score == 0) {
        return 0;
      } else {
        return (this.score / (this.time / 10)).toFixed(1);
      }
    }
  },
  watch: {
    gameResultDialogVisible(isVisible) {
      if (!isVisible) {
        this.gameState = 0;
        this.time = 0;
        this.timeStr = "0";
        this.score = 0;
      }
    }
  },
  mounted() {
    this.setRelateToolPosition();
    this.spaceEventBind();
    this.phbLevelGroup = this.historyLevelGroup = this.gameDuration + "秒";
  },
  methods: {
    setRelateToolPosition() {
    },
    spaceEventBind() {
      var isSpaceKeyUp = true;
      document.onkeydown = handleKeydown => {
        if (handleKeydown.keyCode === 32) {
          handleKeydown.preventDefault();
          if (!isSpaceKeyUp) {
            return;
          }
          isSpaceKeyUp = false;
          if (this.gameState == 0) {
            return;
          }
          this.unitTimeClickCount++;
          if (this.unitTimeClickCount > 50) {
            this.usedCheat = true;
          }
          this.score++;
          var gameAreaElement = document.querySelector(".game-area");
          var divElement = document.createElement("div");
          divElement.className = "wave";
          divElement.style.left = gameAreaElement.clientWidth / 2 - 50 + "px";
          divElement.style.top = gameAreaElement.clientHeight / 2 - 50 + "px";
          gameAreaElement.appendChild(divElement);
          setTimeout(function () {
            divElement.remove();
          }, 600);
        }
      };
      document.onkeyup = handleKeyup => {
        if (handleKeyup.keyCode === 32) {
          handleKeyup.preventDefault();
          isSpaceKeyUp = true;
        }
      };
    },
    areaClick(clickEvent) {
      if (typeof clickEvent == "undefined" || !clickEvent.isTrusted || /HeadlessChrome|PhantomJS|Selenium/.test(navigator.userAgent)) {
        return;
      }
      if (this.gameState == 0) {
        this.gameState = 1;
        this.unitTimeClickCount = 0;
        this.timeInterval = setInterval(() => {
          this.setTime();
        }, 100);
        this.unitTimeClickCountInterval = setInterval(() => {
          this.unitTimeClickCount = 0;
        }, 1000);
      }
    },
    setTime() {
      if (this.time >= this.gameDuration * 10) {
        this.gameState = 0;
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        clearInterval(this.unitTimeClickCountInterval);
        this.unitTimeClickCountInterval = null;
        this.showGameResult();
        if (this.score < this.gameDuration * 100) {
          var gameStats = {
            programName: this.programName,
            levelGroup: this.gameDuration + "秒",
            score: this.score
          };
          c.game.addRankingList(gameStats);
        }
      } else {
        this.time++;
      }
      var tensDigit = parseInt(this.time / 10, 10);
      var onesDigit = this.time % 10;
      this.timeStr = tensDigit + "." + onesDigit;
    },
    selectDuration(duration) {
      this.gameDuration = duration;
      this.gameState = 0;
      this.time = 0;
      this.timeStr = "0";
      this.score = 0;
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      clearInterval(this.unitTimeClickCountInterval);
      this.unitTimeClickCountInterval = null;
      this.phbLevelGroup = this.historyLevelGroup = this.gameDuration + "秒";
    },
    showGameResult() {
      if (this.avgClick <= 3.5) {
        this.animalIndex = 0;
        this.rate = 1;
        this.comment = locales.comment1;
      } else if (this.avgClick > 3.5 && this.avgClick <= 5.5) {
        this.animalIndex = 1;
        this.rate = 1;
        this.comment = locales.comment1;
      } else if (this.avgClick > 5.5 && this.avgClick <= 6.6) {
        this.animalIndex = 2;
        this.rate = 2;
        this.comment = locales.comment1;
      } else if (this.avgClick > 6.6 && this.avgClick <= 6.9) {
        this.animalIndex = 3;
        this.rate = 2;
        this.comment = locales.comment2;
      } else if (this.avgClick > 6.9 && this.avgClick <= 7.5) {
        this.animalIndex = 4;
        this.rate = 3;
        this.comment = locales.comment2;
      } else if (this.avgClick > 7.5 && this.avgClick <= 8) {
        this.animalIndex = 5;
        this.rate = 3;
        this.comment = locales.comment2;
      } else if (this.avgClick > 8 && this.avgClick <= 8.5) {
        this.animalIndex = 6;
        this.rate = 4;
        this.comment = locales.comment2;
      } else if (this.avgClick > 8.5 && this.avgClick <= 9) {
        this.animalIndex = 7;
        this.rate = 4;
        this.comment = locales.comment2;
      } else if (this.avgClick > 9) {
        this.animalIndex = 8;
        this.rate = 5;
        this.comment = locales.comment3;
      }
      this.rankDesc = locales.rankDesc.replace("X", "<span>" + locales.animal[this.animalIndex] + "</span>");
      this.cpsDesc = locales.cpsDesc.replace("10", "<span>" + this.avgClick + "</span>");
      this.scoreDesc = locales.scoreDesc.replace("1000", this.score).replace("10", this.gameDuration);
      this.gameResultDialogVisible = true;
    }
  }
}).use(ElementPlus).mount(".main-body");