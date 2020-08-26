/* your board is laid out like this:
 *
 *      | a | b | c | d | e | f | g | h |
 *     -|---|---|---|---|---|---|---|---|-
 *     8|   |   |   |   |   |   |   |   |8
 *     -|---|---|---|---|---|---|---|---|-
 *     7|   |   |   |   |   |   |   |   |7
 *     -|---|---|---|---|---|---|---|---|-
 *     6|   |   |   |   |   |   |   |   |6
 *     -|---|---|---|---|---|---|---|---|-
 *     5|   |   |   |   |   |   |   |   |5
 *     -|---|---|---|---|---|---|---|---|-
 *     4|   |   |   |   |   |   |   |   |4
 *     -|---|---|---|---|---|---|---|---|-
 *     3|   |   |   |   |   |   |   |   |3
 *     -|---|---|---|---|---|---|---|---|-
 *     2|   |   |   |   |   |   |   |   |2
 *     -|---|---|---|---|---|---|---|---|-
 *     1|   |   |   |   |   |   |   |   |1
 *     -|---|---|---|---|---|---|---|---|-
 *      | a | b | c | d | e | f | g | h |
 */

include('Cell.js');
include('Piece.js');
include('Pieces/Rook.js');
include('Pieces/Knight.js');
include('Pieces/Bishop.js');
include('Pieces/Queen.js');
include('Pieces/King.js');
include('Pieces/Pawn.js');

const numCells = 8;

class Board {
  constructor(x, y, w) {
    // metadata
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = w;
    this.cellSize = Math.floor(this.w / numCells);
    this.pieceSize = this.cellSize / 2;
    this.moveList = [];
    // generate cells
    this.cells = [];
    for (let j = 0; j < numCells; j++) {
      for (let i = 0; i < numCells; i++) {
        this.cells.push(new Cell(i, j, this.cellSize));
      }
    }
    // starting positions
    this.blackPieces = {
      L_Rook: new Rook('a', 8, this.pieceSize, 'b'),
      L_Knight: new Knight('b', 8, this.pieceSize, 'b'),
      L_Bishop: new Bishop('c', 8, this.pieceSize, 'b'),
      Queen: new Queen('d', 8, this.pieceSize, 'b'),
      King: new King('e', 8, this.pieceSize, 'b'),
      R_Bishop: new Bishop('f', 8, this.pieceSize, 'b'),
      R_Knight: new Knight('g', 8, this.pieceSize, 'b'),
      R_Rook: new Rook('h', 8, this.pieceSize, 'b'),
      PawnA: new Pawn('a', 7, this.pieceSize, 'b'),
      PawnB: new Pawn('b', 7, this.pieceSize, 'b'),
      PawnC: new Pawn('c', 7, this.pieceSize, 'b'),
      PawnD: new Pawn('d', 7, this.pieceSize, 'b'),
      PawnE: new Pawn('e', 7, this.pieceSize, 'b'),
      PawnF: new Pawn('f', 7, this.pieceSize, 'b'),
      PawnG: new Pawn('g', 7, this.pieceSize, 'b'),
      PawnH: new Pawn('h', 7, this.pieceSize, 'b')
    };
    this.whitePieces = {
      L_Rook: new Rook('a', 1, this.pieceSize, 'w'),
      L_Knight: new Knight('b', 1, this.pieceSize, 'w'),
      L_Bishop: new Bishop('c', 1, this.pieceSize, 'w'),
      Queen: new Queen('d', 1, this.pieceSize, 'w'),
      King: new King('e', 1, this.pieceSize, 'w'),
      R_Bishop: new Bishop('f', 1, this.pieceSize, 'w'),
      R_Knight: new Knight('g', 1, this.pieceSize, 'w'),
      R_Rook: new Rook('h', 1, this.pieceSize, 'w'),
      PawnA: new Pawn('a', 2, this.pieceSize, 'w'),
      PawnB: new Pawn('b', 2, this.pieceSize, 'w'),
      PawnC: new Pawn('c', 2, this.pieceSize, 'w'),
      PawnD: new Pawn('d', 2, this.pieceSize, 'w'),
      PawnE: new Pawn('e', 2, this.pieceSize, 'w'),
      PawnF: new Pawn('f', 2, this.pieceSize, 'w'),
      PawnG: new Pawn('g', 2, this.pieceSize, 'w'),
      PawnH: new Pawn('h', 2, this.pieceSize, 'w')
    };
    // summary of pieces and their data
    this.activePieces = Object.values(this.blackPieces).concat(Object.values(this.whitePieces));
    this.capturedPieces = [];
  }

