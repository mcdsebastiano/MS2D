/*TODO: redo with vectors!! */

let paddleHeight, paddleWidth, paddleX, paddleY;
let ballY, ballX, ballRadius;
let ball, paddle;
let bricks = [];
let dx = -3;

const brickHeight = 10;
const brickPadding = 3;
const brickWidth = 50;
const leftOffset = 5;
const topOffset = 50;

const numCols = Math.floor(WIDTH / (brickWidth + brickPadding));

let g = 3;
const w = 10;

function setup() {
  ballY = Math.ceil((HEIGHT - w) / 3);
  ballX = Math.ceil((WIDTH - w) / 2);
  ballRadius = w / 2;

  paddleHeight = 10;
  paddleWidth = 100;

  paddleX = (WIDTH - paddleWidth) / 2
  paddleY = HEIGHT - paddleHeight;

  for (let i = 0; i < 8; i++) {
    bricks[i] = [];
    for (let j = 0; j < numCols; j++) {
      let x = (j * (brickWidth + brickPadding)) + leftOffset;
      let y = (i * (brickHeight + brickPadding)) + topOffset;
      bricks[i][j] = {
        x,
        y,
        status: 1
      }
    }
  }
}

function draw() {
  drawBorder();
  ball = fillCircle(ballX, ballY, ballRadius);
  paddle = fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
  drawBricks();
}

function update() {
  draw();
  updateBallPosition();
  detectCollisions();
}

function keyPressed() {
  switch (key()) {
  case 'a':
    shift(-1);
    break;
  case 'd':
    shift(1);
    break;
  default:
    break;
  }
}

function updateBallPosition() {
  ballY += g;
  ballX += dx;
}

function detectCollisions() {
  if (ballY >= paddle.y - ballRadius && ballX >= paddle.x && ballX <= paddle.x + paddle.w || ballY === 0)
    g *= -1;
  if (ball.x + dx > WIDTH - ballRadius || ball.x + dx < ballRadius)
    dx *= -1;
  if (ballY >= HEIGHT) {
    resetCanvas();
  }
  for (let i = 0; i < bricks.length; i++) {
    for (let j = 0; j < bricks[i].length; j++) {
      if (bricks[i][j].status === 1) {
        if (ballX >= bricks[i][j].x && ballX < bricks[i][j].x + brickWidth && ballY > bricks[i][j].y && ballY < bricks[i][j].y + brickHeight) {
          g *= -1;
          bricks[i][j].status = 0;
        }
      }
    }
  }
}

function drawBricks() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < numCols; j++) {
      if (bricks[i][j].status === 1) {
        let x = (j * (brickWidth + brickPadding)) + leftOffset;
        let y = (i * (brickHeight + brickPadding)) + topOffset;
        bricks[i][j].x = x;
        bricks[i][j].y = y;
        Rect(x, y, brickWidth, brickHeight);
      }
    }
  }
}

function shift(dir) {
  let x = 50 * dir;
  if (paddle.x + x < 0 || paddle.x + paddle.w + x > WIDTH)
    return;
  paddleX += x;
}
