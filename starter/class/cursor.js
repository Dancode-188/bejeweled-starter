const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.row = 0;
    this.col = 0;
    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.selectedColor = 'green';
    this.selected = null;
  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    if (
      this.selected &&
      this.selected.row === this.row &&
      this.selected.col === this.col
    ) {
      Screen.setBackgroundColor(this.row, this.col, this.selectedColor);
    } else {
      Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
    }
  }

  up() {
    this.resetBackgroundColor();
    this.row = Math.max(0, this.row - 1);
    this.setBackgroundColor();
  }

  down() {
    this.resetBackgroundColor();
    this.row = Math.min(this.numRows - 1, this.row + 1);
    this.setBackgroundColor();
  }

  left() {
    this.resetBackgroundColor();
    this.col = Math.max(0, this.col - 1);
    this.setBackgroundColor();
  }

  right() {
    this.resetBackgroundColor();
    this.col = Math.min(this.numCols - 1, this.col + 1);
    this.setBackgroundColor();
  }

  select() {
    if (this.selected) {
      // If already selected, attempt to swap
      if (
        this.isAdjacent(
          this.selected.row,
          this.selected.col,
          this.row,
          this.col
        )
      ) {
        const result = {
          from: { row: this.selected.row, col: this.selected.col },
          to: { row: this.row, col: this.col },
        };
        this.selected = null;
        this.setBackgroundColor();
        return result;
      } else {
        // If not adjacent, just move selection
        this.resetBackgroundColor();
        this.selected = { row: this.row, col: this.col };
        this.setBackgroundColor();
        return null;
      }
    } else {
      // If not selected, select current position
      this.selected = { row: this.row, col: this.col };
      this.setBackgroundColor();
      return null;
    }
  }

  isAdjacent(row1, col1, row2, col2) {
    return (
      Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1
    );
  }

}


module.exports = Cursor;
