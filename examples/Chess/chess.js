include('Piece.js');
include('Board.js');

let board;
let pieceInHand, originalPiece;
let blackPieces, whitePieces;

function setup() {
  board = new Board(550);
  blackPieces = board.blackPieces;
  whitePieces = board.whitePieces;

  const undoButton = document.createElement('button');
  undoButton.textContent = "UNDO";
  undoButton.onclick = () => board.undoMove();
  document.body.appendChild(undoButton);
}

function draw() {
  board.paint();
}

function findPiece() {
  for (let i = 0; i < board.activePieces.length; i++) {
    let piece = board.activePieces[i];
    if (dragStart(mouseX() - board.x, mouseY() - board.y, piece.x, piece.y, piece.size, piece.size)) {
      return piece
    }
  }
}

function mousePressed() {
  if (pieceInHand = findPiece()) {
    pieceInHand.inHand(true)
    originalPiece = cloneClass(pieceInHand);
    draw();
  }
}

function mouseMove() {
  let drag;
  if (drag = dragMove(dragX(), dragY())) {
    if (typeof pieceInHand !== 'undefined') {

      pieceInHand.x = drag.x - board.x;
      pieceInHand.y = drag.y - board.y;

      draw();
      
      /* highlight cell
       * small bug when a piece is in file A or H it can highlight the next
       * indexed cell on the opposite side */
      setColor(YELLOW);
      let idx = board.cellIndex(pieceInHand);
      Rect(board.cells[idx].x, board.cells[idx].y, board.cellSize, board.cellSize);
    }
  }
}

function mouseReleased() {
  dragEnd();
  if (typeof pieceInHand !== 'undefined') {
    board.movePiece(originalPiece, pieceInHand);
    if (board.isMoveOK(originalPiece, pieceInHand) === true) {
      draw();
      board.assignCellValue(pieceInHand, pieceInHand.color);
    } else {
      board.undoMove();
    }
    pieceInHand.inHand(false);
    originalPiece = undefined;
    pieceInHand = undefined;
    draw();
  }
}
