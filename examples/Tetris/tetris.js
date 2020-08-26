include('inc/Pieces.js');
include('inc/Tetromino.js');
include('inc/Board.js');

let ticker = 0;
let refreshRate = 60;
let w = 25;

let allPieces = [];
let board;
let curr;

function setup() {
  allPieces = [J, L, S, Z, T, I, O];
  board = new Board(w, WIDTH, HEIGHT);
  board.initBoard();
  curr = newPiece();
}

function draw() {
  drawBorder();
  board.draw();
  curr.draw();
}

function update() {
  ticker++;
  if (ticker % refreshRate == 0)
    if (!shiftDown())
      saveBoard();
  draw();
}

function keyPressed() {
  switch (keyCode()) {
  case 90: // Z
    rotate(-1)
    break;
  case 88: // X
    rotate(1);
    break;
  case LEFT_ARROW: // LEFT
    shift(-1);
    break;
  case RIGHT_ARROW: // RIGHT
    shift(1);
    break;
  case DOWN_ARROW: // DOWN
    shiftDown();
    break;
  case SPACE_BAR: // SPACE
    drop();
    break;
  default:
    break;
  }
}

function saveBoard() {
  curr.lock();

  curr.cells.forEach(cell => {
    board.cells.push({
      x: cell.x,
      y: cell.y,
      color: curr.color
    })
    board.board[cell.y / w][cell.x / w] = 1;
  });

  board.checkRows();
  curr = newPiece();
}

function checkY() {
  return curr.getBottomBounds() === HEIGHT;
}

function shift(dir) {
  if (!curr.collides(board, w * dir, 0))
    curr.translate(w * dir, 0);
}
function goodMove() {
  return !curr.collides(board, 0, w) && !checkY();
}

function shiftDown() {
  if (!goodMove())
    return false; // no i cannot shiftdown
  curr.translate(0, w);
  return true; // yes i can shift down
}

function rotate(dir) {
  curr.rotate(board, dir);
}

function drop() {
  while (goodMove())
    shiftDown();
  curr.lock();
}

function newPiece() {
  return new Tetromino(allPieces[Math.floor(Math.random() * allPieces.length)]);
}
