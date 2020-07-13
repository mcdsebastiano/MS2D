include('Board.js');

let board;

function setup() {
  board = new Board(50, 50, 400)
}

function draw() {
  drawBorder();
  board.paint();
}

// function update() {
  // draw();
// }
