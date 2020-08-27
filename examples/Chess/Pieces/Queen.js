class Queen extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'q';
  }

  legalMoves(board) {
    let idx = board.cellIndex(this);
    return this.slideDiagonally(idx).concat(this.slideHorizontally(idx), this.slideVertically(idx));
  }

  paint() {
    let queen = newShape();
    queen.triangles();
    queen.w = this.size;
    queen.h = this.size;
    vertexAt(0, 4);
    vertexAt(10, this.size - 10);
    vertexAt(20, this.size - 10);

    vertexAt(45, 4)
    vertexAt(35, this.size - 10);
    vertexAt(25, this.size - 10);

    vertexAt(this.size / 2, 4);
    vertexAt(10, this.size - 10);
    vertexAt(35, this.size - 10);

    endShape();

    queen.translate(this.x, this.y);

    let circle1 = fillCircle(0, 4, 3);
    circle1.translate(this.x - 1, this.y);

    let circle2 = fillCircle(this.size / 2 - 3, 0, 3);
    circle2.translate(this.x, this.y);

    let circle3 = fillCircle(this.size - 4, 4, 3);
    circle3.translate(this.x - 1, this.y);

    fillRect(10, this.size - 6.5, this.size - 20, 6).translate(this.x, this.y);

    return queen;
  }
}
