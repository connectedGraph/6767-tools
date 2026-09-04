c.preventCheat();
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
var vueObj = Vue.createApp({
  components: dialogMap,
  data() {
    const gameConfig = {
      programName: "数字华容道",
      levelGroupArr: ["3×3", "4×4", "5×5", "6×6", "7×7", "8×8"],
      gameAreaWidth: 0,
      gameState: 1,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameTimeInterval: 0,
      gridNumber: 3,
      numberGridSize: 0,
      numberArr: [],
      positionIndexArr: [],
      emoji: "",
      scoreDesc: "",
      staticSiteHost: staticSiteHost
    };
    return gameConfig;
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.initGridNumberBlock();
  },
  methods: {
    setRelateToolPosition() {
    },
    getGameAreaSize() {
      var gameAreaElement = document.querySelector(".game-area");
      if (gameAreaElement == null) {
        return;
      }
      var gameAreaRect = gameAreaElement.getBoundingClientRect();
      this.gameAreaWidth = gameAreaRect.width;
      this.numberGridSize = 362 / this.gridNumber / 380 * this.gameAreaWidth;
    },
    changeGridNumber(newGridNumber) {
      this.gridNumber = newGridNumber;
      c.clearAllSchedule();
      this.gameSecondTime = 0;
      this.gameState = 1;
      this.initGridNumberBlock();
    },
    initGridNumberBlock() {
      this.numberGridSize = 362 / this.gridNumber / 380 * this.gameAreaWidth;
      let numberList = [];
      let arr0 = [];
      for (let numberIndex = 1; numberIndex <= this.gridNumber * this.gridNumber - 1; numberIndex++) {
        numberList.push(numberIndex);
        arr0.push(numberIndex - 1);
      }
      this.numberArr = numberList;
      this.positionIndexArr = arr0;
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
      this.gameState = 2;
      this.positionIndexArr = this.getRandomPositionIndexArr();
      c.playAudio(staticSiteHost + "/audio/brain/shua-xin.mp3");
    },
    getRandomPositionIndexArr() {
      let cellIndexList = [];
      for (let gridIndex = 0; gridIndex < this.gridNumber * this.gridNumber - 1; gridIndex++) {
        cellIndexList.push(gridIndex);
      }
      cellIndexList.sort(() => {
        return Math.random() - 0.5;
      });
      if (!this.canUse(cellIndexList)) {
        return this.getRandomPositionIndexArr();
      }
      let isGridInOrder = true;
      for (let itemIndex = 0; itemIndex < cellIndexList.length; itemIndex++) {
        if (cellIndexList[itemIndex] != itemIndex) {
          isGridInOrder = false;
          break;
        }
      }
      if (isGridInOrder) {
        return this.getRandomPositionIndexArr();
      }
      return cellIndexList;
    },
    canUse(candidates) {
      let inversionCount = 0;
      for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
        for (let innerCandidateIndex = candidateIndex + 1; innerCandidateIndex < candidates.length; innerCandidateIndex++) {
          if (candidates[candidateIndex] > candidates[innerCandidateIndex]) {
            inversionCount++;
          }
        }
      }
      return inversionCount % 2 == 0;
    },
    moveNumberBlock(blockNumber) {
      if (this.gameState != 2) {
        return;
      }
      let selectedIndex = -1;
      for (let cellIndex = 0; cellIndex < this.gridNumber * this.gridNumber; cellIndex++) {
        if (!this.positionIndexArr.includes(cellIndex)) {
          selectedIndex = cellIndex;
          break;
        }
      }
      if (Math.floor(selectedIndex / this.gridNumber) == Math.floor(this.positionIndexArr[blockNumber] / this.gridNumber)) {
        if (this.positionIndexArr[blockNumber] > selectedIndex) {
          for (let positionIndex = 0; positionIndex < this.positionIndexArr.length; positionIndex++) {
            if (this.positionIndexArr[positionIndex] <= this.positionIndexArr[blockNumber] && this.positionIndexArr[positionIndex] > selectedIndex && Math.floor(selectedIndex / this.gridNumber) == Math.floor(this.positionIndexArr[positionIndex] / this.gridNumber)) {
              this.positionIndexArr[positionIndex] = this.positionIndexArr[positionIndex] - 1;
            }
          }
        }
        if (this.positionIndexArr[blockNumber] < selectedIndex) {
          for (let positionCursor = 0; positionCursor < this.positionIndexArr.length; positionCursor++) {
            if (this.positionIndexArr[positionCursor] >= this.positionIndexArr[blockNumber] && this.positionIndexArr[positionCursor] < selectedIndex && Math.floor(selectedIndex / this.gridNumber) == Math.floor(this.positionIndexArr[positionCursor] / this.gridNumber)) {
              this.positionIndexArr[positionCursor] = this.positionIndexArr[positionCursor] + 1;
            }
          }
        }
      } else if (selectedIndex % this.gridNumber == this.positionIndexArr[blockNumber] % this.gridNumber) {
        if (this.positionIndexArr[blockNumber] > selectedIndex) {
          for (let positionCounter = 0; positionCounter < this.positionIndexArr.length; positionCounter++) {
            if (this.positionIndexArr[positionCounter] <= this.positionIndexArr[blockNumber] && this.positionIndexArr[positionCounter] > selectedIndex && selectedIndex % this.gridNumber == this.positionIndexArr[positionCounter] % this.gridNumber) {
              this.positionIndexArr[positionCounter] = this.positionIndexArr[positionCounter] - this.gridNumber;
            }
          }
        }
        if (this.positionIndexArr[blockNumber] < selectedIndex) {
          for (let positionLoopIndex = 0; positionLoopIndex < this.positionIndexArr.length; positionLoopIndex++) {
            if (this.positionIndexArr[positionLoopIndex] >= this.positionIndexArr[blockNumber] && this.positionIndexArr[positionLoopIndex] < selectedIndex && selectedIndex % this.gridNumber == this.positionIndexArr[positionLoopIndex] % this.gridNumber) {
              this.positionIndexArr[positionLoopIndex] = this.positionIndexArr[positionLoopIndex] + this.gridNumber;
            }
          }
        }
      } else {
        return;
      }
      let isPositionCorrect = true;
      for (let positionIdx = 0; positionIdx < this.positionIndexArr.length; positionIdx++) {
        if (this.positionIndexArr[positionIdx] != positionIdx) {
          isPositionCorrect = false;
          break;
        }
      }
      if (isPositionCorrect) {
        this.gameEndTime = new Date().getTime();
        c.clearSchedule(this.gameTimeInterval);
        this.gameState = 3;
        this.emoji = "👏";
        this.scoreDesc = "您通关了，用时 {0} 秒！".replace("{0}", Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)));
        const rankingData = {
          programName: this.programName,
          levelGroup: this.gridNumber + "×" + this.gridNumber,
          time: this.gameEndTime - this.gameStartTime
        };
        var rankingPayload = rankingData;
        c.game.addRankingList(rankingPayload);
        c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
      } else {
        c.playAudio(staticSiteHost + "/audio/brain/mu-kuai.mp3");
      }
    }
  }
}).use(ElementPlus).mount(".main-body");