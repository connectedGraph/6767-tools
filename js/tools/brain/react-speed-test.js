c.preventCheat();
var dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
var vueObj = Vue.createApp({
  components: dialogMap,
  data() {
    return {
      programName: "反应速度",
      gameState: 0,
      gameStartTime: 0,
      gameEndTime: 0,
      timeoutFun: null,
      resultHtml: null,
      gameAreaObj: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
    this.gameAreaObj = document.querySelector(".game-area");
  },
  methods: {
    setRelateToolPosition() {
    },
    areaClick() {
      if (this.gameState == 0 || this.gameState == 3 || this.gameState == 4) {
        this.gameState = 1;
        this.gameAreaObj.style.backgroundColor = "#ce2636";
        this.gameStartTime = 0;
        this.gameEndTime = 0;
        this.resultHtml = null;
        var maxDelayMs = 5000;
        var minDelayMs = 1000;
        var randomDelayMs = parseInt(Math.random() * (maxDelayMs - minDelayMs + 1) + minDelayMs, 10);
        this.timeoutFun = setTimeout(() => {
          this.gameState = 2;
          this.gameAreaObj.style.backgroundColor = "#65c04c";
          this.gameStartTime = new Date().getTime();
        }, randomDelayMs);
      } else if (this.gameState == 2) {
        this.gameEndTime = new Date().getTime();
        var reactionTimeMs = this.gameEndTime - this.gameStartTime;
        var reactionTimeHtml = "反应时间：<span>" + reactionTimeMs / 1000 + "</span> 秒。";
        if (reactionTimeMs > 1000) {
          reactionTimeHtml += "我以为你睡着了...";
        } else if (reactionTimeMs <= 1000 && reactionTimeMs > 450) {
          reactionTimeHtml += "你一定是喝多了才会这样慢的!";
        } else if (reactionTimeMs <= 450 && reactionTimeMs > 300) {
          reactionTimeHtml += "还不错，是正常水平，继续努力吧!";
        } else if (reactionTimeMs <= 300 && reactionTimeMs > 200) {
          reactionTimeHtml += "神枪手非你莫属!";
        } else if (reactionTimeMs <= 200) {
          reactionTimeHtml += "你还是人吗？神乎奇迹";
        }
        this.resultHtml = reactionTimeHtml;
        this.gameState = 3;
        this.gameAreaObj.style.backgroundColor = "#2b87d1";
        var rankingData = {
          programName: this.programName,
          time: reactionTimeMs
        };
        var rankingPayload = rankingData;
        c.game.addRankingList(rankingPayload);
      } else if (this.gameState == 1) {
        if (this.timeoutFun != null) {
          clearTimeout(this.timeoutFun);
          this.timeoutFun = null;
        }
        this.gameState = 4;
        this.gameAreaObj.style.backgroundColor = "#2b87d1";
      }
    }
  }
}).use(ElementPlus).mount(".main-body");