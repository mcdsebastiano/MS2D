include('Ship.js');
include('Asteroid.js');
include('Debris.js');

let ship;
let asteroids = [];
let numberOfAsteroids = 12;
let debris = [];
let stars = [];

function setup() {
  clearColor(BLACK);
  ship = new Ship();

  for (let i = 0; i < numberOfAsteroids; i++) {
    asteroids.push(new Asteroid());
  }

  for (let i = 0; i < 75; i++) {
    stars.push({
      x: Math.floor(Math.random() * WIDTH) + 1,
      y: Math.floor(Math.random() * HEIGHT) + 1
    });
  }
}

function draw() {

  let bgUpperGradient = newShape();
  bgUpperGradient.fill();
  setColor(BLACK)
  drawLine(0, 0, WIDTH, 0);
  setColor(rgba(0, 0, 35, 0.95))
  drawLine(WIDTH, HEIGHT / 2, 0, HEIGHT / 2)
  endShape();

  let bgBottomGradient = newShape();
  bgBottomGradient.fill();
  setColor(rgba(0, 0, 35, 0.95))
  drawLine(0, HEIGHT / 2, WIDTH, HEIGHT / 2);
  setColor(BLACK)
  drawLine(WIDTH, HEIGHT, 0, HEIGHT)
  endShape();

  ship.paint();
  ship.edges();
  ship.update();

  asteroids.forEach(asteroid => {
    asteroid.paint()
    asteroid.edges();
    asteroid.update();
  });

  for (let i = 0; i < ship.lasers.length; i++) {
    ship.lasers[i].paint()
    ship.lasers[i].update();
    for (let j = 0; j < asteroids.length; j++) {
      if (ship.lasers[i].hits(asteroids[j])) {
        debris.push(new Debris(ship.lasers[i].pos.x, ship.lasers[i].pos.y));
        let pieces = asteroids[j].divide();
        if (pieces !== null) {
          asteroids.splice(j, 1, pieces[0], pieces[1]);
        } else {
          asteroids.splice(j, 1);
        }
        ship.lasers.splice(i, 1);
        break;
      }
    }
  }

  debris.forEach(d => {
    d.update();
    d.paint();
  });

  stars.forEach(star => {
    fillRect(star.x, star.y, 1.5, 1.5);
  })

}

function keyPressed() {
  switch (keyCode()) {
  case ARROW_UP:
    ship.thrusting(true);
    break;
  case ARROW_LEFT:
    ship.setRotation(4);
    break;
  case ARROW_RIGHT:
    ship.setRotation(-4);
    break;
  case ARROW_DOWN:
    break;
  case SPACE_BAR:
    ship.fire();
    break;
  default:
    break;
  }
}

function keyReleased() {
  switch (keyCode()) {
  case ARROW_UP:
    ship.thrusting(false);
    break;
  case ARROW_LEFT:
  case ARROW_RIGHT:
    ship.setRotation(0);
    break;
  }

}

function update() {
  draw()
}
