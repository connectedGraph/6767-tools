c.preventCheat();
var dialogRegistry = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogRegistry,
  data() {
    var defaultRankingParams = {
      programName: "数独",
      levelGroupIndex: 0,
      levelGroupDescArr: locales.levelGroupDescArr,
      levelGroupCodeArr: ["容易", "普通", "困难"],
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      lives: 3,
      shuduCore: null,
      shuDuDirectionEnum: ShuDuDirectionEnum.Easy,
      grids: null,
      selectedGridIndex: null,
      emoji: "",
      scoreDesc: ""
    };
    return defaultRankingParams;
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.generateGridsData();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationId);
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
      this.radius = this.gameAreaWidth * 0.04;
      this.moveSpeedScale = this.gameAreaWidth / 500 * this.moveSpeed;
    },
    changeLevelGroup(levelGroup) {
      c.clearAllSchedule();
      this.levelGroupIndex = levelGroup;
      this.shuDuDirectionEnum = this.levelGroupIndex + 1;
      if (this.gameState != 1) {
        this.startGame();
      } else {
        this.generateGridsData();
      }
    },
    startGame() {
      c.clearAllSchedule();
      this.generateGridsData();
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.lives = 3;
      this.gameState = 2;
    },
    generateGridsData() {
      this.selectedGridIndex = null;
      this.shuduCore = null;
      this.shuduCore = new ShuDuCore(this.shuDuDirectionEnum);
      this.grids = this.shuduCore.board.grids;
    },
    clickGrid(clickedGridIndex) {
      if (this.gameState != 2) {
        return;
      }
      this.setGridStype(clickedGridIndex);
    },
    setGridStype(gridIndex) {
      this.selectedGridIndex = gridIndex;
      var rowIndex = this.grids[gridIndex].row;
      var colIndex = this.grids[gridIndex].col;
      var groupIndex = this.getGridGroupIndex(gridIndex);
      var cellValue = null;
      if (this.grids[gridIndex].visibility || this.grids[gridIndex].value == this.grids[gridIndex].userValue) {
        cellValue = this.grids[gridIndex].value;
      }
      for (var loopIndex = 0; loopIndex < this.grids.length; loopIndex++) {
        if (loopIndex == gridIndex) {
          this.grids[loopIndex].bgColor = "#CE9F31";
          if (this.grids[loopIndex].visibility || this.grids[loopIndex].value == this.grids[loopIndex].userValue) {
            this.grids[loopIndex].textColor = "#ffffff";
          } else if (this.grids[loopIndex].value != this.grids[loopIndex].userValue) {
            this.grids[loopIndex].textColor = "#ff0000";
          }
        } else {
          if (this.grids[loopIndex].row == rowIndex || this.grids[loopIndex].col == colIndex || groupIndex == this.getGridGroupIndex(loopIndex)) {
            this.grids[loopIndex].bgColor = "#E5DCC6";
          } else {
            this.grids[loopIndex].bgColor = "var(--bg-color)";
          }
          if (cellValue != null && (cellValue == this.grids[loopIndex].value && this.grids[loopIndex].visibility || cellValue == this.grids[loopIndex].userValue && this.grids[loopIndex].value == this.grids[loopIndex].userValue)) {
            this.grids[loopIndex].textColor = "#517FFF";
          } else if (this.grids[loopIndex].visibility) {
            if (this.grids[loopIndex].row == rowIndex || this.grids[loopIndex].col == colIndex || groupIndex == this.getGridGroupIndex(loopIndex)) {
              this.grids[loopIndex].textColor = "#333333";
            } else {
              this.grids[loopIndex].textColor = "var(--text-color)";
            }
          } else if (this.grids[loopIndex].value == this.grids[loopIndex].userValue) {
            this.grids[loopIndex].textColor = "#2AAD67";
          } else {
            this.grids[loopIndex].textColor = "#ff0000";
          }
        }
      }
    },
    getGridGroupIndex(cellIndex) {
      var blockIndex = 1;
      if (cellIndex % 9 < 3) {
        if (Math.floor(cellIndex / 9) < 3) {
          blockIndex = 1;
        } else if (Math.floor(cellIndex / 9) < 6) {
          blockIndex = 4;
        } else {
          blockIndex = 7;
        }
      } else if (cellIndex % 9 < 6) {
        if (Math.floor(cellIndex / 9) < 3) {
          blockIndex = 2;
        } else if (Math.floor(cellIndex / 9) < 6) {
          blockIndex = 5;
        } else {
          blockIndex = 8;
        }
      } else if (Math.floor(cellIndex / 9) < 3) {
        blockIndex = 3;
      } else if (Math.floor(cellIndex / 9) < 6) {
        blockIndex = 6;
      } else {
        blockIndex = 9;
      }
      return blockIndex;
    },
    inputNumber(enteredNumber) {
      if (this.gameState != 2 || this.selectedGridIndex == null || this.grids[this.selectedGridIndex].visibility) {
        return;
      }
      if (enteredNumber == "") {
        this.grids[this.selectedGridIndex].userValue = 0;
        return;
      }
      this.grids[this.selectedGridIndex].userValue = Number(enteredNumber);
      if (this.grids[this.selectedGridIndex].value == this.grids[this.selectedGridIndex].userValue) {
        this.setGridStype(this.selectedGridIndex);
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
        var isAllCorrect = true;
        for (var gridLoopIndex = 0; gridLoopIndex < this.grids.length; gridLoopIndex++) {
          if (!this.grids[gridLoopIndex].visibility && this.grids[gridLoopIndex].value != this.grids[gridLoopIndex].userValue) {
            isAllCorrect = false;
            break;
          }
        }
        if (isAllCorrect) {
          c.clearAllSchedule();
          var gameElapsedTime = new Date().getTime() - this.gameStartTime;
          var rankingData = {
            programName: this.programName,
            levelGroup: this.levelGroupCodeArr[this.levelGroupIndex],
            time: gameElapsedTime
          };
          var rankingPayload = rankingData;
          c.game.addRankingList(rankingPayload);
          this.emoji = "👏";
          this.scoreDesc = "您通关了，用时 " + Number((gameElapsedTime / 1000).toFixed(3)) + " 秒。";
          this.gameState = 3;
          c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
        }
      } else {
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        this.grids[this.selectedGridIndex].textColor = "#ff0000";
        this.lives--;
        if (this.lives == 0) {
          this.gameState = 3;
          c.clearAllSchedule();
          this.emoji = "🙂";
          this.scoreDesc = "你的错误次数超过3次，游戏结束，再接再厉。";
        }
      }
    }
  }
}).use(ElementPlus).mount(".main-body");