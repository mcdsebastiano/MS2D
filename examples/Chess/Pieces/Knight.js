class Knight extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'n';
    this.canJump = true;
  }

  legalMoves(board) {
    let idx = board.cellIndex(this);
    let offsetCoords = [];

    let col = board.ctoi(this.pos.file);

    if (col >= 2) {
      offsetCoords.push(6, -10);
    }
    if (col <= 5) {
      offsetCoords.push(-6, 10)
    }

    if (this.pos.file !== 'h') {
      offsetCoords.push(-15, 17);
    }
    if (this.pos.file !== 'a') {
      offsetCoords.push(-17, 15)
    }

    return this.calculateMoves(idx, offsetCoords, true);
  }

  paint() {

    fillCircle(0, this.size * 0.5, this.size / 8)
    .translate(this.x, this.y);

    fillCircle(9, 12, this.size / 5)
    .translate(this.x, this.y);

    fillCircle(6, 8, this.size / 6)
    .translate(this.x, this.y);

    fillCircle(this.size / 3 + 5, 6, this.size / 5)
    .translate(this.x, this.y);

    let neck = newShape();
    neck.fill();
    vertexAt(18, this.size - 10);
    vertexAt(this.size, this.size - 10);
    vertexAt(this.size - 7, 12);
    vertexAt(35, 12);

    endShape();

    neck.translate(this.x, this.y);
    
    fillTriangle(this.size / 2 - 5, 0, this.size / 2 + 7, 10, this.size / 2 - 10, 15)
    .translate(this.x, this.y);

    fillTriangle(this.size / 2 - 15, 0, this.size / 2, 12, this.size / 2 - 14, 12)
    .translate(this.x, this.y);

    fillTriangle(0, this.size * 0.6, this.size / 2, 25, 10, 11)
    .translate(this.x, this.y);

    let mouth = newShape();
    mouth.fill();
    vertexAt(10, this.size * 0.8)
    vertexAt(this.size / 2, 24)
    vertexAt(this.size / 2 - 10, 22);
    vertexAt(8, this.size * 0.75);
    endShape()

    mouth.translate(this.x, this.y);

    let rect1 = fillRect(this.size / 3, this.size - 6.5, this.size / 1.5, 6);
    rect1.translate(this.x, this.y);
    return rect1;
  }
}
