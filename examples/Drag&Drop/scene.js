let r, rX, rY, rW, drag;

function setup() {
  rW = rY = rX = 100;
  drag = {
    x: 0,
    y: 0
  };
}

function draw() {
  drawBorder();
  r = fillRect(rX, rY, rW, rW);
}

function update() {
  draw();
}

function mousePressed() {
  dragStart(mouseX(), mouseY(), rX, rY, rW, rW);
}

function mouseMove() {
  let move;
  if (move = dragMove(dragX(), dragY())) {
    rX = move.x;
    rY = move.y;
  }
}

function mouseReleased() {
  dragEnd();
}
