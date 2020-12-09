include('Ray.js')

class Particles {
  constructor(pos) {
    this.pos = pos;
    this.rays = [];
    for (let i = 0; i < 360; i++) {
      this.rays.push(new Ray(this.pos, i * Math.PI / 180))
    }
  }

  update(x, y) {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
  }

  scan(walls) {
    for (let ray of this.rays) {
      let closest = new Vector();
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.intersects(wall);
        if (typeof pt !== 'undefined') {
          let distance = Math.sqrt((this.pos.x - pt.x) * (this.pos.x - pt.x) + (this.pos.y - pt.y) * (this.pos.y - pt.y));
          if (distance < record) {
            record = distance;
            closest = pt;
          }
        }
      }
      if (typeof closest !== 'undefined') {}
    }
  }
  
}
