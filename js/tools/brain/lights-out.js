c.preventCheat();
const dialogComponentMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogComponentMap,
  data() {
    const programConfig = {
      programName: "熄灯游戏",
      levelGroupIndex: 0,
      levelGroupDescArr: ["容易", "普通", "困难"],
      levelGroupCodeArr: ["容易", "普通", "困难"],
      gameAreaWidth: 0,
      gameState: 1,
      countdown: 180,
      level: 1,
      score: 0,
      levelMoves: 0,
      gameTimeInterval: null,
      isPlaying: false,
      gamePlayObj: null,
      resultTipIcon: "",
      resultTipColor: "",
      resultTipShow: false,
      N: 5,
      grid: [],
      initialGrid: [],
      hintIndex: -1,
      leastMoves: 0,
      emoji: "",
      scoreDesc: ""
    };
    return programConfig;
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
    changeLevelGroup(levelGroup) {
      c.clearAllSchedule();
      this.levelGroupIndex = levelGroup;
      if (this.gameState == 2) {
        this.startGame();
      }
    },
    cloneGrid(grid) {
      return grid.map(row => [...row]);
    },
    applyClick(board, rowIndex, colIndex) {
      colIndex[board][rowIndex] ^= 1;
      if (board > 0) {
        colIndex[board - 1][rowIndex] ^= 1;
      }
      if (board < this.N - 1) {
        colIndex[board + 1][rowIndex] ^= 1;
      }
      if (rowIndex > 0) {
        colIndex[board][rowIndex - 1] ^= 1;
      }
      if (rowIndex < this.N - 1) {
        colIndex[board][rowIndex + 1] ^= 1;
      }
    },
    isAllOff(gridState) {
      for (let rowIndex = 0; rowIndex < this.N; rowIndex++) {
        for (let columnIndex = 0; columnIndex < this.N; columnIndex++) {
          if (gridState[rowIndex][columnIndex]) {
            return false;
          }
        }
      }
      return true;
    },
    startGame() {
      c.clearAllSchedule();
      this.level = 1;
      this.score = 0;
      this.levelMoves = 0;
      this.gameState = 2;
      this.countdown = 180;
      this.hintIndex = -1;
      this.isPlaying = false;
      this.gameTimeInterval = c.schedule(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          c.clearSchedule(this.gameTimeInterval);
          this.gameState = 3;
          var resultString = "";
          if (this.score <= 50) {
            resultString = "😥";
          } else if (this.score <= 100) {
            resultString = "🙂";
          } else if (this.score < 300) {
            resultString = "👏";
          } else {
            resultString = "😎";
          }
          if (this.score > 300) {
            c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
          }
          this.emoji = resultString;
          this.scoreDesc = "您获得了 " + this.score + " 分。";
          const gameOptions = {
            programName: this.programName,
            levelGroup: this.levelGroupCodeArr[this.levelGroupIndex],
            score: this.score
          };
          var optionsReference = gameOptions;
          c.game.addRankingList(optionsReference);
        }
      }, 1000);
      c.scheduleOnce(() => {
        this.gamePlayObj = document.querySelector(".lights-grid");
        this.generateLevel();
      }, 80);
    },
    generateLevel() {
      this.resultTipShow = false;
      let initialValue = 0;
      if (this.levelGroupIndex == 0) {
        initialValue = 3 + Math.floor((this.level - 1) / 3);
        if (initialValue > 5) {
          initialValue = 5;
        }
      } else if (this.levelGroupIndex == 1) {
        initialValue = 6 + Math.floor((this.level - 1) / 3);
        if (initialValue > 8) {
          initialValue = 8;
        }
      } else {
        initialValue = 9 + Math.floor((this.level - 1) / 3);
        if (initialValue > 15) {
          initialValue = 15;
        }
      }
      console.log("最少步数：" + initialValue);
      this.leastMoves = initialValue;
      let itemList = [];
      let isSolved = false;
      do {
        itemList = [];
        let currentValue = initialValue;
        while (currentValue > 0) {
          const randomIndex = Math.floor(Math.random() * this.N);
          const randomCol = Math.floor(Math.random() * this.N);
          const cellExists = itemList.some(cellInfo => cellInfo.r === randomIndex && cellInfo.c === randomCol);
          if (cellExists) {
            continue;
          }
          const randomCell = {
            r: randomIndex,
            c: randomCol
          };
          itemList.push(randomCell);
          currentValue--;
        }
        const arrayLikeLength = {
          length: this.N
        };
        const tempGrid = Array.from(arrayLikeLength, () => Array(this.N).fill(0));
        for (const cell of itemList) {
          this.applyClick(cell.r, cell.c, tempGrid);
        }
        isSolved = this.isAllOff(tempGrid);
      } while (isSolved);
      this.grid = Array.from({
        length: this.N
      }, () => Array(this.N).fill(0));
      for (const cellItem of itemList) {
        this.applyClick(cellItem.r, cellItem.c, this.grid);
      }
      this.initialGrid = this.cloneGrid(this.grid);
      this.levelMoves = 0;
      this.hintIndex = -1;
      this.gamePlayObj.style.transform = "translateX(300px)";
      this.gamePlayObj.style.opacity = 0;
      anime({
        targets: this.gamePlayObj,
        translateX: 0,
        opacity: 1,
        duration: 300,
        easing: "easeInOutSine",
        complete: () => {
          this.isPlaying = true;
        }
      });
    },
    handleCellClick(clickRow, col) {
      if (!this.isPlaying) {
        return;
      }
      this.applyClick(clickRow, col, this.grid);
      this.levelMoves++;
      this.hintIndex = -1;
      if (this.isAllOff(this.grid)) {
        this.onLevelComplete();
      } else {
        c.playAudio(staticSiteHost + "/audio/brain/kai-guan.mp3");
      }
    },
    onLevelComplete() {
      let moveBonus = Math.max(0, this.leastMoves * 3 - this.levelMoves);
      let countdownBonus = Math.floor(this.countdown / 10);
      let levelScore = 10 + Math.floor(this.level / 2) * 5 + moveBonus + countdownBonus;
      this.score += levelScore;
      console.log("🎉 过关！ +" + levelScore + " 分  (关卡奖励 +" + (100 + Math.floor(this.level / 2) * 50) + "，步数奖励 +" + moveBonus + "，时间奖励 +" + countdownBonus + ")", "success");
      c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
      this.isPlaying = false;
      this.resultTipIcon = "✔";
      this.resultTipColor = "#2AAD67";
      this.resultTipShow = true;
      c.scheduleOnce(() => {
        anime({
          targets: this.gamePlayObj,
          translateX: -300,
          opacity: 0,
          duration: 300,
          easing: "easeInOutSine",
          complete: () => {
            this.level++;
            this.generateLevel();
          }
        });
      }, 500);
    },
    resetLevel() {
      if (!this.isPlaying) {
        return;
      }
      this.grid = this.cloneGrid(this.initialGrid);
      this.levelMoves = 0;
      this.hintIndex = -1;
    },
    showHint() {
      if (!this.isPlaying || this.hintIndex != -1) {
        return;
      }
      const solveResult = this.solveLightsOut(this.grid);
      if (solveResult && solveResult.length > 0) {
        const firstMove = solveResult[0];
        const firstMoveIndex = firstMove.r * this.N + firstMove.c;
        this.hintIndex = firstMoveIndex;
        this.score -= 15;
      } else {
        this.$message({
          message: "⚠️ 无法计算提示",
          type: "error",
          grouping: true
        });
      }
    },
    solveLightsOut(gridMatrix) {
      const cellCount = this.N * this.N;
      const rowSource = {
        length: cellCount
      };
      let matrix = Array.from(rowSource, () => Array(cellCount + 1).fill(0));
      for (let outerRow = 0; outerRow < this.N; outerRow++) {
        for (let innerCol = 0; innerCol < this.N; innerCol++) {
          const cellIndex = outerRow * this.N + innerCol;
          for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
              if (Math.abs(rowOffset) + Math.abs(colOffset) !== 1 && (rowOffset !== 0 || colOffset !== 0)) {
                continue;
              }
              const neighborRow = outerRow + rowOffset;
              const neighborCol = innerCol + colOffset;
              if (neighborRow >= 0 && neighborRow < this.N && neighborCol >= 0 && neighborCol < this.N) {
                const neighborIndex = neighborRow * this.N + neighborCol;
                matrix[neighborIndex][cellIndex] = 1;
              }
            }
          }
          matrix[outerRow * this.N + innerCol][cellIndex] = 1;
        }
      }
      for (let rowLoop = 0; rowLoop < this.N; rowLoop++) {
        for (let colLoop = 0; colLoop < this.N; colLoop++) {
          matrix[rowLoop * this.N + colLoop][cellCount] = gridMatrix[rowLoop][colLoop] ^ 0;
        }
      }
      let startIndex = 0;
      let loopBase = 0;
      let cacheArray = Array(cellCount).fill(-1);
      while (startIndex < cellCount && loopBase < cellCount) {
        let currentIndex = startIndex;
        for (let outerIndex = startIndex; outerIndex < cellCount; outerIndex++) {
          if (matrix[outerIndex][loopBase]) {
            currentIndex = outerIndex;
            break;
          }
        }
        if (!matrix[currentIndex][loopBase]) {
          loopBase++;
          continue;
        }
        [matrix[startIndex], matrix[currentIndex]] = [matrix[currentIndex], matrix[startIndex]];
        cacheArray[loopBase] = startIndex;
        for (let innerIndex = 0; innerIndex < cellCount; innerIndex++) {
          if (innerIndex !== startIndex && matrix[innerIndex][loopBase]) {
            for (let forwardIndex = loopBase; forwardIndex <= cellCount; forwardIndex++) {
              matrix[innerIndex][forwardIndex] ^= matrix[startIndex][forwardIndex];
            }
          }
        }
        startIndex++;
        loopBase++;
      }
      for (let scanIndex = 0; scanIndex < cellCount; scanIndex++) {
        let foundFlag = true;
        for (let loopIndex = 0; loopIndex < cellCount; loopIndex++) {
          if (matrix[scanIndex][loopIndex]) {
            foundFlag = false;
            break;
          }
        }
        if (foundFlag && matrix[scanIndex][cellCount]) {
          return null;
        }
      }
      let solutionVector = Array(cellCount).fill(0);
      for (let cellLoopIndex = 0; cellLoopIndex < cellCount; cellLoopIndex++) {
        if (cacheArray[cellLoopIndex] !== -1) {
          solutionVector[cellLoopIndex] = matrix[cacheArray[cellLoopIndex]][cellCount];
        }
      }
      const emptyArray = [];
      for (let cellNum = 0; cellNum < cellCount; cellNum++) {
        if (solutionVector[cellNum]) {
          const cellRow = Math.floor(cellNum / this.N);
          const cellCol = cellNum % this.N;
          const cellCoord = {
            r: cellRow,
            c: cellCol
          };
          emptyArray.push(cellCoord);
        }
      }
      return emptyArray;
    }
  }
}).use(ElementPlus).mount(".main-body");