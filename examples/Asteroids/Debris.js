include('Particle.js');

class Debris {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < 12; i++)
      this.particles[i] = new Particle(x, y);
  }

  update() {
    for (let i = 0; i < this.particles.length; i++)
      this.particles[i].update();
  }

  paint() {
    setColor(OFFWHITE);
    setAlpha(0.3);
    newShape();
    for (let i = 0; i < this.particles.length; i++)
      this.particles[i].paint();
    endShape();
  }
}
