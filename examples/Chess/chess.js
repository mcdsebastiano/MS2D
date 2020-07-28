include('Board.js');

let board;
let pieceInHand, originalXY;
let blackPieces, whitePieces;

function setup() {
  board = new Board(50, 50, 400);
  blackPieces = board.blackPieces;
  whitePieces = board.whitePieces;
}

function draw() {
  drawBorder();
  board.paint();
}

function update() {
  draw();
}

function checkPieces(pieces) {
  let piece;
  if (piece = board.checkPieces(pieces)) {
    // saving the cell position to clear the cell value when the piece is moved.
    originalXY = {
      x: piece.x,
      y: piece.y
    }
    pieceInHand = piece;
    pieceInHand.inHand(true)
  }
}

function movePiece(piece, file, rank) {
  board.saveMove(piece, file, rank);
  board.setPiecePos(piece, file, rank);
}

function mousePressed() {
  checkPieces(whitePieces);
  checkPieces(blackPieces);
}

function mouseMove() {
  let move;
  if (move = dragMove(dragX(), dragY())) {
    if (typeof pieceInHand !== 'undefined') {
      pieceInHand.x = move.x - board.x;
      pieceInHand.y = move.y - board.y;
    }
  }
}

function mouseReleased() {
  console.log(pieceInHand);
  dragEnd();
  if (typeof pieceInHand !== 'undefined') {
    // saving the new cell position to be moved to.
    let newXY = {
      x: pieceInHand.x,
      y: pieceInHand.y
    }
    // reverting pieceInHand's X/Y to the original cell position.
    pieceInHand.x = originalXY.x;
    pieceInHand.y = originalXY.y;
    // moving the piece to the saved cell position
    movePiece(pieceInHand, String.fromCharCode(Math.floor(newXY.x / 50) + 97), 8 - (Math.ceil(newXY.y / 50) - 1));
    pieceInHand.inHand(false);
  }
}
