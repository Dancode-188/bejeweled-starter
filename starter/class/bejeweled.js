const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {
  constructor() {
    this.grid = [];
    this.cursor = new Cursor(8, 8);
    this.score = 0;
    Screen.initialize(8, 8);
    Screen.setGridlines(false);
    this.initializeGrid();
    this.cursor.setBackgroundColor();
    this.setCommands();
    Screen.render();
  }

  initializeGrid() {
    const gems = ["🍒", "🍋", "🍊", "🍓", "🫐", "🍇"];
    for (let i = 0; i < 8; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 8; j++) {
        this.grid[i][j] = gems[Math.floor(Math.random() * gems.length)];
        Screen.setGrid(i, j, this.grid[i][j]);
      }
    }
  }

  setCommands() {
    Screen.addCommand("up", "move cursor up", this.cursor.up.bind(this.cursor));
    Screen.addCommand(
      "down",
      "move cursor down",
      this.cursor.down.bind(this.cursor)
    );
    Screen.addCommand(
      "left",
      "move cursor left",
      this.cursor.left.bind(this.cursor)
    );
    Screen.addCommand(
      "right",
      "move cursor right",
      this.cursor.right.bind(this.cursor)
    );
    Screen.addCommand("space", "select gem", this.selectGem.bind(this));
    Screen.addCommand("r", "refresh board", this.refreshBoard.bind(this));
  }

  selectGem() {
    const swapResult = this.cursor.select();
    if (swapResult) {
      this.swap(
        swapResult.from.row,
        swapResult.from.col,
        swapResult.to.row,
        swapResult.to.col
      );
    }
    Screen.render();
  }

  refreshBoard() {
    this.initializeGrid();
    this.score = 0;
    Screen.setMessage(`Score: ${this.score}`);
    Screen.render();
  }

  swap(row1, col1, row2, col2) {
    if (this.isValidSwap(row1, col1, row2, col2)) {
      const temp = this.grid[row1][col1];
      this.grid[row1][col1] = this.grid[row2][col2];
      this.grid[row2][col2] = temp;

      Screen.setGrid(row1, col1, this.grid[row1][col1]);
      Screen.setGrid(row2, col2, this.grid[row2][col2]);

      const matches = Bejeweled.checkForMatches(this.grid);
      if (matches.length > 0) {
        this.removeMatches(matches);
        this.fillEmptySpaces();
        this.updateScore(matches.length);
      } else {
        // Swap back if no matches
        const tempBack = this.grid[row1][col1];
        this.grid[row1][col1] = this.grid[row2][col2];
        this.grid[row2][col2] = tempBack;
        Screen.setGrid(row1, col1, this.grid[row1][col1]);
        Screen.setGrid(row2, col2, this.grid[row2][col2]);
      }
    }
    if (!this.hasValidMoves()) {
      Screen.setMessage(`Game Over! Final Score: ${this.score}`);
    }
  }

  isValidSwap(row1, col1, row2, col2) {
    return (
      Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1 &&
      row1 >= 0 &&
      row1 < 8 &&
      col1 >= 0 &&
      col1 < 8 &&
      row2 >= 0 &&
      row2 < 8 &&
      col2 >= 0 &&
      col2 < 8
    );
  }

  static checkForMatches(grid) {
    const matches = [];

    // Check horizontal matches
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length - 2; j++) {
        if (
          grid[i][j] !== null &&
          grid[i][j] === grid[i][j + 1] &&
          grid[i][j] === grid[i][j + 2]
        ) {
          matches.push([i, j], [i, j + 1], [i, j + 2]);
        }
      }
    }

    // Check vertical matches
    for (let i = 0; i < grid.length - 2; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (
          grid[i][j] !== null &&
          grid[i][j] === grid[i + 1][j] &&
          grid[i][j] === grid[i + 2][j]
        ) {
          matches.push([i, j], [i + 1, j], [i + 2, j]);
        }
      }
    }

    return matches;
  }

  removeMatches(matches) {
    matches.forEach(([row, col]) => {
      this.grid[row][col] = null;
      Screen.setGrid(row, col, " ");
    });
  }

  fillEmptySpaces() {
    const gems = ["🍒", "🍋", "🍊", "🍓", "🫐", "🍇"];
    for (let col = 0; col < 8; col++) {
      let emptyRow = 7;
      for (let row = 7; row >= 0; row--) {
        if (this.grid[row][col] !== null) {
          if (row !== emptyRow) {
            this.grid[emptyRow][col] = this.grid[row][col];
            Screen.setGrid(emptyRow, col, this.grid[emptyRow][col]);
            this.grid[row][col] = null;
            Screen.setGrid(row, col, " ");
          }
          emptyRow--;
        }
      }
      for (let row = emptyRow; row >= 0; row--) {
        this.grid[row][col] = gems[Math.floor(Math.random() * gems.length)];
        Screen.setGrid(row, col, this.grid[row][col]);
      }
    }
  }

  updateScore(matches) {
    this.score += matches * 100;
    Screen.setMessage(`Score: ${this.score}`);
  }

  hasValidMoves() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (j < 7 && this.wouldMatch(i, j, i, j + 1)) return true;
        if (i < 7 && this.wouldMatch(i, j, i + 1, j)) return true;
      }
    }
    return false;
  }

  wouldMatch(row1, col1, row2, col2) {
    if (
      row1 >= 0 &&
      row1 < this.grid.length &&
      col1 >= 0 &&
      col1 < this.grid[row1].length &&
      row2 >= 0 &&
      row2 < this.grid.length &&
      col2 >= 0 &&
      col2 < this.grid[row2].length
    ) {
      const temp = this.grid[row1][col1];
      this.grid[row1][col1] = this.grid[row2][col2];
      this.grid[row2][col2] = temp;

      const hasMatch = Bejeweled.checkForMatches(this.grid).length > 0;

      this.grid[row2][col2] = this.grid[row1][col1];
      this.grid[row1][col1] = temp;

      return hasMatch;
    }

    return false;
  }
}

module.exports = Bejeweled;
