class Rook extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'r';
  }

  legalMoves(board) {
    return this.slideHorizontally(board.cellIndex(this)).concat(this.slideVertically(board.cellIndex(this)));
  }

  paint() {

    let rect1 = fillRect(Math.floor(this.size / 2) - Math.floor(this.size / 3) + 3, 6, Math.ceil(this.size / 1.5) - 6, this.size - 17);
    rect1.translate(this.x, this.y);

    let rect2 = fillRect(4, 0, Math.floor(this.size / 6), this.size / 3);
    rect2.translate(this.x, this.y);

    let rect3 = fillRect(Math.floor(this.size / 2) - Math.floor(this.size / 12), 0, Math.floor(this.size / 6), this.size / 3);
    rect3.translate(this.x, this.y);

    let rect4 = fillRect(Math.floor(this.size / 1.33), 0, Math.floor(this.size / 6), this.size / 3);
    rect4.translate(this.x, this.y);

    fillTriangle(this.size / 2, 25, this.size - 4, 15, 4, 15).translate(this.x, this.y);
    fillTriangle(this.size / 2, 20, this.size - 4, this.size - 10, 4, this.size - 10).translate(this.x, this.y);
    fillRect(2, this.size - 6.5, this.size - 4.5, 6).translate(this.x, this.y);

    return rect1;

  }

}
