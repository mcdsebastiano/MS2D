class King extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'k';
  }
  
  // NOTE: A better way to do this might be to start with the complete set and subtract the indices we do not need from the list.

  legalMoves(board) {
    let idx = board.cellIndex(this);
    let offsetCoords = [];
    if (this.pos.file == 'a') {
      offsetCoords.push(-8, -7, 1, 8, 9);
    } else if (this.pos.file == 'h') {
      offsetCoords.push(-9, -8, -1, 7, 8);
    } else {
      offsetCoords.push(-9, -8, -7, -1, 1, 7, 8, 9);
    }

    if (this.timesMoved === 0) {
      if (board.cells[idx + 1].hasValue(' ') &&
        board.cells[idx + 2].hasValue(' ') &&
        board.cells[idx + 3].hasValue('r')) {
        offsetCoords.push(2);
      }
      if (board.cells[idx - 1].hasValue(' ') &&
        board.cells[idx - 2].hasValue(' ') &&
        board.cells[idx - 3].hasValue(' ') &&
        board.cells[idx - 4].hasValue('r')) {
        offsetCoords.push(-2);
      }
    }
    return this.calculateMoves(idx, offsetCoords, true);
  }

  paint() {

    let r = this.size / 5;

    fillCircle(2, 10, r)
    .translate(this.x, this.y);

    fillCircle((this.size - r * 2) - 2, 10, r)
    .translate(this.x, this.y);

    fillCircle(this.size / 2 - r / 1.5, 3, r / 1.5)
    .translate(this.x, this.y);

    let t = newShape();

    t.triangles();

    vertexAt(r + 6, 12);
    vertexAt(this.size / 2+5, this.size / 2);
    vertexAt(this.size / 3, this.size / 2);

    vertexAt(this.size / 2 + r - 1, 12);
    vertexAt(this.size / 2 - 5, this.size / 2);
    vertexAt(this.size / 1.5, this.size / 2);

    endShape();

    t.translate(this.x, this.y);

    fillTriangle(this.size / 2, this.size / 2, this.size / 2 + 5, this.size / 3 - 4, this.size / 2 - 5, this.size / 3 - 4).translate(this.x, this.y);

    fillTriangle(this.size / 2, this.size - 10, this.size - 5, this.size / 1.75, 5, this.size / 1.75).translate(this.x, this.y);

    fillRect(this.size / 4, this.size / 2, this.size / 2, 13)
    .translate(this.x, this.y);

    let rect1 = fillRect(10, this.size - 6.5, this.size - 20, 6)
      rect1.translate(this.x, this.y);

    let pillar = fillTriangle(this.size / 2, this.size / 2, Math.floor(this.size / 1.25), this.size - 10, this.size / 5, this.size - 10);
    pillar.translate(this.x, this.y);

    if (this.color == 'w') {
      setColor(DIMGRAY);

    } else {
      setColor(OFFWHITE);
    }
    let cross = newShape();
    cross.lines();
    drawLine(this.size / 2, 5, this.size / 2, 12);
    drawLine(this.size / 2 - 3, 8, this.size / 2 + 3, 8);
    endShape()
    cross.translate(this.x, this.y);

    return rect1;
  }
}
