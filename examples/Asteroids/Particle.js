class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(Math.cos(Math.random() * (Math.PI * 2)), Math.sin(Math.random() * (Math.PI * 2)));
  }
  
  update() {
    this.pos.add(this.vel);
  }

  paint() {
    vertexAt(this.pos.x, this.pos.y);
  }
}
