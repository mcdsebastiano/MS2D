include('Particles.js');

class Player {
  constructor(x, y) {
    this.r = 16;
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.dir = new Vector(Math.cos(0), Math.sin(0));
    this.heading = 0;
    this.isMoving = false;
    this.isSprinting = false;
    this.rotation = 0;
    // this.particles = new Particles({
    // x,
    // y
    // });
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  move(direction) {
    if (direction === 0) {
      this.isMoving = false;
    } else {
      this.isMoving = true;
      // if (this.dir.dot(this.pos) < 0) {
      this.dir.mult(direction);

      // }
    }
    // this.vel = new Vector(Math.cos(radians), Math.sin(-radians));
  }

  fire() {}

  update() {
    if (this.isMoving === true) {
      this.pos.add(this.dir);
    }
    // this.pos.add(this.dir);
    // this.particles.x = this.pos.x;
    // this.particles.y = this.pos.y;
  }

  scan(walls) {
    // this.particles.scan(walls);
  }

  paint() {
    setColor(WHITE);
    let a = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI;

    let t = Rect(0, 0, this.r, this.r)
      .translate(this.pos.x, this.pos.y)
      .rotateZ(-a, this);

  }
}
