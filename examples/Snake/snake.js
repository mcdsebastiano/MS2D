let snakeParts = new Array(50 * 50);
let snakePos, food;
let cellSize = 25;
let snakeLen = 0;

let refreshRate = 6;
let ticker = 0;

const Direction = {
  NONE: 0,
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

let dir;

function setup() {
  clearColor(DARKGREEN)
  snakePos = {
    X: 250,
    Y: 250
  };

  snakeParts.fill({
    X: -25,
    Y: -25
  }, 0);

  food = {
    X: Math.floor((Math.random() * WIDTH) / cellSize) * cellSize,
    Y: Math.floor((Math.random() * HEIGHT) / cellSize) * cellSize
  };

  dir = Direction.NONE;
}

function draw() {
  drawBorder();
  board();
}

function update() {
  if (ticker % refreshRate == 0) {
    moveSnake();
  }
  
  if (snakeAte()) {
    food.X = Math.floor((Math.random() * WIDTH) / cellSize) * cellSize;
    food.Y = Math.floor((Math.random() * HEIGHT) / cellSize) * cellSize;
    snakeLen++;
  }
  ticker++;
  draw();
}

function keyPressed() {
  switch (key()) {
  case 'w':
    dir = Direction.UP;
    break;
  case 'a':
    dir = Direction.LEFT;
    break;
  case 's':
    dir = Direction.DOWN;
    break;
  case 'd':
    dir = Direction.RIGHT;
    break;
  }
}

function board() {
  let head = snakeParts[snakeLen];
  for (let i = 0; i < WIDTH; i += cellSize) {
    for (let j = 0; j < HEIGHT; j += cellSize) {
      if (j == head.Y && i == head.X) {
        setColor(ORANGE)
        fillRect(snakePos.X, snakePos.Y, cellSize, cellSize);
        setColor(BLACK);
        Rect(snakePos.X, snakePos.Y, cellSize, cellSize);
      } else if (j == food.Y && i == food.X) {
        setColor(rgba(255, 0, 0, 0.75));
        fillCircle(i, j, cellSize / 2);
        setColor(BLACK)
        Circle(i, j, cellSize / 2);
      } else {
        for (let k = 0; k < snakeLen; k++) {
          if (j == snakeParts[k].Y && i == snakeParts[k].X) {
            setColor(rgba(255, 120, 0, 0.55));
            fillRect(i, j, cellSize, cellSize);
            setColor(BLACK);
            Rect(i, j, cellSize, cellSize);
          }
        }
      }
    }
  }
}

function moveSnake() {
  for (let i = 0; i < snakeLen; i++) {
    snakeParts[i] = snakeParts[i + 1];
  }

  switch (dir) {
  case Direction.UP:
    snakePos.Y -= cellSize;
    break;
  case Direction.LEFT:
    snakePos.X -= cellSize;
    break;
  case Direction.DOWN:
    snakePos.Y += cellSize;
    break;
  case Direction.RIGHT:
    snakePos.X += cellSize;
    break;
  default:
    break;
  }

  snakeParts[snakeLen] = clone(snakePos);
}

function snakeAte() {
  return snakeParts[snakeLen].X == food.X && snakeParts[snakeLen].Y == food.Y;
}
