include('Cell.js');
include('Pieces/Rook.js');
include('Pieces/Knight.js');
include('Pieces/Bishop.js');
include('Pieces/Queen.js');
include('Pieces/King.js');
include('Pieces/Pawn.js');

const numCells = 8; // per row & col

class Board {
  constructor(w, x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = w;
    this.cellSize = Math.floor(this.w / numCells);
    this.pieceSize = this.cellSize / 1.5;
    this.moveList = [];
    // generate cells
    this.cells = [];
    for (let j = 0; j < numCells; j++) {
      for (let i = 0; i < numCells; i++) {
        this.cells.push(new Cell(i, j, this.cellSize));
      }
    }
    // spawn pieces
    this.blackPieces = {
      RookA: new Rook('a', 8, this.pieceSize, 'b'),
      KnightB: new Knight('b', 8, this.pieceSize, 'b'),
      BishopC: new Bishop('c', 8, this.pieceSize, 'b'),
      Queen: new Queen('d', 8, this.pieceSize, 'b'),
      King: new King('e', 8, this.pieceSize, 'b'),
      BishopF: new Bishop('f', 8, this.pieceSize, 'b'),
      KnightG: new Knight('g', 8, this.pieceSize, 'b'),
      RookH: new Rook('h', 8, this.pieceSize, 'b'),
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
      RookA: new Rook('a', 1, this.pieceSize, 'w'),
      KnightB: new Knight('b', 1, this.pieceSize, 'w'),
      BishopC: new Bishop('c', 1, this.pieceSize, 'w'),
      Queen: new Queen('d', 1, this.pieceSize, 'w'),
      King: new King('e', 1, this.pieceSize, 'w'),
      BishopF: new Bishop('f', 1, this.pieceSize, 'w'),
      KnightG: new Knight('g', 1, this.pieceSize, 'w'),
      RookH: new Rook('h', 1, this.pieceSize, 'w'),
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

  blackPieceAt(idx) {
    return this.cells[idx].hasBlackPiece();
  }

  whitePieceAt(idx) {
    return !this.blackPieceAt(idx);
  }

  isPawnPromotionState(originalPiece, finalPiece) {
    return false;
  }

  isEpState(originalPiece, finalPiece) {
    return false;
  }

  isCaptureState(originalPiece, finalPiece) {
    return this.activePieces.find(p => p !== finalPiece && finalPiece.x == p.x && finalPiece.y == p.y);
  }

  isCastleState(originalPiece, finalPiece) {
    if (finalPiece.val !== 'k') {
      return
    }
    let castledRook = undefined;
    let pendingCell = this.cellIndex(finalPiece);
    let adjacentCellRight = this.cellIndex(originalPiece) + 2;
    let adjacentCellLeft = this.cellIndex(originalPiece) - 2;
    if (pendingCell == adjacentCellRight) {
      if (finalPiece.pos.rank === 8) {
        castledRook = this.blackPieces['RookH'];
        if (this.performCastle(castledRook, 'f', 8) === false) {
          this.undoMove();
          return;
        }
      } else if (finalPiece.pos.rank === 1) {
        castledRook = this.whitePieces['RookH'];
        if (this.performCastle(castledRook, 'f', 1) === false) {
          this.undoMove();
          return;
        }
      }
    } else if (pendingCell == adjacentCellLeft) {
      if (finalPiece.pos.rank === 8) {
        castledRook = this.blackPieces['RookA'];
        if (this.performCastle(castledRook, 'd', 8) === false) {
          this.undoMove();
          return;
        }
      } else if (finalPiece.pos.rank === 1) {
        castledRook = this.whitePieces['RookA'];
        if (this.performCastle(castledRook, 'd', 1) === false) {
          this.undoMove();
          return;
        }
      }
    }
    return castledRook;
  }

  performCastle(rook, file, rank) {
    if (rook.timesMoved > 0) {
      return false;
    }
    this.setPiecePos(rook, {
      file,
      rank
    }, 1);
    return true;
  }

  isMoveOK(originalPiece, finalPiece) {
    // inital save, assume move is OK
    this.saveMove(originalPiece, finalPiece, -1);

    // if we don't return an index the move is not OK.
    const legalCells = originalPiece.legalMoves(this).find(index => index == this.cellIndex(finalPiece));
    if (typeof legalCells === 'undefined') {
      return false;
    }

    // check for capture
    let landedPiece = this.isCaptureState(originalPiece, finalPiece);
    if (typeof landedPiece !== 'undefined') {
      if (landedPiece.color == finalPiece.color) {
        return false;
      }
      const capturedIndex = this.activePieces.indexOf(landedPiece);
      this.activePieces.splice(capturedIndex, 1);
      this.capturedPieces.push(landedPiece);
      this.moveList.pop();
      this.saveMove(originalPiece, finalPiece, capturedIndex);
      return true;
    }
    // check for castle
    let castledRook = this.isCastleState(originalPiece, finalPiece);
    if (typeof castledRook !== 'undefined') {
      this.moveList.pop();
      this.saveMove(originalPiece, finalPiece, -1, castledRook);
      return true;
    }

    // TODO: check for en passant
    // TODO: check for pawn promotion

    return true
  }

  undoMove() {
    if (this.moveList.length === 0) {
      return;
    }

    const lastMove = this.moveList.pop();
    if (typeof lastMove === 'undefined') {
      return;
    }

    const {
      finalPiece,
      originalPiece,
      prevBoardState,
      capturedIndex,
      castledPiece
    } = lastMove;

    switch (castledPiece) {
    case this.blackPieces['RookA']:
      this.setPiecePos(castledPiece, {
        file: 'a',
        rank: 8
      }, 1);
      break;
    case this.blackPieces['RookH']:
      this.setPiecePos(castledPiece, {
        file: 'h',
        rank: 8
      }, 1);
      break;
    case this.whitePieces['RookA']:
      this.setPiecePos(castledPiece, {
        file: 'a',
        rank: 1
      }, 1);
      break;
    case this.whitePieces['RookH']:
      this.setPiecePos(castledPiece, {
        file: 'h',
        rank: 1
      }, 1);
      break;
    default:
      break;
    }

    if (capturedIndex > -1) {
      this.activePieces.splice(capturedIndex, 0, this.capturedPieces.pop());
    }

    this.setPiecePos(finalPiece, originalPiece.pos, -1)
  }

  saveMove(orinalPiece, finalPiece, capturedIndex = -1, castledPiece) {
    this.moveList.push({
      originalPiece,
      capturedIndex,
      finalPiece,
      castledPiece
    });
  }

  movePiece(originalPiece, finalPiece) {
    let pos = {
      file: this.findFile(finalPiece.x),
      rank: this.findRank(finalPiece.y)
    }
    this.setPiecePos(finalPiece, pos, 1, originalPiece);
  }

  setPiecePos(piece, newPos, moveCountModifier, clearedCell) {
    clearedCell = clearedCell || piece;
    this.assignCellValue(clearedCell);

    piece.setPos(newPos);
    piece.setX(this.ctoi(newPos.file))
    piece.setY(numCells - newPos.rank);
    piece.timesMoved += moveCountModifier

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

  paint() {
    // clear();
    // cells
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i].paint();
      cell.translate(this.x, this.y);
    }
    // pieces
    for (let i = 0; i < this.activePieces.length; i++) {
      let piece = this.activePieces[i];
      if (piece.color === 'w') {
        setColor(OFFWHITE);
      } else {
        setColor(CHARCOAL);
      }
      let p = piece.paint();
      p.translate(this.x, this.y);
      if (piece.isInHand() === false) {
        this.assignCellValue(piece, piece.color);
      }
    }
  }
}
