include('Laser.js');

class Ship {
  constructor() {
    this.lasers = [];
    this.pos = new Vector(WIDTH / 2, HEIGHT / 2);
    this.heading = 0;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0); ;
    this.r = 10;
    this.rotation = 0;
    this.isThrusting = false;
    this.thrustAudio = document.createElement('audio');
    this.thrustAudio.src = 'assets/thrust.wav';
  }

  fire() {
    // TODO: set a fire rate for the lasers as per the original game.
    this.lasers.push(new Laser(this.pos, this.heading));
    let laserAudio = document.createElement('audio');
    laserAudio.src = 'assets/laser.wav';
    laserAudio.play();
  }

  setRotation(angle) {
    this.rotation = angle;
  }

  turn(angle) {
    this.heading += this.rotation;
  }

  thrusting(value) {
    this.isThrusting = value;
  }

  edges() {
    if (this.pos.x > WIDTH + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = WIDTH + this.r;
    }

    if (this.pos.y > HEIGHT + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = HEIGHT + this.r;
    }
  }

  thrust() {
    this.thrustAudio.play();
    let radian = (this.heading * Math.PI / 180);
    let force = new Vector(Math.cos(radian), Math.sin(-radian));
    force.mult(0.1);
    this.vel.add(force);
    // this.vel.mult(0.95);
  }

  update() {
    if (this.isThrusting === true) {
      this.thrust();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.995);
    this.turn();
  }

  paint() {
    setColor(WHITE);
    let ship = Triangle(-this.r, -this.r + 2, this.r, 0, -this.r, this.r - 2);
    // FIXME: a Shape() should be able to calculate it's own width and height
    // automatically.
    ship.h = 16;
    ship.w = 20;
    ship.translate(this.pos.x + ship.w / 2, this.pos.y + ship.h / 2);
    ship.rotateZ(this.heading, this);
  }
}
