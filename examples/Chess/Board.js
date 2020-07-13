include('Cell.js');
include('Piece.js');
include('Pieces/Rook.js');
include('Pieces/Castle.js');
include('Pieces/Knight.js');
include('Pieces/Queen.js');
include('Pieces/King.js');
include('Pieces/Pawn.js');

const numCells = 8;

const PiecesList = {
  CASTLE: 'C',
  KNIGHT: 'N',
  ROOK: 'R',
  QUEEN: 'Q',
  KING: 'K',
  PAWN: 'P'
}

class Board {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = w;
    this.cellSize = Math.floor(this.w / numCells);
    this.cells = [];

    for (let j = 0; j < numCells; j++) {
      for (let i = 0; i < numCells; i++) {
        this.cells.push(new Cell(i, j, this.cellSize));
      }
    }

    this.blackPieces = {
      
      L_Castle: new Castle('h', 8, this.cellSize / 2),
      L_Knight: new Knight('g', 8, this.cellSize / 2),
      L_Rook: new Rook('f', 8, this.cellSize / 2),
      King: new King('e', 8, this.cellSize / 2),
      Queen: new Queen('d', 8, this.cellSize / 2),
      R_Rook: new Rook('c', 8, this.cellSize / 2),
      R_Knight: new Knight('b', 8, this.cellSize / 2),
      R_Castle: new Castle('a', 8, this.cellSize / 2),
      Pawns: [
        new Pawn('h', 7, this.cellSize / 2),
        new Pawn('g', 7, this.cellSize / 2),
        new Pawn('f', 7, this.cellSize / 2),
        new Pawn('e', 7, this.cellSize / 2),
        new Pawn('d', 7, this.cellSize / 2),
        new Pawn('c', 7, this.cellSize / 2),
        new Pawn('b', 7, this.cellSize / 2),
        new Pawn('a', 7, this.cellSize / 2)
      ]
    };

    this.whitePieces = {
      L_Castle: new Castle('h', 1, this.cellSize / 2),
      L_Knight: new Knight('g', 1, this.cellSize / 2),
      L_Rook: new Rook('f', 1, this.cellSize / 2),
      King: new King('e', 1, this.cellSize / 2),
      Queen: new Queen('d', 1, this.cellSize / 2),
      R_Rook: new Rook('c', 1, this.cellSize / 2),
      R_Knight: new Knight('b', 1, this.cellSize / 2),
      R_Castle: new Castle('a', 1, this.cellSize / 2),
      Pawns: [
        new Pawn('h', 2, this.cellSize / 2),
        new Pawn('g', 2, this.cellSize / 2),
        new Pawn('f', 2, this.cellSize / 2),
        new Pawn('e', 2, this.cellSize / 2),
        new Pawn('d', 2, this.cellSize / 2),
        new Pawn('c', 2, this.cellSize / 2),
        new Pawn('b', 2, this.cellSize / 2),
        new Pawn('a', 2, this.cellSize / 2)
      ]
    };
  }

  paintPieces(pieces) {
    for (let piece in pieces) {
      let p;
      if (piece === 'Pawns') {
        let pawns = pieces[piece];
        pawns.forEach(pawn => {
          p = pawn.paint();
          p.translate(this.x, this.y);
        });
      } else {
        p = pieces[piece].paint();
        p.translate(this.x, this.y);
      }
    }
  }

  paint() {
    setColor(DIM_GRAY);
    Rect(this.x, this.y, this.w, this.h);

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i].paint();
      cell.translate(this.x, this.y);

    }

    this.paintPieces(this.blackPieces);
    this.paintPieces(this.whitePieces);
  }
}
