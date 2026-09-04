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
      programName: "右键点击速度测试",
      levelGroupArr: ["3秒", "5秒", "10秒", "15秒", "30秒", "60秒"],
      gameDuration: 10,
      gameState: 0,
      time: 0,
      timeStr: "0",
      score: 0,
      timeInterval: null,
      lastPosX: null,
      lastPosY: null,
      samePosCount: 0,
      unitTimeClickCount: 0,
      unitTimeClickCountInterval: null,
      usedCheat: false,
      gameResultDialogVisible: false,
      animalIndex: 0,
      rankDesc: "",
      cpsDesc: "",
      scoreDesc: "",
      comment: "",
      rate: 0,
      lockPage: false
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
    this.phbLevelGroup = this.historyLevelGroup = this.gameDuration + "秒";
  },
  methods: {
    setRelateToolPosition() {
    },
    areaClick(clickEvent) {
      if (typeof clickEvent == "undefined" || !clickEvent.isTrusted || /HeadlessChrome|PhantomJS|Selenium/.test(navigator.userAgent)) {
        return;
      }
      if (this.gameState == 0) {
        this.gameState = 1;
        this.samePosCount = 0;
        this.unitTimeClickCount = 0;
        this.usedCheat = false;
        this.timeInterval = setInterval(() => {
          this.setTime();
        }, 100);
        this.unitTimeClickCountInterval = setInterval(() => {
          this.unitTimeClickCount = 0;
        }, 1000);
      } else {
        const offsetX = clickEvent.offsetX;
        const offsetY = clickEvent.offsetY;
        if (this.lastPosX === offsetX && this.lastPosY === offsetY) {
          this.samePosCount++;
          if (this.samePosCount > 30) {
            this.usedCheat = true;
          }
        } else {
          this.samePosCount = 0;
        }
        this.lastPosX = offsetX;
        this.lastPosY = offsetY;
        this.unitTimeClickCount++;
        if (this.unitTimeClickCount > 50) {
          this.usedCheat = true;
        }
        this.score++;
        var createdDivElement = document.createElement("div");
        createdDivElement.className = "wave";
        createdDivElement.style.left = clickEvent.offsetX - 50 + "px";
        createdDivElement.style.top = clickEvent.offsetY - 50 + "px";
        document.querySelector(".game-area").appendChild(createdDivElement);
        setTimeout(function () {
          createdDivElement.remove();
        }, 600);
      }
    },
    setTime() {
      if (this.time >= this.gameDuration * 10) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        clearInterval(this.unitTimeClickCountInterval);
        this.unitTimeClickCountInterval = null;
        this.showGameResult();
        if (this.score < this.gameDuration * 100 && !this.usedCheat) {
          var gameResultData = {
            programName: this.programName,
            levelGroup: this.gameDuration + "秒",
            score: this.score
          };
          c.game.addRankingList(gameResultData);
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