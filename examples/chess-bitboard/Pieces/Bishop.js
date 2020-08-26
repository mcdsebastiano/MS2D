class Bishop extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'b';
  }

  legalMoves(board) {
    return this.slideDiagonally(board.cellIndex(this));
  }

  paint() {

    let r = this.size / 12;

    let mid = this.size / 2;

    let circle = fillCircle(this.size / 2 - r, 0, r);
    circle.translate(this.x, this.y);

    fillTriangle(mid, r * 2, this.size / 1.33, this.size / 3, this.size / 4, this.size / 3)
    .translate(this.x, this.y);

    fillCircle(this.size / 2 - this.size / 3, this.size / 3 - 1, mid / 3)
    .translate(this.x, this.y);
    fillCircle(this.size / 2, this.size / 3 - 1, mid / 3)
    .translate(this.x, this.y);

    fillTriangle(this.size / 2, 0, Math.floor(this.size / 1.33), this.size - 10, this.size / 4, this.size - 10)
    .translate(this.x, this.y);

    fillRect(this.size / 6, this.size - 6.5, this.size / 1.5, 6).translate(this.x, this.y);

    return circle;

  }
}
