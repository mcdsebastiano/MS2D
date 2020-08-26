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
    let moves = [];
    let idx = board.cellIndex(this);
  
    let first = board.cells.slice(0, idx);
    let last = board.cells.slice(idx);

    first.push(last.shift());

    //FILE
    for (let i = first.length - 1; i >= 0; i--) {
      if (board.cells[i].pos.file == this.pos.file && i != idx) {
        if (board.cells[i].value != ' ') {
          if (this.color != board.cells[i].color) {
            moves.push(i);
          }
          break;
        }
        moves.push(i);
      }
    }
    for (let i = 0; i < last.length + 1; i++) {
      if (board.cells[idx + i].pos.file == this.pos.file) {
        if (board.cells[idx + i].value != ' ') {
          if (this.color != board.cells[idx + i].color) {
            moves.push(idx + i);
          }
          break;
        }
        moves.push(idx + i);
      }
    }

    // RANK
    for (let i = first.length - 1; i >= 0; i--) {
      if (board.cells[i].pos.rank == this.pos.rank) {
        if (board.cells[i].value != ' ') {
          if (this.color != board.cells[i].color) {
            moves.push(i);
          }
          break;
        }
        moves.push(i);
      }
    }
    for (let i = 0; i < last.length + 1; i++) {
      if (board.cells[idx + i].pos.rank == this.pos.rank) {
        if (board.cells[idx + i].value != ' ') {
          if (this.color != board.cells[idx + i].color) {
            moves.push(idx + i);
          }
          break;
        }
        moves.push(idx + i);
      }
    }

    return moves;
  }
  // paint() {
    // let p = fillRect(this.x, this.y, this.size, this.size);
    // return p;
  // }
}
