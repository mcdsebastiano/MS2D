class Asteroid {
  constructor(x, y, r, total) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      this.pos = new Vector(x, y)
    } else {
      this.pos = new Vector(Math.floor(Math.random() * WIDTH + 1), Math.floor(Math.random() * HEIGHT + 1));
    }
    this.r = r || 32;
    this.total = total || Math.floor(Math.random() * 5) + 7;
    this.vel = new Vector(Math.cos(Math.random() * (Math.PI * 2)), Math.sin(Math.random() * (Math.PI * 2)));
    this.offset = [];
    for (let i = 0; i < this.total; i++) {
      this.offset[i] = Math.floor(Math.random() * Math.floor(this.r / 2)) - this.total;
    }
  }

  update() {
    this.pos.add(this.vel)
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

  divide() {
    let explosionAudio = document.createElement('audio');
    explosionAudio.src = 'assets/sm_explosion.wav';
    explosionAudio.play();

    if (this.r > 14) {
      return [new Asteroid(this.pos.x, this.pos.y, Math.floor(this.r / 1.5), this.total - 1 > 6 ? this.total - 1 : this.total), new Asteroid(this.pos.x, this.pos.y, Math.floor(this.r / 1.5), this.total - 1 > 6 ? this.total - 1 : this.total)];
    }
    return null;
  }

  paint() {
    let asteroid = newShape();
    asteroid.noFill();
    for (let i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, Math.PI * 2);
      let r = this.r + this.offset[i];
      var x = r * Math.cos(angle);
      var y = r * Math.sin(angle);
      vertexAt(x, y);
    }
    endShape();
    asteroid.translate(this.pos.x, this.pos.y);
  }
}
