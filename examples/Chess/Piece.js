class Piece {
  constructor(x, y, size, color) {
    this.x = Math.floor((x * (size * 1.5)) + size / 4);
    this.y = Math.floor((y * (size * 1.5)) + size / 4);
    this.size = size;
    this.val = ' ';
    this.color = color;
    this.isMoving = false;
    this.timesMoved = 0;
  }

  isInHand() {
    return this.isMoving === true;
  }

  inHand(value) {
    this.isMoving = value;
  }

  setPos(pos) {
    // we are considering this a default method for convenience, however this.pos
    // is initialized in the child class, not here.
    this.pos = pos;
  }

  getCol() {
    return this.pos.file.charCodeAt(0) - 97;
  }

  getRow() {
    return this.pos.rank - 1;
  }

  setX(x) {
    this.x = Math.floor((x * (this.size * 1.5)) + this.size / 4);
  }

  setY(y) {
    this.y = Math.floor((y * (this.size * 1.5)) + this.size / 4);
  }

  value() {
    return this.val;
  }

  isSameColor(idx) {
    return (this.color == 'w' && board.whitePieceAt(idx) === true) || (this.color == 'b' && board.blackPieceAt(idx) === true)
  }

  isOppositeColor(idx) {
    return (this.color == 'w' && board.blackPieceAt(idx) === true) || (this.color == 'b' && board.whitePieceAt(idx) === true)
  }

  // validMoves(index) {
  // if (index > 63 || index < 0) {
  // return false;
  // }
  // return !this.isSameColor(index) || board.cells[index].isFree() === true;
  // }

  paint() {
    let p = fillRect(this.x, this.y, this.size, this.size);
    return p;
  }
	
  /*
   *  BOARD MOVEMENT
   *--------------------
   *
   *  GENERAL RULE OF THUMB:
   *    the first piece we collide with can be saved since
   *    it's either the same color and move is undone,
   *    or it's not and the piece is captured.
   */

  accrueMoves(cells) {
    let moveList = [];
    for (let i = 0; i < cells.length; i++) {
      let idx = board.cells.findIndex(cell => cell == cells[i]);
      if (typeof cells[i] === 'undefined') {
        continue;
      }
      if (cells[i].isOccupied() === true) {
        moveList.push(idx);
        break;
      }
      moveList.push(idx);
    }
    return moveList;
  }

  slide(idx, conditional) {
    let cells = board.cells.filter(conditional);
    let found = cells.findIndex(cell => cell == board.cells[idx]);

    let first = cells.splice(0, found).reverse();

    return this.accrueMoves(first).concat(this.accrueMoves(cells));
  }

  slideVertically(idx) {
    return this.slide(idx, cell => cell.pos.file == this.pos.file);
  }
  slideHorizontally(idx) {
    return this.slide(idx, cell => cell.pos.rank == this.pos.rank);
  }
  slideDiagonally(idx) {
    let soWeDiagonals = [];
    let noWeDiagonals = [];
    let soEaDiagonals = [];
    let noEaDiagonals = [];

    for (let i = 0; i < 8; i++) {
      noEaDiagonals.push(board.cells[idx - (i * 8 - i)]);
      noWeDiagonals.push(board.cells[idx - (i * 8 + i)]);
      soEaDiagonals.push(board.cells[idx + (i * 8 + i)]);
      soWeDiagonals.push(board.cells[idx + (i * 8 - i)]);
    }

    return this.accrueMoves(noEaDiagonals).concat(
      this.accrueMoves(noWeDiagonals),
      this.accrueMoves(soEaDiagonals),
      this.accrueMoves(soWeDiagonals));
  }

  calculateMoves(pieceIndex, offsetCoords, canCapture = false) {
    let moves = [];
    for (let i = 0; i < offsetCoords.length; i++) {
      let offsetIndex = pieceIndex + offsetCoords[i];

      if (offsetIndex > 64 || offsetIndex < 0) {
        continue;
      }

      if (this.val == 'p') {
        if (this.color == 'w' && offsetIndex > pieceIndex) {
          continue
        } else if (this.color == 'b' && offsetIndex < pieceIndex) {
          continue;
        }
      }

      if (canCapture === false) {
        if (board.cells[offsetIndex].value == ' ') {
          moves.push(offsetIndex);
        } else {
          if (this.isSameColor(offsetIndex)) {
            moves.push(offsetIndex);
          }
        }
      } else {
        if (this.val == 'k' || this.val == 'n') {
          moves.push(offsetIndex);
        } else if (this.val == 'p') {
          if (board.cells[offsetIndex].value != ' ') {
            if (this.isOppositeColor(offsetIndex)) {
              moves.push(offsetIndex); ;
            }
          }
        }
      }
    }
    return moves;
  }
}