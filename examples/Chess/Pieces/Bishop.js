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
    let moves = [];
    let idx = board.cellIndex(this);

    for (let i = 0; i < 8 - this.rank - 1; i++) {
      moves.push((this.rank - 1) * 8 + board.ctoi(this.file) + i * 8 + i);
    }
    
    return moves;

  }

  // paint() {
  // let p = fillRect(this.x, this.y, this.size, this.size);
  // return p;
  // }

}
