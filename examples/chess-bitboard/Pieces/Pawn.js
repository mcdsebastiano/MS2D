class Pawn extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'p';
  }

  legalMoves(board) {
    let moves = [];
    let idx = board.cellIndex(this);
    let offsetCoords = [8, -8]
    let offsetCaptureCoords = [];

    if (this.timesMoved === 0) {
      offsetCoords.push(16, -16);
    }

    if (this.pos.file !== 'h') {
      if (this.color == 'w') {
        offsetCaptureCoords.push(-7)
      } else {
        offsetCaptureCoords.push(9)
      }
    }

    if (this.pos.file !== 'a') {
      if (this.color == 'w') {
        offsetCaptureCoords.push(-9);
      } else {
        offsetCaptureCoords.push(7);
      }
    }

    let allCells = this.calculateMoves(idx, offsetCoords, false).concat(this.calculateMoves(idx, offsetCaptureCoords, true));

    if (this.color == 'w') {
      allCells.sort((a, b) => b - a)
    } else {
      allCells.sort((a, b) => a - b)
    }

    for (let i = 0; i < allCells.length; i++) {
      let idx = allCells[i];
      if (board.cells[idx].isOccupied(idx) === true && board.cellIndex(this) !== idx) {
        moves.push(idx);
        if (this.isSameColor(idx) === true) {
          let offset;
          if (this.color == 'b') {
            offset = 9;
          } else {
            offset = -9;
          }
          let adjCell = board.cellIndex(this) + offset; ;
          if (board.cells[adjCell].isOccupied() === true && this.isOppositeColor(adjCell)) {
            continue;
          } else {
            break;
          }
        } else {
          continue;
        }
      }
      moves.push(idx);
    }
    return moves;
  }

  paint() {

    let r = this.size / 6;

    let pawn = fillCircle(this.size / 2 - r, 0, r);
    pawn.translate(this.x, this.y);

    fillRect(this.size / 2 - r, 13, this.size / 3, 3).translate(this.x, this.y);

    let pillar = fillTriangle(this.size / 2, 0, Math.floor(this.size / 1.25), this.size - 10, this.size / 5, this.size - 10);
    pillar.translate(this.x, this.y);
    fillTriangle(this.size / 2, 20, this.size - 4, this.size - 10, 4, this.size - 10).translate(this.x, this.y);
    fillRect(2, this.size - 6.5, this.size - 4.5, 6).translate(this.x, this.y);
    return pawn;
  }

}
