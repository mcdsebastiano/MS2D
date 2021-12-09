class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude() {
    return Math.round(Math.abs(Math.sqrt((this.x * this.x) + (this.y * this.y))));
  }

  normalize() {
    let m = this.magnitude();
    if (m !== 0) {
      this.mult(1 / this.magnitude());
    }
    return this;
  }
}

Vector.prototype.dot = (other) => {

  let a = this.x * other.x
    let b = this.y * other.y;

  return a + b
}
