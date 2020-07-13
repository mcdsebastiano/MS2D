class Laser {
  constructor(pos, heading) {
    this.pos = new Vector(pos.x, pos.y);
    let angle = heading * Math.PI / 180;
    this.vel = new Vector(Math.cos(angle), Math.sin(-angle));
    this.vel.mult(6);
  }
  update() {
    this.pos.add(this.vel);
  }

  hits(asteroid) {
    // lazy collision detection based on the radius
    // this is not perfect since the asteroids are not
    // a perfect circle. TODO: implement polygonal collision
    // detection

    let dist = Math.sqrt((asteroid.pos.x - this.pos.x) * (asteroid.pos.x - this.pos.x) + (asteroid.pos.y - this.pos.y) * (asteroid.pos.y - this.pos.y));
    if (dist < asteroid.r) {
      return true;
    }
    return false;
  }

  paint() {
    setColor(WHITE);
    let laser = fillRect(this.pos.x, this.pos.y, 2, 2);
  }
}
