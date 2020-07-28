include('Cell.js');
include('Piece.js');
include('Pieces/Rook.js');
include('Pieces/Knight.js');
include('Pieces/Bishop.js');
include('Pieces/Queen.js');
include('Pieces/King.js');
include('Pieces/Pawn.js');

const numCells = 8;

let boardState = [];

class Board {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = w;
    this.cellSize = Math.floor(this.w / numCells);
    this.moveList = [];
    this.cells = [];

    for (let j = 0; j < numCells; j++) {
      for (let i = 0; i < numCells; i++) {
        this.cells.push(new Cell(i, j, this.cellSize));
      }
    }

    this.blackPieces = {
      L_Rook: new Rook('a', 8, this.cellSize / 2, 'b'),
      L_Knight: new Knight('b', 8, this.cellSize / 2, 'b'),
      L_Bishop: new Bishop('c', 8, this.cellSize / 2, 'b'),
      Queen: new Queen('d', 8, this.cellSize / 2, 'b'),
      King: new King('e', 8, this.cellSize / 2, 'b'),
      R_Bishop: new Bishop('f', 8, this.cellSize / 2, 'b'),
      R_Knight: new Knight('g', 8, this.cellSize / 2, 'b'),
      R_Rook: new Rook('h', 8, this.cellSize / 2, 'b'),
      Pawns: [
        new Pawn('a', 7, this.cellSize / 2, 'b'),
        new Pawn('b', 7, this.cellSize / 2, 'b'),
        new Pawn('c', 7, this.cellSize / 2, 'b'),
        new Pawn('d', 7, this.cellSize / 2, 'b'),
        new Pawn('e', 7, this.cellSize / 2, 'b'),
        new Pawn('f', 7, this.cellSize / 2, 'b'),
        new Pawn('g', 7, this.cellSize / 2, 'b'),
        new Pawn('h', 7, this.cellSize / 2, 'b')
      ]
    };

    this.whitePieces = {
      L_Rook: new Rook('a', 1, this.cellSize / 2, 'w'),
      L_Knight: new Knight('b', 1, this.cellSize / 2, 'w'),
      L_Bishop: new Bishop('c', 1, this.cellSize / 2, 'w'),
      Queen: new Queen('d', 1, this.cellSize / 2, 'w'),
      King: new King('e', 1, this.cellSize / 2, 'w'),
      R_Bishop: new Bishop('f', 1, this.cellSize / 2, 'w'),
      R_Knight: new Knight('g', 1, this.cellSize / 2, 'w'),
      R_Rook: new Rook('h', 1, this.cellSize / 2, 'w'),
      Pawns: [
        new Pawn('a', 2, this.cellSize / 2, 'w'),
        new Pawn('b', 2, this.cellSize / 2, 'w'),
        new Pawn('c', 2, this.cellSize / 2, 'w'),
        new Pawn('d', 2, this.cellSize / 2, 'w'),
        new Pawn('e', 2, this.cellSize / 2, 'w'),
        new Pawn('h', 2, this.cellSize / 2, 'w'),
        new Pawn('f', 2, this.cellSize / 2, 'w'),
        new Pawn('g', 2, this.cellSize / 2, 'w')
      ]
    };

  }

  saveState() {
    boardState = this.cells.map(cell => cell.value);
  }

  saveMove(piece, newX, newY) {
    // TODO: Save the state of the board after confirming a piece is allowed to
    // move and before moving to it's new cell.
    this.moveList.push({
      piece,
      x: piece.x,
      y: piece.y,
      prevValue: this.cells[(this.ctoi(newX) * 8 + newY) - 1].value,
      boardState
    });
  }

  undo() {
    let prevState;
    let prevValue;
    if (this.moveList.length > 0) {
      let {
        piece,
        x,
        y,
        prevValue
      } = this.moveList.pop();
      let idx = this.cellIndex(piece);
      this.cells[idx].value = prevValue;
      piece.x = x;
      piece.y = y;
    }
    this.paint();
  }

  cellIndex(piece) {
    let x = Math.floor(piece.x / this.cellSize);
    let y = Math.floor(piece.y / this.cellSize);
    return y * 8 + x;
  }

  ctoi(val) {
    return val.charCodeAt(0) - 97;
  }

  setPiecePos(piece, file, rank) {
    // assign an empty value to the current cell.
    this.assignCellValue(piece);
    // give the current piece a a new file/rank.
    piece.setPos({file, rank});
    // move the current piece to the correct cell in the board.
    piece.setX(this.ctoi(file))
    piece.setY(8 - rank);
    // give the new cell the proper value for based on the current piece.
    this.assignCellValue(piece, piece.color);
    // paint the board.
    this.paint();
  }

  assignCellValue(piece, color) {
    const idx = this.cellIndex(piece);
    if (color === 'w') {
      this.cells[idx].value = piece.value().toUpperCase();
    } else if (color === 'b') {
      this.cells[idx].value = piece.value();
    } else {
      this.cells[idx].value = ' ';
    }
  }

  paintPieces(pieces, color) {
    for (let piece in pieces) {
      let p;
      if (piece === 'Pawns') {
        let pawns = pieces[piece];
        pawns.forEach(pawn => {
          p = pawn.paint();
          p.translate(this.x, this.y);
          if (pawn.isInHand() !== true) {
            this.assignCellValue(pawn, color);
          }
        });
      } else {
        p = pieces[piece].paint();
        p.translate(this.x, this.y);
        if (pieces[piece].isInHand() === false) {
          this.assignCellValue(pieces[piece], color);
        }
      }
    }
    this.saveState();
  }

  checkPieces(pieces) {
    for (let piece in pieces) {
      if (piece !== 'Pawns') {
        if (dragStart(mouseX() - this.x, mouseY() - this.y, pieces[piece].x, pieces[piece].y, pieces[piece].size, pieces[piece].size)) {
          return pieces[piece];
        }
      } else {
        for (let i = 0; i < 8; i++) {
          let pawn = pieces[piece][i];
          if (dragStart(mouseX() - this.x, mouseY() - this.y, pawn.x, pawn.y, pawn.size, pawn.size)) {
            return pawn;
          }
        }
      }
    }
  }

  paint() {
    Rect(this.x, this.y, this.w, this.h);

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i].paint();
      cell.translate(this.x, this.y);
    }

    setColor(DIM_GRAY);
    this.paintPieces(this.blackPieces, 'b');
    setColor(LIGHT_GRAY);
    this.paintPieces(this.whitePieces, 'w');
  }
}