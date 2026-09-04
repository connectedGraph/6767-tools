const ShuDuDirectionEnum = { Easy: 1, Normal: 2, Hard: 3 };
class Choice {
  constructor(choiceSetParam) {
    this.choiceSet = choiceSetParam;
    this.attemptIndex = -1;
  }
  next() {
    this.attemptIndex++;
    if (this.attemptIndex < this.choiceSet.length) {
      return this.choiceSet[this.attemptIndex];
    }
    return undefined;
  }
}
class Grid {
  constructor(rowParam, colParam) {
    this.row = rowParam;
    this.col = colParam;
    this.visibility = true;
    this.value = 0;
    this.userValue = 0;
    this.choice = undefined;
    this.bgColor = "var(--bg-color)";
    this.textColor = "var(--text-color)";
  }
  setValue(value) {
    this.value = value;
  }
  placeValue(placedValue) {
    this.userValue = placedValue;
  }
  isRight() {
    return this.value === this.userValue;
  }
  setVisible(visible) {
    this.visibility = visible;
  }
  isVisible() {
    return this.visibility;
  }
  static isValidValue(candidateValue) {
    return candidateValue > 0 && candidateValue < 10;
  }
  static blockBelonged(cellIndex) {
    return {
      row: Math.floor(cellIndex.row / 3),
      col: Math.floor(cellIndex.col / 3)
    };
  }
}
class Utils {
  static distinctArray(inputArray) {
    return inputArray.sort().reduce((accumulator, currentValue) => {
      if (accumulator.length === 0 || accumulator[accumulator.length - 1] !== currentValue) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  }
  static getRandomValue(config) {
    config = config || {};
    let basicValues = config.basic;
    const excludeValues = config.exclude;
    if (excludeValues && excludeValues.length > 0) {
      basicValues = [];
      for (let digit = 1; digit <= 9; digit++) {
        if (excludeValues.indexOf(digit) === -1) {
          basicValues.push(digit);
        }
      }
      basicValues.sort((numA, numB) => numA - numB);
    } else if (basicValues === undefined) {
      basicValues = this.genBasicArray();
    }
    if (!config.keepOrder) {
      return this.randomArray(basicValues);
    }
    return basicValues;
  }
  static randomArray(sourceArray) {
    const arrayLength = sourceArray.length;
    const resultArray = new Array(arrayLength);
    let lowerBound = 0;
    for (let arrayIndex = 0; arrayIndex < arrayLength; arrayIndex++) {
      const randomIndex = Math.floor(Math.random() * (arrayLength - lowerBound));
      resultArray[arrayIndex] = sourceArray[randomIndex];
      sourceArray[randomIndex] = sourceArray[arrayLength - 1 - lowerBound];
      sourceArray[arrayLength - 1 - lowerBound] = 0;
      lowerBound++;
    }
    return resultArray;
  }
  static isGridsValueValid(gridsValue) {
    const distinctGrids = this.distinctArray(gridsValue);
    let count = 0;
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      count += distinctGrids[rowIndex];
    }
    return count === 45;
  }
  static genBasicArray() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
}
class Board {
  constructor() {
    this.grids = new Array(81);
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      for (let blockIndex = 0; blockIndex < 9; blockIndex++) {
        this.grids[colIndex * 9 + blockIndex] = new Grid(colIndex, blockIndex);
      }
    }
  }
  init() {
    const rowGrids = this.getRowGrids(0);
    const randomValues = Utils.getRandomValue();
    randomValues.forEach((randomValue, index) => {
      rowGrids[index].setValue(randomValue);
    });
    let var0;
    let var1;
    let currentGrid;
    let var2;
    for (let rowIndex = 1; rowIndex < 9; rowIndex++) {
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        currentGrid = this.grids[rowIndex * 9 + colIndex];
        if (currentGrid.choice === undefined) {
          var0 = this.getUsedValueArrayAt({
            row: rowIndex,
            col: colIndex
          });
          var1 = Utils.getRandomValue({
            exclude: var0
          });
          currentGrid.choice = new Choice(var1);
        }
        var2 = this.populateGrid(currentGrid);
        rowIndex = var2.i;
        colIndex = var2.j;
      }
    }
  }
  populateGrid(grid) {
    let cellRow = grid.row;
    let cellCol = grid.col;
    const nextChoice = grid.choice.next();
    if (nextChoice !== undefined) {
      grid.setValue(nextChoice);
    } else {
      grid.value = 0;
      grid.choice = undefined;
      if (cellCol === 0) {
        cellRow -= 1;
        cellCol -= 1;
        this.resetPartialGrids({
          rowStart: cellRow,
          rowEnd: cellRow + 1,
          colStart: 1,
          colEnd: 9
        });
      } else {
        cellCol -= 2;
      }
    }
    return {
      i: cellRow,
      j: cellCol
    };
  }
  getRandomValidValue(targetRowIndex) {
    const usedValueArray = this.getUsedValueArrayAt(targetRowIndex);
    const randomValue = Utils.getRandomValue({
      exclude: usedValueArray
    });
    if (randomValue[0] === undefined) {
      return 0;
    } else {
      return randomValue[0];
    }
  }
  getUsedValueArray(sourceRowIndex) {
    const rowGrids = this.getGrids(sourceRowIndex);
    const resultValues = [];
    rowGrids.forEach(gridItem => {
      if (Grid.isValidValue(gridItem.value)) {
        resultValues.push(gridItem.value);
      }
    });
    return resultValues;
  }
  getUsedValueArrayAt(cell) {
    const row = cell.row;
    const col = cell.col;
    const blockIndex = Grid.blockBelonged(cell);
    const rowUsedValues = this.getUsedValueArray({
      mode: "row",
      row: row
    });
    const colUsedValues = this.getUsedValueArray({
      mode: "column",
      col: col
    });
    const blockUsedValues = this.getUsedValueArray({
      mode: "block",
      row: blockIndex.row,
      col: blockIndex.col
    });
    const usedValues = rowUsedValues.concat(colUsedValues, blockUsedValues);
    return Utils.distinctArray(usedValues);
  }
  getRowGrids(targetRowIndex) {
    const rowGridList = new Array(9);
    for (let colLoopIndex = 0; colLoopIndex < 9; colLoopIndex++) {
      rowGridList[colLoopIndex] = this.grids[colLoopIndex + targetRowIndex * 9];
    }
    return rowGridList;
  }
  getColumnGrids(columnIndex) {
    const columnGrids = new Array(9);
    for (let rowLoopIndex = 0; rowLoopIndex < 9; rowLoopIndex++) {
      columnGrids[rowLoopIndex] = this.grids[rowLoopIndex * 9 + columnIndex];
    }
    return columnGrids;
  }
  getBlockGrids(blockRow, blockCol) {
    const blockGrids = new Array(9);
    for (let innerRow = 0; innerRow < 3; innerRow++) {
      for (let innerCol = 0; innerCol < 3; innerCol++) {
        blockGrids[innerRow * 3 + innerCol] = this.grids[blockRow * 27 + blockCol * 3 + innerRow * 9 + innerCol];
      }
    }
    return blockGrids;
  }
  getPartialGrids(gridIndex) {
    const areaSize = (gridIndex.rowEnd - gridIndex.rowStart) * (gridIndex.colEnd - gridIndex.colStart);
    if (areaSize <= 0) {
      return [];
    }
    const blockGrids = [];
    for (let boxRowIndex = gridIndex.rowStart; boxRowIndex < gridIndex.rowEnd; boxRowIndex++) {
      for (let boxColIndex = gridIndex.colStart; boxColIndex < gridIndex.colEnd; boxColIndex++) {
        blockGrids.push(this.grids[boxRowIndex * 9 + boxColIndex]);
      }
    }
    return blockGrids;
  }
  resetPartialGrids(partialGridId) {
    const partialGrids = this.getPartialGrids(partialGridId);
    partialGrids.forEach(partialGrid => {
      partialGrid.value = 0;
      partialGrid.choice = undefined;
    });
  }
  getGrids(options) {
    const mode = options.mode;
    let var3;
    switch (mode) {
      case "row":
        var3 = this.getRowGrids(options.row);
        break;
      case "column":
        var3 = this.getColumnGrids(options.col);
        break;
      case "block":
        var3 = this.getBlockGrids(options.row, options.col);
        break;
      default:
        var3 = [];
        break;
    }
    return var3;
  }
  getBoardArray() {
    const gridValues = Array.from({
      length: 9
    }, () => Array(9).fill(0));
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        const gridCell = this.grids[rowIndex * 9 + colIndex];
        if (gridCell.isVisible()) {
          gridValues[rowIndex][colIndex] = gridCell.value;
        }
      }
    }
    return gridValues;
  }
  countSolutions(board) {
    board = board || 2;
    const boardArray = this.getBoardArray();
    let solutionCount = 0;
    const isSafeToPlace = (board, currentRow, cellCol, candidateNum) => {
      for (let colLoopIndex = 0; colLoopIndex < 9; colLoopIndex++) {
        if (board[currentRow][colLoopIndex] === candidateNum) {
          return false;
        }
      }
      for (let rowLoopIndex = 0; rowLoopIndex < 9; rowLoopIndex++) {
        if (board[rowLoopIndex][cellCol] === candidateNum) {
          return false;
        }
      }
      const boxStartRow = Math.floor(currentRow / 3) * 3;
      const boxStartCol = Math.floor(cellCol / 3) * 3;
      for (let boxRowOffset = 0; boxRowOffset < 3; boxRowOffset++) {
        for (let boxColOffset = 0; boxColOffset < 3; boxColOffset++) {
          if (board[boxStartRow + boxRowOffset][boxStartCol + boxColOffset] === candidateNum) {
            return false;
          }
        }
      }
      return true;
    };
    const solveSudoku = puzzleBoard => {
      for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
        for (let colIdx = 0; colIdx < 9; colIdx++) {
          if (puzzleBoard[rowIdx][colIdx] === 0) {
            for (let candidateNumber = 1; candidateNumber <= 9; candidateNumber++) {
              if (isSafeToPlace(puzzleBoard, rowIdx, colIdx, candidateNumber)) {
                puzzleBoard[rowIdx][colIdx] = candidateNumber;
                if (solveSudoku(puzzleBoard)) {
                  return true;
                }
                puzzleBoard[rowIdx][colIdx] = 0;
              }
            }
            return false;
          }
        }
      }
      solutionCount++;
      if (solutionCount >= board) {
        return true;
      }
      return false;
    };
    solveSudoku(boardArray);
    return solutionCount;
  }
}
class ShuDuCore {
  constructor(difficultyLevel) {
    this.board = new Board();
    this.board.init();
    if (difficultyLevel <= 0 || difficultyLevel > 3) {
      difficultyLevel = 1;
    }
    this.digTimes = difficultyLevel * 2;
    this.digBoard();
  }
  digBoard() {
    const totalDigCells = this.digTimes * 9;
    let filledCount = 0;
    const indexArray = Array.from({
      length: 81
    }, (ignoredValue, cellIndex) => cellIndex);
    for (let shuffleIndex = indexArray.length - 1; shuffleIndex > 0; shuffleIndex--) {
      const randomIndex = Math.floor(Math.random() * (shuffleIndex + 1));
      [indexArray[shuffleIndex], indexArray[randomIndex]] = [indexArray[randomIndex], indexArray[shuffleIndex]];
    }
    for (let cellIndex = 0; cellIndex < 81; cellIndex++) {
      this.board.grids[cellIndex].setVisible(true);
    }
    for (const indexValue of indexArray) {
      if (filledCount >= totalDigCells) {
        break;
      }
      const currentGrid = this.board.grids[indexValue];
      currentGrid.setVisible(false);
      if (this.board.countSolutions(2) === 1) {
        filledCount++;
      } else {
        currentGrid.setVisible(true);
      }
    }
  }
}