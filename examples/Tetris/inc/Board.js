class Board {
  constructor(size, width, height) {
    this.width = width;
    this.height = height;
    this.cSize = size;
    this.board = [];
    this.rows = this.height / this.cSize;
    this.cols = this.width / this.cSize;
    this.cells = [];
  }

  initBoard() {
    this.board = Array.from(Array(this.rows), () => new Array(this.cols));
  }

  draw() {
    if (this.cells.length <= 0)  return
    
    for (let i = 0; i < this.cells.length; i++) {
      setColor(this.cells[i].color);
      fillRect(this.cells[i].x, this.cells[i].y, w, w);
      setColor(BLACK);
      Rect(this.cells[i].x, this.cells[i].y, w, w);
    }
  }

  checkRows() {
    for (let y = 0; y < this.rows; y++) {
      let total = 0;
      for (let x = 0; x < this.cols; x++) {
        total += this.board[y][x];
      }
      if (total === 16)
        this.clearRow(y);
    }
  }

  clearRow(row) {
    let updated = this.cells.filter(piece => piece.y !== row * w);
    for (let y = row - 1; y >= 0; y--) {
      for (let x = 0; x < this.cols; x++) {
        if (y === 0) {
          this.board[y][x] = 0;
        }
        if ((this.board[y + 1][x] = this.board[y][x]) === 1) {
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].x == x * w && updated[i].y == y * w) {
              updated[i].y += w;
            }
          }
        }
      }
    }
    this.cells = updated;
    this.draw();
  }
}
