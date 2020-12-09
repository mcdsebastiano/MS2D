include('Player.js');
include('Boundary.js');

let walls;
let player;
let mX, mY;

let y2 = 90;

let rScale;

function setup() {
  clearColor(BLACK);

  walls = [];
  walls.push(new Boundary(0, 0, WIDTH, 0));
  walls.push(new Boundary(WIDTH, 0, WIDTH, HEIGHT));
  walls.push(new Boundary(WIDTH, HEIGHT, 0, HEIGHT));
  walls.push(new Boundary(0, HEIGHT, 0, 0));

  player = new Player(WIDTH / 2, HEIGHT / 2);
  rScale = 1;
}

function draw() {
  clear();

  for (let wall of walls) {
    wall.paint();
  }

  player.scan(walls);
  player.paint();
  setAlpha(0.1);
  // drawLine(player.pos.x, player.pos.y, mX, mY);

  let r = 8 * rScale;
  fillCircle(mX - r, mY - r, r);
  setAlpha(1);
}

function update() {
  player.update();
  draw();
}

function mouseMove() {
  mX = mouseX();
  mY = mouseY();
  player.lookAt(mX, mY);
}

function mousePressed() {
  rScale = 2;
  player.fire();
}

function mouseReleased() {
  rScale = 1;
}

function keyPressed(event) {

  switch (key()) {
  case ' ':
    if (player.isMoving === true) {
      player.isSprinting = true;
    }
    break;
  case 'w':
    player.move(1)
    break;
  case 's':
    player.move(-1);
    break;
  default:
    break;
  }
}

function keyReleased(event) {

  switch (key()) {
  case ' ':
    if (player.isMoving === true && player.isSprinting === true) {
      player.isSprinting = false;
    }
    break;
  case 'w':
  case 's':
    player.move(0);
    break;
  case 'a':
  case 'd':
    // player.rotation = 0;
    break;
  }

}
