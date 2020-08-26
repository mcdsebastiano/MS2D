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
    
    let moves = [];
    let idx = board.cellIndex(this);
    
    return moves
  }

  // paint() {
    // let p = fillRect(this.x, this.y, this.size, this.size);
    // return p;
  // }

}
