const Vector = function (x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;
}

Vector.prototype.mult = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
}