  cellIndex(piece) {
    let x = Math.floor(piece.x / this.cellSize);
    let y = Math.floor(piece.y / this.cellSize);
    return y * 8 + x;
  }

  ctoi(val) {
    return val.charCodeAt(0) - 97;
  }

  findFile(pieceX) {
    return String.fromCharCode(Math.floor(pieceX / board.cellSize) + 97);
  }

  findRank(pieceY) {
    return 8 - (Math.ceil(pieceY / board.cellSize) - 1);
  }

  saveMove(orinalPiece, finalPiece, capturedIndex = -1) {
    this.moveList.push({
      originalPiece,
      capturedIndex,
      finalPiece
    });
  }

  undo() {
    const undoMove = this.moveList.pop();
    if (typeof undoMove === 'undefined') {
      return;
    }
    let {
      finalPiece,
      originalPiece,
      prevBoardState,
      capturedIndex
    } = undoMove;
    // if there is a captured piece then return it to the board
    if (capturedIndex > -1) {
      this.activePieces.splice(capturedIndex, 0, this.capturedPieces.pop());
    }
    // and return the last piece to it's original position
    this.assignCellValue(finalPiece);
    finalPiece.x = originalPiece.x;
    finalPiece.y = originalPiece.y;
    finalPiece.pos = originalPiece.pos;
    finalPiece.cellIndex = this.cellIndex(finalPiece);
    this.paint();
  }

  setPiecePos(originalPiece, finalPiece) {
    // assign an empty value to the current cell.
    this.assignCellValue(originalPiece);

    //find the file and rank of the piece in hand
    let file = this.findFile(finalPiece.x);
    let rank = this.findRank(finalPiece.y);

    // assign the position to the piece in hand (finalPiece)
    finalPiece.setPos({
      file,
      rank
    });
    finalPiece.cellIndex = this.cellIndex(finalPiece);
    // and move the piece to the correct cell in the board.
    finalPiece.setX(this.ctoi(file))
    finalPiece.setY(numCells - rank);
    // save move
    this.saveMove(originalPiece, finalPiece, -1);

    // and check if the move is OK
    const legalCells = originalPiece.legalMoves(this).find(index => index == this.cellIndex(finalPiece));
    if (typeof legalCells !== 'undefined') {
      // find out if we are landed on a cell with another piece
      const landedPiece = this.activePieces.find(p => p !== finalPiece && finalPiece.x == p.x && finalPiece.y == p.y);
      if (typeof landedPiece !== 'undefined') {
        // if the piece is the same color, undo the move
        if (landedPiece.color == finalPiece.color) {
          this.undo();
          return; // avoids unneccessary repainting
        } else {
          // otherwise move the piece from the active array to the captured array
          const capturedIndex = this.activePieces.indexOf(landedPiece);
          this.activePieces.splice(capturedIndex, 1);
          this.capturedPieces.push(landedPiece);
          // and resave with the added capture
          this.moveList.pop();
          this.saveMove(originalPiece, finalPiece, capturedIndex);
        }
      }
    } else {
      this.undo();
      return; // avoids unneccessary repainting
    }
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

  paintPieces() {
    for (let i = 0; i < this.activePieces.length; i++) {
      let piece = this.activePieces[i];
      if (piece.color === 'w') {
        setColor(LIGHT_GRAY);
      } else {
        setColor(DIM_GRAY);
      }
      let p = piece.paint();
      p.translate(this.x, this.y);
      if (piece.isInHand() === false) {
        this.assignCellValue(piece, piece.color);
      }
    }
  }

  paint() {
    setColor(BLACK)
    Rect(this.x, this.y, this.cellSize * numCells, this.cellSize * numCells)

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i].paint();
      cell.translate(this.x, this.y);
    }
    this.paintPieces();
  }
  
}
