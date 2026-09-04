c.preventCheat();
const GRID_SIZE = 4;
const DEFAULT_GAP = 12;
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    const gridLengthObj = {
      length: GRID_SIZE
    };
    return {
      programName: "2048",
      gameAreaWidth: 0,
      gameState: 1,
      gameStartTime: 0,
      gameEndTime: 0,
      gameTimeStr: 0,
      grid: Array.from(gridLengthObj, () => Array(GRID_SIZE).fill(0)),
      tiles: [],
      score: 0,
      gameOver: false,
      showWin: false,
      has2048: false,
      startTime: 0,
      elapsed: 0,
      isMoving: false,
      tileSize: 0,
      isPointerDown: false,
      pointerStartX: 0,
      pointerStartY: 0,
      moveThreshold: 20,
      tileIdCounter: 0,
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
      c.clearAllSchedule();
      this.gameState = 2;
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = 0;
      c.schedule(() => {
        var elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameTimeStr = Math.floor(elapsedTime / 1000);
      }, 1000);
      const gridSizeObj = {
        length: GRID_SIZE
      };
      this.grid = Array.from(gridSizeObj, () => Array(GRID_SIZE).fill(0));
      this.tiles = [];
      this.score = 0;
      this.gameOver = false;
      this.showWin = false;
      this.has2048 = false;
      this.elapsed = 0;
      this.startTime = Date.now();
      this.tileIdCounter = 0;
      this.isMoving = false;
      this.isPointerDown = false;
      const emptyPositions = this.getEmptyPositions();
      if (emptyPositions.length > 0) {
        const [rowIndex, colIndex] = emptyPositions[this.randRange(0, emptyPositions.length - 1)];
        this.grid[rowIndex][colIndex] = 2;
      }
      const freePositions = this.getEmptyPositions();
      if (freePositions.length > 0) {
        const [freeRowIndex, emptyCellCol] = freePositions[this.randRange(0, freePositions.length - 1)];
        this.grid[freeRowIndex][emptyCellCol] = 2;
      }
      window.removeEventListener("resize", this.onResize);
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      setTimeout(() => {
        this.calcTileSize();
        this.buildTiles(true);
        window.addEventListener("resize", this.onResize);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
      }, 80);
    },
    randRange(minValue, maxValue) {
      return Math.round(Math.random() * (maxValue - minValue) + minValue);
    },
    getEmptyPositions() {
      const emptyCells = [];
      for (let emptyRowIdx = 0; emptyRowIdx < GRID_SIZE; emptyRowIdx++) {
        for (let emptyColIdx = 0; emptyColIdx < GRID_SIZE; emptyColIdx++) {
          if (this.grid[emptyRowIdx][emptyColIdx] === 0) {
            emptyCells.push([emptyRowIdx, emptyColIdx]);
          }
        }
      }
      return emptyCells;
    },
    createTileId() {
      return ++this.tileIdCounter;
    },
    getGap() {
      if (!this.$refs.boardEl) {
        return DEFAULT_GAP;
      }
      const boardRect = this.$refs.boardEl.getBoundingClientRect();
      const boardWidth = boardRect.width || 400;
      return Math.max(6, boardWidth * 0.025);
    },
    calcTileSize() {
      if (!this.$refs.boardEl) {
        return;
      }
      const boardElementRect = this.$refs.boardEl.getBoundingClientRect();
      const boardElementWidth = boardElementRect.width || 400;
      const gap = this.getGap();
      const cellSize = (boardElementWidth - gap * (GRID_SIZE - 1)) / GRID_SIZE;
      this.tileSize = Math.floor(cellSize);
    },
    getFontSizeForNum(tileValue) {
      let fontSize = 32;
      if (tileValue < 100) {
        fontSize = 32;
      } else if (tileValue < 1000) {
        fontSize = 28;
      } else if (tileValue < 10000) {
        fontSize = 22;
      } else {
        fontSize = 18;
      }
      return fontSize * this.gameAreaWidth / 500;
    },
    buildTiles(animate = false) {
      const tiles = [];
      const gridGap = this.getGap();
      const tileSize = this.tileSize;
      for (let gridRowIdx = 0; gridRowIdx < GRID_SIZE; gridRowIdx++) {
        for (let gridColIdx = 0; gridColIdx < GRID_SIZE; gridColIdx++) {
          const cellValue = this.grid[gridRowIdx][gridColIdx];
          if (cellValue === 0) {
            continue;
          }
          let existingTile = this.tiles.find(tile => tile.row === gridRowIdx && tile.col === gridColIdx && tile.num === cellValue);
          let tileId;
          let flag0 = false;
          let flag1 = false;
          if (existingTile) {
            tileId = existingTile.id;
            if (existingTile.num !== cellValue) {
              flag1 = true;
            }
            flag0 = existingTile.pop || false;
          } else {
            tileId = this.createTileId();
            flag0 = animate;
          }
          if (animate && !existingTile) {
            flag0 = true;
          }
          const fontSize = this.getFontSizeForNum(cellValue);
          tiles.push({
            id: tileId,
            row: gridRowIdx,
            col: gridColIdx,
            num: cellValue,
            left: gridColIdx * (tileSize + gridGap),
            top: gridRowIdx * (tileSize + gridGap),
            pop: flag0,
            merge: flag1 || false,
            fontSize: fontSize
          });
        }
      }
      this.tiles = tiles;
    },
    updateTilePositions() {
      const gapSize = this.getGap();
      const tileSizePx = this.tileSize;
      for (const tileItem of this.tiles) {
        tileItem.left = tileItem.col * (tileSizePx + gapSize);
        tileItem.top = tileItem.row * (tileSizePx + gapSize);
      }
    },
    moveLine(line) {
      const mergedLine = [];
      let index = 0;
      while (index < line.length) {
        if (index + 1 < line.length && line[index].num === line[index + 1].num) {
          const doubledValue = line[index].num * 2;
          mergedLine.push({
            num: doubledValue,
            ids: [line[index].id, line[index + 1].id],
            row: line[index].row,
            col: line[index].col,
            merged: true
          });
          index += 2;
        } else {
          const currentMergeGroup = {
            num: line[index].num,
            ids: [line[index].id],
            row: line[index].row,
            col: line[index].col,
            merged: false
          };
          mergedLine.push(currentMergeGroup);
          index++;
        }
      }
      while (mergedLine.length < GRID_SIZE) {
        const emptyMergeGroup = {
          num: 0,
          ids: [],
          row: -1,
          col: -1,
          merged: false
        };
        mergedLine.push(emptyMergeGroup);
      }
      return mergedLine;
    },
    extractLine(board) {
      const extractedLine = [];
      if (board === "left" || board === "right") {
        for (let gridIndex = 0; gridIndex < GRID_SIZE; gridIndex++) {
          const rowTiles = [];
          for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
            const gridValue = this.grid[gridIndex][colIdx];
            if (gridValue !== 0) {
              const matchedTile = this.tiles.find(tileCandidate => tileCandidate.row === gridIndex && tileCandidate.col === colIdx && tileCandidate.num === gridValue);
              rowTiles.push({
                num: gridValue,
                id: matchedTile ? matchedTile.id : this.createTileId(),
                row: gridIndex,
                col: colIdx
              });
            }
          }
          if (board === "right") {
            rowTiles.reverse();
          }
          extractedLine.push(rowTiles);
        }
      } else {
        for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
          const columnTiles = [];
          for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
            const cellValue = this.grid[rowIdx][colIdx];
            if (cellValue !== 0) {
              const matchedTile = this.tiles.find(tileObj => tileObj.row === rowIdx && tileObj.col === colIdx && tileObj.num === cellValue);
              columnTiles.push({
                num: cellValue,
                id: matchedTile ? matchedTile.id : this.createTileId(),
                row: rowIdx,
                col: colIdx
              });
            }
          }
          if (board === "down") {
            columnTiles.reverse();
          }
          extractedLine.push(columnTiles);
        }
      }
      return extractedLine;
    },
    applyLineResult(grid, lineResult) {
      const rowCountSource = {
        length: GRID_SIZE
      };
      const resultGrid = Array.from(rowCountSource, () => Array(GRID_SIZE).fill(0));
      const resultList = [];
      if (lineResult === "left" || lineResult === "right") {
        for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
          let rowTiles = grid[rowIdx];
          if (lineResult === "right") {
            rowTiles = [...rowTiles].reverse();
          }
          for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
            const cellObj = rowTiles[colIdx];
            if (cellObj && cellObj.num > 0) {
              resultGrid[rowIdx][colIdx] = cellObj.num;
              for (let idIndex = 0; idIndex < cellObj.ids.length; idIndex++) {
                const currentTileId = cellObj.ids[idIndex];
                const isMergedSecondPosition = cellObj.merged && idIndex === 1;
                const tileMoveInfo = {
                  id: currentTileId,
                  row: rowIdx,
                  col: colIdx,
                  num: cellObj.num,
                  merged: cellObj.merged || false,
                  dying: isMergedSecondPosition
                };
                resultList.push(tileMoveInfo);
              }
            }
          }
        }
      } else {
        for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
          let currentRowTiles = grid[rowIndex];
          if (lineResult === "down") {
            currentRowTiles = [...currentRowTiles].reverse();
          }
          for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
            const cell = currentRowTiles[colIndex];
            if (cell && cell.num > 0) {
              resultGrid[colIndex][rowIndex] = cell.num;
              for (let idIndex = 0; idIndex < cell.ids.length; idIndex++) {
                const tileId = cell.ids[idIndex];
                const isMergedSecondCellId = cell.merged && idIndex === 1;
                const tileUpdateInfo = {
                  id: tileId,
                  row: colIndex,
                  col: rowIndex,
                  num: cell.num,
                  merged: cell.merged || false,
                  dying: isMergedSecondCellId
                };
                resultList.push(tileUpdateInfo);
              }
            }
          }
        }
      }
      const moveResult = {
        newGrid: resultGrid,
        tileUpdates: resultList
      };
      return moveResult;
    },
    performMove(direction) {
      if (this.isMoving) {
        return false;
      }
      if (this.gameOver) {
        return false;
      }
      this.isMoving = true;
      const lines = this.extractLine(direction);
      const movedLines = lines.map(lineData => this.moveLine(lineData));
      const {
        newGrid: newGrid,
        tileUpdates: tileUpdates
      } = this.applyLineResult(movedLines, direction);
      let hasMoved = false;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex++) {
          if (this.grid[i][columnIndex] !== newGrid[i][columnIndex]) {
            hasMoved = true;
            break;
          }
        }
        if (hasMoved) {
          break;
        }
      }
      if (!hasMoved) {
        this.isMoving = false;
        return false;
      }
      this.grid = newGrid;
      let totalScore = 0;
      for (const lineUpdates of movedLines) {
        for (const updateEntry of lineUpdates) {
          if (updateEntry.merged) {
            totalScore += updateEntry.num;
          }
        }
      }
      const tileMap = {};
      for (const tileUpdate of tileUpdates) {
        tileMap[tileUpdate.id] = tileUpdate;
      }
      const tileList = [];
      const mergedTileIds = new Set();
      for (const tile of this.tiles) {
        if (tileMap[tile.id]) {
          const pairedTile = tileMap[tile.id];
          tile.row = pairedTile.row;
          tile.col = pairedTile.col;
          tile.num = pairedTile.num;
          tile.merge = pairedTile.merged || false;
          tile.pop = false;
          tile.dying = pairedTile.dying || false;
          mergedTileIds.add(tile.id);
          tileList.push(tile);
        }
      }
      for (const tileUpdate of tileUpdates) {
        if (!mergedTileIds.has(tileUpdate.id)) {
          const fontSize = this.getFontSizeForNum(tileUpdate.num);
          const options = {
            id: tileUpdate.id,
            row: tileUpdate.row,
            col: tileUpdate.col,
            num: tileUpdate.num,
            left: 0,
            top: 0,
            pop: true,
            merge: false,
            dying: tileUpdate.dying || false,
            fontSize: fontSize
          };
          tileList.push(options);
          mergedTileIds.add(tileUpdate.id);
        }
      }
      this.tiles = tileList;
      const gap = this.getGap();
      const tileSize = this.tileSize;
      for (const tile of this.tiles) {
        tile.left = tile.col * (tileSize + gap);
        tile.top = tile.row * (tileSize + gap);
      }
      if (totalScore > 0) {
        this.score += totalScore;
      }
      if (!this.has2048) {
        for (const currentTile of this.tiles) {
          if (currentTile.num === 2048) {
            this.has2048 = true;
            this.showWin = true;
            c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
            break;
          }
        }
      }
      const emptyPositions = this.getEmptyPositions();
      if (emptyPositions.length > 0) {
        const randomIndex = this.randRange(0, emptyPositions.length - 1);
        const [rowIndex, colIndex] = emptyPositions[randomIndex];
        const newTileValue = Math.random() < 0.9 ? 2 : 4;
        this.grid[rowIndex][colIndex] = newTileValue;
        const tileFontSize = this.getFontSizeForNum(newTileValue);
        const tileId = this.createTileId();
        const tileGap = this.getGap();
        const newTileSize = this.tileSize;
        this.tiles.push({
          id: tileId,
          row: rowIndex,
          col: colIndex,
          num: newTileValue,
          left: colIndex * (newTileSize + tileGap),
          top: rowIndex * (newTileSize + tileGap),
          pop: true,
          merge: false,
          fontSize: tileFontSize
        });
      }
      if (this.checkGameOver()) {
        this._moving = true;
        c.clearAllSchedule();
        this.gameEndTime = new Date().getTime();
        let gameDuration = this.gameEndTime - this.gameStartTime;
        const rankingRecord = {
          programName: this.programName,
          score: this.score,
          time: gameDuration
        };
        var rankingData = rankingRecord;
        c.game.addRankingList(rankingData);
        c.scheduleOnce(() => {
          if (this.score <= 100) {
            this.emoji = "😥";
          } else if (this.score <= 300) {
            this.emoji = "🙂";
          } else if (this.score < 1000) {
            this.emoji = "👏";
          } else {
            this.emoji = "😎";
          }
          this.scoreDesc = "您获得了 {0} 分，用时 {1} 秒。".replace("{0}", this.score).replace("{1}", Number((gameDuration / 1000).toFixed(3)));
          this.gameOver = true;
        }, 600);
      }
      setTimeout(() => {
        for (const tileToReset of this.tiles) {
          tileToReset.merge = false;
          tileToReset.pop = false;
        }
      }, 300);
      setTimeout(() => {
        this.tiles = this.tiles.filter(tileForFilter => !tileForFilter.dying);
        this.isMoving = false;
      }, 350);
      return true;
    },
    checkGameOver() {
      for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
        for (let column = 0; column < GRID_SIZE; column++) {
          if (this.grid[rowIdx][column] === 0) {
            return false;
          }
        }
      }
      for (let gridIdx = 0; gridIdx < GRID_SIZE; gridIdx++) {
        for (let mergeIdx = 0; mergeIdx < GRID_SIZE - 1; mergeIdx++) {
          if (this.grid[gridIdx][mergeIdx] === this.grid[gridIdx][mergeIdx + 1]) {
            return false;
          }
        }
      }
      for (let cellIdx = 0; cellIdx < GRID_SIZE; cellIdx++) {
        for (let slideIdx = 0; slideIdx < GRID_SIZE - 1; slideIdx++) {
          if (this.grid[slideIdx][cellIdx] === this.grid[slideIdx + 1][cellIdx]) {
            return false;
          }
        }
      }
      return true;
    },
    moveLeft() {
      this.performMove("left");
    },
    moveRight() {
      this.performMove("right");
    },
    moveUp() {
      this.performMove("up");
    },
    moveDown() {
      this.performMove("down");
    },
    onTouchStart(touchStartEvent) {
      const firstTouch = touchStartEvent.touches[0];
      if (!firstTouch) {
        return;
      }
      this.pointerStartX = firstTouch.clientX;
      this.pointerStartY = firstTouch.clientY;
      this.isPointerDown = true;
    },
    onTouchMove(touchMoveEvent) {
      if (!this.isPointerDown) {
        return;
      }
      const firstTouch = touchMoveEvent.touches[0];
      if (!firstTouch) {
        return;
      }
      this.handlePointerMove(firstTouch.clientX, firstTouch.clientY);
    },
    onTouchEnd(touchEndEvent) {
      this.isPointerDown = false;
    },
    onMouseDown(mouseDownEvent) {
      if (mouseDownEvent.button !== 0) {
        return;
      }
      this.pointerStartX = mouseDownEvent.clientX;
      this.pointerStartY = mouseDownEvent.clientY;
      this.isPointerDown = true;
    },
    onMouseMove(mouseMoveEvent) {
      if (!this.isPointerDown) {
        return;
      }
      this.handlePointerMove(mouseMoveEvent.clientX, mouseMoveEvent.clientY);
    },
    onMouseUp(mouseUpEvent) {
      this.isPointerDown = false;
    },
    handlePointerMove(pointerX, pointerY) {
      const deltaX = pointerX - this.pointerStartX;
      const deltaY = pointerY - this.pointerStartY;
      if (Math.abs(deltaX) < this.moveThreshold && Math.abs(deltaY) < this.moveThreshold) {
        return;
      }
      this.isPointerDown = false;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.moveRight();
        } else {
          this.moveLeft();
        }
      } else if (deltaY > 0) {
        this.moveDown();
      } else {
        this.moveUp();
      }
    },
    continueGame() {
      this.showWin = false;
    },
    onResize() {
      this.calcTileSize();
      this.updateTilePositions();
    }
  }
}).use(ElementPlus).mount(".main-body");